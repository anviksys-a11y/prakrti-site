#!/usr/bin/env python3
"""Make the share images (src/og/og-en.png, og-ja.png) from the built site's own fonts, styles and map.

Run after `python3 build.py`, whenever the home headline or the map changes:
    pip install playwright && python3 -m playwright install chromium   (first time only)
    python3 tools/make_og.py && python3 build.py

The map on the right is drawn by the site's own script (assets/site.js), the same code as the
home page: <div data-realm-map="gita-end" data-legend> is the scene "The end of the Gita".
To show another scene, change SCENE to one of: dice, eve, gita-open, gita-end, vow, raid.
"""
import os

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(HERE, "dist")
OUT = os.path.join(HERE, "src", "og")
SCENE = "gita-end"
TEXT = {
    "en": ("Read your own mind with the Gītā and AI.", "The verses guide. The AI carries. You decide.",
           "The map of three kingdoms"),
    "ja": ("ギーターと AI で、自分の心を読み解く。", "聖句が導き、AI が運び、あなたが決める。",
           "三国の地図"),
}
PAGE = """<!doctype html><html lang="{lang}" data-lang="{lang}" data-root="./"><head><meta charset="utf-8">
<link rel="stylesheet" href="assets/site.css"><style>
body{{margin:0;width:1200px;height:630px;background:var(--bg);overflow:hidden}}
.og{{box-sizing:border-box;width:1200px;height:630px;padding:48px 56px 48px 64px;display:grid;
     grid-template-columns:minmax(0,1fr) 452px;gap:44px;align-items:center;border-left:14px solid var(--silk-fill)}}
.og .txt{{display:grid;gap:12px;align-content:center}}
.og .gm-deva{{font-size:50px}} .og .gm-latin{{font-size:84px}}
.og h1{{font-size:{h1size}px;line-height:1.22;margin-top:4px}} .og .motto{{font-size:26px}}
.og .fullname{{border:0;padding:0;margin:0}} .og .fn-short{{font-size:27px}} .og .fn-long{{font-size:21px}}
.og .mapbox{{display:grid;gap:12px;padding:18px 18px 16px;background:var(--surface);border:1px solid var(--rule);border-radius:6px}}
.og .mapbox .eyebrow{{margin:0}}
.og .rlegend{{font-size:17px}} .og .rlegend .state{{font-size:15px}}
.og .rm-over>*{{animation:none}}
</style></head><body><div class="og">
<div class="txt">
<p class="fullname"><span class="fn-short">Prakrti GSA</span><span class="fn-long">Prakrti Gita Strategic Architecture</span></p>
<p class="gita-mark"><span class="gm-deva" lang="sa">भगवद्गीता</span><span class="gm-latin">Bhagavad Gītā</span></p>
<h1>{h1}</h1><p class="motto">{motto}</p></div>
<div class="mapbox"><p class="eyebrow">{eyebrow}</p><div data-realm-map="{scene}" data-legend></div></div>
</div><script src="assets/site.js"></script></body></html>"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    for lang, (h1, motto, eyebrow) in TEXT.items():
        tmp = os.path.join(DIST, f"_og_{lang}.html")
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(PAGE.format(lang=lang, h1=h1, motto=motto, eyebrow=eyebrow, scene=SCENE,
                                h1size=44 if lang == "en" else 38))
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.goto("file://" + tmp, wait_until="load")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(500)
        if not page.query_selector(".rmap"):
            raise SystemExit("the map did not draw; is dist/assets/site.js built?")
        page.screenshot(path=os.path.join(OUT, f"og-{lang}.png"))
        os.remove(tmp)
    browser.close()
print("Wrote src/og/og-en.png and src/og/og-ja.png")
