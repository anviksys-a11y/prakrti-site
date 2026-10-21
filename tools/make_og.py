#!/usr/bin/env python3
"""Make the share images (src/og/og-en.png, og-ja.png) from the built site's own fonts.

Run after `python3 build.py`, whenever the home headline changes:
    pip install playwright && python3 -m playwright install chromium   (first time only)
    python3 tools/make_og.py && python3 build.py
"""
import os

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(HERE, "dist")
OUT = os.path.join(HERE, "src", "og")
TEXT = {
    "en": ("Read your own mind with the Gītā and AI.", "The verses guide. The AI carries. You decide."),
    "ja": ("ギーターと AI で、自分の心を読み解く。", "聖句が導き、AI が運び、あなたが決める。"),
}
PAGE = """<!doctype html><html lang="{lang}" data-lang="{lang}"><head><meta charset="utf-8">
<link rel="stylesheet" href="assets/site.css"><style>
body{{margin:0;width:1200px;height:630px;background:var(--bg);overflow:hidden}}
.og{{box-sizing:border-box;width:1200px;height:630px;padding:58px 76px;display:grid;align-content:center;gap:14px;border-left:14px solid var(--silk-fill)}}
.og .gm-deva{{font-size:62px}} .og .gm-latin{{font-size:118px}}
.og h1{{font-size:{h1size}px;line-height:1.2;margin-top:6px}} .og .motto{{font-size:30px}}
.og .fullname{{border:0;padding:0;margin:0}} .og .fn-short{{font-size:30px}} .og .fn-long{{font-size:24px}}
</style></head><body><div class="og">
<p class="fullname"><span class="fn-short">Prakrti GSA</span><span class="fn-long">Prakrti Gita Strategic Architecture</span></p>
<p class="gita-mark"><span class="gm-deva" lang="sa">भगवद्गीता</span><span class="gm-latin">Bhagavad Gītā</span></p>
<h1>{h1}</h1><p class="motto">{motto}</p></div></body></html>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    for lang, (h1, motto) in TEXT.items():
        tmp = os.path.join(DIST, f"_og_{lang}.html")
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(PAGE.format(lang=lang, h1=h1, motto=motto, h1size=56 if lang == "en" else 50))
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.goto("file://" + tmp, wait_until="load")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(400)
        page.screenshot(path=os.path.join(OUT, f"og-{lang}.png"))
        os.remove(tmp)
    browser.close()
print("Wrote src/og/og-en.png and src/og/og-ja.png")
