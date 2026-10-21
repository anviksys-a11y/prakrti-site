"""Open every page in a real browser and report problems.

For each of the 22 pages (found in dist/), at PC width (1280) and phone width (390):
  - JavaScript errors and console errors (a blocked script or font shows up here as a CSP error)
  - files that fail to load (404 and the like)
  - the page being wider than the screen (sideways scrolling on a phone)
Then every link on the rendered pages, including the ones site.js draws (the world map):
  - a link inside the site must open, and its #id must exist on the target page

    python3 build.py && python3 tools/check_site.py                  # local, like Firebase
    python3 tools/check_site.py --base https://prakrti-site.web.app --v <sha>   # production

Needs Playwright with Chromium (pip install playwright && playwright install chromium).
Exit code 1 when anything is found.
"""
import argparse
import os
import sys
import urllib.parse

from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(__file__))
import serve_like_firebase  # noqa: E402

WIDTHS = [("pc", 1280, 800), ("phone", 390, 844)]


def page_paths(dist):
    out = []
    for dirpath, _dirs, files in os.walk(dist):
        if "index.html" in files and "/assets" not in dirpath:
            rel = os.path.relpath(dirpath, dist)
            out.append("/" if rel == "." else "/" + rel.replace(os.sep, "/") + "/")
    return sorted(out, key=lambda p: (p.startswith("/ja/"), p))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", help="check this site instead of a local copy of dist/")
    ap.add_argument("--v", help="add ?v=<this> to each page (skips the browser cache after a deploy)")
    ap.add_argument("--dist", default="dist")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--no-links", action="store_true")
    args = ap.parse_args()

    server = None
    if args.base:
        base = args.base.rstrip("/")
    else:
        server = serve_like_firebase.start(args.dist, args.port, "firebase.json")
        base = f"http://127.0.0.1:{args.port}"
    host = urllib.parse.urlparse(base).netloc
    paths = page_paths(args.dist)
    problems, links = [], {}

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for label, w, h in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": h})
            for path in paths:
                url = base + path + (f"?v={args.v}" if args.v else "")
                page = ctx.new_page()
                found = []
                page.on("pageerror", lambda e, f=found: f.append(f"script error: {e}"))
                page.on("console", lambda m, f=found: m.type == "error" and f.append(f"console: {m.text}"))
                page.on("response", lambda r, f=found: r.status >= 400 and f.append(f"{r.status} {r.url}"))
                resp = page.goto(url, wait_until="networkidle")
                if not resp or resp.status != 200:
                    found.append(f"page status {resp.status if resp else 'none'}")
                over = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                if over > 1:
                    found.append(f"{over}px wider than the screen")
                if label == "pc" and not args.no_links:
                    for href in page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)"):
                        links.setdefault(href, path)
                for f in found:
                    problems.append(f"[{label}] {path}  {f}")
                page.close()
            ctx.close()
            print(f"{label}: {len(paths)} pages opened")

        if not args.no_links:
            ctx = browser.new_context()
            page = ctx.new_page()
            ids_cache, checked = {}, 0
            for href, src in sorted(links.items()):
                u = urllib.parse.urlparse(href)
                if u.scheme not in ("http", "https") or u.netloc != host:
                    continue  # mail, the app, other sites: not ours to test here
                target = u._replace(fragment="", query="").geturl()
                if target not in ids_cache:
                    r = page.goto(target, wait_until="networkidle")
                    ids_cache[target] = None if not r or r.status != 200 else set(
                        page.eval_on_selector_all("[id]", "els => els.map(e => e.id)"))
                checked += 1
                ids = ids_cache[target]
                if ids is None:
                    problems.append(f"[link] {src} -> {href}  page does not open")
                elif u.fragment and urllib.parse.unquote(u.fragment) not in ids:
                    problems.append(f"[link] {src} -> {href}  no id '{u.fragment}' on that page")
            print(f"links: {checked} links inside the site checked")
        browser.close()

    if server:
        server.shutdown()
    if problems:
        print(f"\n{len(problems)} problem(s):")
        print("\n".join(problems))
        sys.exit(1)
    print("No problems found.")


if __name__ == "__main__":
    main()
