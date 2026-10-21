"""Serve dist/ locally the way Firebase Hosting does.

Clean URLs with a trailing slash (/premium -> /premium/), the 404 page, and
the response headers from firebase.json (including the Content-Security-Policy),
so a page that works here also works in production.

    python3 tools/serve_like_firebase.py            # dist on port 8765
    python3 tools/serve_like_firebase.py dist 8765 firebase.json
"""
import fnmatch
import http.server
import json
import os
import sys
import threading


def _glob_to_fn(pattern):
    # Firebase globs: ** = anything, @(a|b) = one of. Enough for this site's firebase.json.
    if "@(" in pattern:
        head, rest = pattern.split("@(", 1)
        opts, tail = rest.split(")", 1)
        return [p for o in opts.split("|") for p in _glob_to_fn(head + o + tail)]
    return [pattern.replace("**", "*")]


def load_rules(config_path):
    with open(config_path, encoding="utf-8") as f:
        hosting = json.load(f)["hosting"]
    rules = []
    for block in hosting.get("headers", []):
        pats = _glob_to_fn(block["source"])
        rules.append((pats, [(h["key"], h["value"]) for h in block["headers"]]))
    return rules


def make_handler(root, rules):
    class Handler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=root, **kw)

        def log_message(self, *a):
            pass

        def end_headers(self):
            path = self.path.split("?", 1)[0].split("#", 1)[0]
            for pats, headers in rules:
                if any(fnmatch.fnmatch(path, p) for p in pats):
                    for k, v in headers:
                        self.send_header(k, v)
            super().end_headers()

        def do_GET(self):
            path = self.path.split("?", 1)[0]
            local = os.path.join(root, path.lstrip("/"))
            if not path.endswith("/") and os.path.isfile(os.path.join(local, "index.html")):
                self.send_response(301)
                self.send_header("Location", path + "/")
                self.end_headers()
                return
            if not os.path.exists(local) and not os.path.exists(local + ".html"):
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                with open(os.path.join(root, "404.html"), "rb") as f:
                    self.wfile.write(f.read())
                return
            if not os.path.exists(local) and os.path.exists(local + ".html"):
                self.path = path + ".html"
            super().do_GET()

    return Handler


def start(root="dist", port=8765, config="firebase.json"):
    """Start the server in a background thread and return it (call .shutdown())."""
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), make_handler(os.path.abspath(root), load_rules(config)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


if __name__ == "__main__":
    root, port, config = (sys.argv[1:] + ["dist", "8765", "firebase.json"][len(sys.argv) - 1:])[:3]
    srv = start(root, int(port), config)
    print(f"Serving {root} like Firebase at http://127.0.0.1:{port}/  (Ctrl+C to stop)")
    try:
        threading.Event().wait()
    except KeyboardInterrupt:
        srv.shutdown()
