#!/usr/bin/env python3
"""Build the Prakrti GSA introduction site.

src/site.html  bilingual content (elements marked class="en" / class="ja")
src/site.css   styles
src/site.js    interactive parts (world map, archer taste, small Gita lens, language quizzes, app-style map)
src/fonts/     the six site fonts (SIL Open Font License), served from this site
site.config.json  base URL, contact address, invitation form URL

Output: dist/  (English at /, Japanese at /ja/, one folder per page)
Run:    python3 build.py
The build stops with an error if a page uses a forbidden word, if an English
page shows Japanese text outside the legal original, if a link or font file is
missing, or if a page loads anything from another host.
"""
import bisect
import hashlib
import html
import json
import os
import posixpath
import re
import shutil
import sys

from bs4 import BeautifulSoup, NavigableString

try:
    import budoux
except ImportError:
    sys.exit("build.py needs BudouX for Japanese line breaks. Run: pip install budoux")

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
DIST = os.path.join(HERE, "dist")
CONFIG = json.load(open(os.path.join(HERE, "site.config.json"), encoding="utf-8"))
BASE = CONFIG["base_url"].rstrip("/")
EMAIL = CONFIG["contact_email"]
INVITE_URL = CONFIG.get("invite_form_url", "").strip()
APP_URL = CONFIG["app_url"].rstrip("/")   # the app itself; "#app" and "#app:/path" in site.html point here
INVITE_OPEN = bool(CONFIG.get("invite_open", True))   # false until the test launch
# false: every page carries <meta name="robots" content="noindex, nofollow"> and robots.txt names no sitemap,
# so search engines do not list the site (2026-10-24, until the app is ready). firebase.json also sends
# X-Robots-Tag on every file; turn both back on together (README "検索に出さない").
INDEXING = bool(CONFIG.get("search_indexing", True))

# Fonts are served from the site itself, so a visit sends nothing to another host.
# src/fonts/fonts.css holds one @font-face per subset; only the subsets that cover
# a character the site uses are copied into dist/assets/fonts/.
FONT_DIR = os.path.join(SRC, "fonts")

# The pages ask for assets/site.css and assets/site.js with "?v=" and a short hash of the
# two files. The server lets a browser keep the two files for an hour; without the hash a
# returning visitor could get a new page with the old script, and the new parts would not
# draw. The hash is filled in after the files are made (see main()).
ASSET_V = "@@ASSET_V@@"
FACE = re.compile(r"@font-face\{[^}]*\}")

# page token -> folder name ("" is the language home)
PAGES = [
    ("home", ""),
    ("world", "world"),
    ("starter", "starter-set"),
    ("engine", "how-judging-works"),
    ("rpd", "rpd"),
    ("premium", "premium"),
    ("schools", "schools"),
    ("principles", "principles"),
    ("readings", "readings"),
    ("join", "join"),
    ("support", "classroom-support"),   # 2026-10-24: free help for yoga classrooms
    ("support-guide", "classroom-support/guide"),     # 2026-10-24: the guide (from the Claude Docs doc)
    ("support-replay", "classroom-support/replay"),   # 2026-10-24: an invented replay (from the Claude Docs doc)
    ("stories", "stories"),   # 2026-10-24: invented stories of what the design is for (labelled as fiction)
    ("company", "company"),
    ("legal", "legal"),
    ("official-terms", "official-table-terms"),   # 2026-10-24: linked from nowhere until official tables go on sale
]
SLUG = dict(PAGES)

META = {
    "home": {
        "en": ("Prakrti GSA | An AI app for self-inquiry with the Bhagavad Gītā",
               "Talk through what troubles you with an AI grounded in the Bhagavad Gītā. The conversation becomes a card of your mind's pattern, tested in the Gītā's light, repaired with others and checked against your life."),
        "ja": ("Prakrti GSA | バガヴァッド・ギーターと歩む、自己探究の AI アプリ",
               "バガヴァッド・ギーターに根ざした AI と、迷いを話す。話は一枚の心の型のカードになり、ギーターの光で試し、人と直し合い、暮らしの中で確かめます。"),
    },
    "world": {
        "en": ("World map | Prakrti GSA",
               "Every part of Prakrti GSA on one map: the Starter Set, the workshop, the Arena, the Exchange, the scripture hall, Ashrams and game tables."),
        "ja": ("世界地図 | Prakrti GSA",
               "Prakrti GSA のすべてを一枚の地図で。スターターセット、工房、The Arena、Exchange、聖典の間、Ashram、遊びの卓。"),
    },
    "starter": {
        "en": ("Starter Set | Prakrti GSA",
               "Three free things to play first, none of them using AI: The Charioteer and the Archer, Fetching Water Episode 0, and the verse board with the language room."),
        "ja": ("スターターセット | Prakrti GSA",
               "最初に遊ぶ無料の三つ。どれも AI を使いません。『御者と射手』『水を汲みに 第0話』、聖句盤と語学教室。"),
    },
    "engine": {
        "en": ("How judging works | Prakrti GSA",
               "The AI reads each turn and a fixed formula decides. Pressure, ceiling and reserve, the prediction seal, the inner memo and the map of three kingdoms."),
        "ja": ("判定のしくみ | Prakrti GSA",
               "AI は読み、数式が決める。圧・天井・心の体力、予言の封、本音メモ、三国の地図。"),
    },
    "rpd": {
        "en": ("Mahābhārata RPD | Prakrti GSA",
               "Tabletop role-playing techniques for reading the epic and looking at yourself. You live in the margins of history."),
        "ja": ("Mahābhārata RPD | Prakrti GSA",
               "テーブルトーク RPG の技法で叙事詩を読み、自分を省みる。あなたは歴史の余白を生きます。"),
    },
    "premium": {
        "en": ("Premium | Prakrti GSA",
               "US$199 a month, tax included, one price. Premium opens every AI feature for individual use."),
        "ja": ("Premium | Prakrti GSA",
               "月額 199 米ドル（税込）、価格は一つ。個人で使う AI の機能がすべて開きます。"),
    },
    "schools": {
        "en": ("For yoga schools | Prakrti GSA",
               "A School License for RYT200 cohorts: the school pays and trainees join free. $199 a month for up to 12 trainees."),
        "ja": ("ヨガの学校へ | Prakrti GSA",
               "RYT200 の講座のための School License。払うのは学校で、受講生は無料。12 名まで月 $199。"),
    },
    "principles": {
        "en": ("Principles | Prakrti GSA",
               "No rankings, observation that stays yours, pseudonyms, publishing on purpose, and a formula that judges in place of the AI."),
        "ja": ("原則 | Prakrti GSA",
               "順位を出さない、観測は本人だけ、仮名、公開は自分の意思で、判定は AI ではなく数式。"),
    },
    "readings": {
        "en": ("Two readings | Prakrti GSA",
               "The battle within, read two ways: Paramahansa Yogananda's reading of the Gita and Prakrti GSA's three kingdoms, side by side."),
        "ja": ("二つの読み方 | Prakrti GSA",
               "心の戦いを二通りに読む。パラマハンサ・ヨガナンダのギーターの読みと、Prakrti GSA の三つの国の読みを並べて。"),
    },
    "join": {
        "en": ("Join us: open Mahābhārata RPD tables | Prakrti GSA",
               "We are looking for yoga teachers and game masters to open Mahābhārata RPD tables with us, online, in their own Ashrams. Any fee is the host's; we take no commission."),
        "ja": ("仲間を募る：Mahābhārata RPD の卓を一緒に開く人 | Prakrti GSA",
               "Mahābhārata RPD の卓を一緒に開く、ヨガの先生と、卓を進める人（GM）を探しています。オンラインの卓を、ご自身の Ashram で。参加費は卓を開く人のもの。手数料はいただきません。"),
    },
    "support": {
        "en": ("Classroom support | Prakrti GSA",
               "Free help for yoga teachers and studios: the verse board, Sanskrit in the language room, writing Sutras, ways to play, running Mahābhārata RPD tables, and marketing to grow your classroom."),
        "ja": ("教室の支援 | Prakrti GSA",
               "ヨガの先生とスタジオへの無償の支援。聖句盤、語学教室のサンスクリット、Sutra の書き方、遊び方、Mahābhārata RPD の卓の進め方、そして教室を大きくする集客まで。"),
    },
    "support-guide": {
        "en": ("Running an RPD table in your classroom | Prakrti GSA",
               "A guide for yoga teachers who run Mahābhārata RPD tables themselves, without AI: formats, preparation, the day's timetable, game master principles, dice and clocks, and safety."),
        "ja": ("教室で開く RPD の卓——手引き | Prakrti GSA",
               "ヨガの先生が、AI を使わずに Mahābhārata RPD の卓を開くための手引き。会の形、準備、当日の時間割、GM の心得、サイコロと時計、安全。"),
    },
    "support-replay": {
        "en": ("Replay: The Rising Ford | Prakrti GSA",
               "An invented two-hour session of The Rising Ford in a yoga classroom, written up to read. It gives away the whole story."),
        "ja": ("リプレイ『増水の渡し場』——ある教室の雨の夜 | Prakrti GSA",
               "架空のヨガの教室で開いた『増水の渡し場』の 2 時間の会を、読み物にしたもの。筋と結末を明かします。"),
    },
    "stories": {
        "en": ("Stories: in a classroom, and alone | Prakrti GSA",
               "Four invented stories of how Prakrti GSA is meant to be used: a yoga teacher's philosophy half hour, a teacher training, one person facing a Monday meeting, and an engineering director's launch week. Fiction, labelled as such."),
        "ja": ("物語——教室で、ひとりで | Prakrti GSA",
               "Prakrti GSA の設計が目指す使われ方を、四つの創作の物語にしました。ヨガの先生の哲学の時間、指導者養成講座、月曜の会議に向かう一人の人、そしてエンジニアリング・ディレクターのローンチの週。"),
    },
    "company": {
        "en": ("Company | Prakrti GSA",
               "Anviksiki Simulation Systems Inc., Tokyo, the company behind Prakrti GSA."),
        "ja": ("会社 | Prakrti GSA",
               "Prakrti GSA を運営する株式会社Anviksiki Simulation Systems（東京）。"),
    },
    "legal": {
        "en": ("Legal notices | Prakrti GSA",
               "Where to find the Specified Commercial Transactions Act notice, the Terms of Service and the Privacy Policy for Prakrti GSA."),
        "ja": ("法務の表記 | Prakrti GSA",
               "Prakrti GSA の特定商取引法に基づく表記、利用規約、プライバシーポリシーの掲載先。"),
    },
    "official-terms": {
        "en": ("Official Table Terms | Prakrti GSA",
               "The terms for official tables, the paid online Mahābhārata RPD tables hosted by Anviksiki Simulation Systems Inc.: booking, cancellations and refunds, table rules and table records."),
        "ja": ("公式の卓 参加規約 | Prakrti GSA",
               "株式会社Anviksiki Simulation Systems が主催する有料のオンラインの卓「公式の卓」の参加規約。申込み、キャンセルと返金、卓の決まり、卓の記録の扱い。"),
    },
}

OG_ALT = {
    "en": "Prakrti GSA. Bhagavad Gītā. Read your own mind with the Gītā and AI.",
    "ja": "Prakrti GSA。バガヴァッド・ギーター。ギーターと AI で、自分の心を読み解く。",
}

COPYRIGHT = {
    "en": "© 2026 Anviksiki Simulation Systems Inc.",
    "ja": "© 2026 株式会社Anviksiki Simulation Systems",
}

# words the game screens never use; the site follows the same rule
BANNED = re.compile(
    r"salvation|enlighten|\bguru|therap|\bheal(s|ed|ing|er)?\b|\bchosen\b|救い|悟り|修行|カウンセリング|癒やし|癒し|浄化",
    re.I)
JA_CHARS = re.compile(r"[　-ヿ㐀-鿿＀-￯]")

# Japanese display text breaks only between phrases. Chrome can do this by itself
# (word-break: auto-phrase) but Safari and Firefox cannot, so the build marks the
# phrase boundaries with <wbr> for every browser.
JA_PARSER = budoux.load_default_japanese_parser()
PHRASED = ("h1, h2, h3, h4, .eyebrow, .lede, .btn, .link-arrow, .motto, .big-verse blockquote p, .cta-note, .pd-line, "
           ".doc-body td, .doc-body th")  # the guide and replay tables: short cells must not split mid-word


ROBOTS = "" if INDEXING else '<meta name="robots" content="noindex, nofollow">\n'


def page_dir(lang, token):
    parts = (["ja"] if lang == "ja" else []) + ([SLUG[token]] if SLUG[token] else [])
    return "/".join(parts)


def rel(from_dir, to_dir):
    r = posixpath.relpath(to_dir or ".", from_dir or ".")
    return "./" if r == "." else r + "/"


def absolute(lang, token):
    d = page_dir(lang, token)
    return BASE + "/" + (d + "/" if d else "")


def invite_block(lang, kind):
    """The invitation section: a form link once a form exists, an email address until then."""
    school = kind == "school"
    if not INVITE_OPEN:
        if lang == "en":
            text = ("School applications open with the test launch. This page will say how to apply."
                    if school else
                    "Invitations open with the test launch. This page will say how to apply.")
        else:
            text = ("学校のお申し込みは、テストローンチと同時に受け付けを始めます。申し込み方法は、そのときこのページでお知らせします。"
                    if school else
                    "招待の受け付けは、テストローンチと同時に始めます。申し込み方法は、そのときこのページでお知らせします。")
        return f'<div class="invite-block"><p class="muted">{text}</p></div>'
    if INVITE_URL:
        if lang == "en":
            text = "The form takes about a minute. We reply by email."
            label = "Request an invitation"
        else:
            text = "フォームの入力は一分ほどです。返事はメールでお送りします。"
            label = "招待を申し込む"
        return (f'<div class="invite-block"><p>{text}</p>'
                f'<a class="btn btn-primary" href="{html.escape(INVITE_URL)}" rel="noopener" style="justify-self:start">{label}</a></div>')
    if lang == "en":
        text = ("Write to us with your school's name, the number of trainees and when your cohort starts."
                if school else
                "Write to us with your name and a line about what brings you to Prakrti GSA.")
        copy_label, copied = "Copy", "Copied"
    else:
        text = ("学校の名前、受講生の人数、講座の始まる時期を添えて、メールでお知らせください。"
                if school else
                "お名前と、Prakrti GSA に関心を持った理由をひとこと添えて、メールでお知らせください。")
        copy_label, copied = "コピー", "コピーしました"
    mail = html.escape(EMAIL)
    return (f'<div class="invite-block"><p>{text}</p>'
            f'<div class="copy-row"><span class="mail">{mail}</span>'
            f'<button type="button" class="btn btn-sm" data-copy="{mail}">{copy_label}</button>'
            f'<span class="note" data-copied hidden>{copied}</span></div></div>')


def phrase_breaks(soup, root):
    """Put <wbr> between the Japanese phrases of headings, ledes and buttons, and mark them .ph."""
    targets = root.select(PHRASED)
    chosen = set(map(id, targets))
    for el in targets:
        if any(id(p) in chosen for p in el.parents):
            continue
        nodes = [n for n in el.find_all(string=True) if n.parent.name not in ("script", "style")]
        text = "".join(nodes)
        if not JA_CHARS.search(text):
            continue
        # a short table cell (about six Japanese characters wide or less) stays on one line (.doc-body .nw in site.css)
        if el.name in ("td", "th") and sum(1 if JA_CHARS.match(c) else 0.55 for c in text.strip()) <= 6.2:
            el["class"] = el.get("class", []) + ["nw"]
            continue
        cuts, pos = [], 0
        for part in JA_PARSER.parse(text)[:-1]:
            pos += len(part)
            cuts.append(pos)
        start = 0
        for n in nodes:
            s = str(n)
            end = start + len(s)
            local = [c - start for c in cuts if start <= c < end]
            # a link inside the text (not the text itself) stays in one piece: Chrome breaks at <wbr> even in nowrap
            if local and any(p.name == "a" for p in n.parents if p is not el and el in p.parents):
                local = []
            if local:
                pieces, prev = [], 0
                for c in local:
                    if c > prev:
                        pieces.append(NavigableString(s[prev:c]))
                    pieces.append(soup.new_tag("wbr"))
                    prev = c
                pieces.append(NavigableString(s[prev:]))
                n.replace_with(*pieces)
            start = end
        el["class"] = el.get("class", []) + ["ph"]


def build_page(raw, lang, token):
    other = "ja" if lang == "en" else "en"
    soup = BeautifulSoup(raw, "html.parser")
    for el in soup.select("." + other):
        el.decompose()
    header = soup.select_one("header.site-head")
    footer = soup.select_one("footer.foot")
    section = soup.select_one(f'section.page[data-page="{token}"]')
    cur = page_dir(lang, token)

    for part in (header, section, footer):
        for a in part.find_all("a", href=True):
            h = a["href"]
            tok, _, frag = h[1:].partition("#")
            if h.startswith("#") and tok in SLUG:   # "#engine" or "#engine#scenes"
                a["href"] = rel(cur, page_dir(lang, tok)) + ("#" + frag if frag else "")
            elif h == "#app" or h.startswith("#app:"):
                a["href"] = APP_URL + (h[5:] if h.startswith("#app:") else "/")
    for a in header.select("[data-nav]"):
        if a["data-nav"] == token:
            a["aria-current"] = "page"
        elif a.has_attr("aria-current"):
            del a["aria-current"]

    switch = header.select_one(".lang")
    switch.clear()
    for code, label in (("en", "EN"), ("ja", "JA")):
        link = soup.new_tag("a", href=rel(cur, page_dir(code, token)))
        link["hreflang"] = code
        link["lang"] = code
        if code == lang:
            link["aria-current"] = "true"
        link.string = label
        switch.append(link)
    menu = header.select_one("#menu-btn")
    if menu is not None:
        menu["aria-controls"] = "site-nav"

    if section.has_attr("hidden"):
        del section["hidden"]
    for el in section.select("[data-invite-label]"):
        del el["data-invite-label"]
        if not INVITE_OPEN:   # until the test launch: no "Request an invitation" wording
            el.clear()
            el.string = ("Invitations" if el.name == "h2" else "About Premium") if lang == "en" else \
                        ("招待について" if el.name == "h2" else "Premium について")
    for box in section.select(".invite"):
        box.replace_with(BeautifulSoup(invite_block(lang, box.get("data-pre", "self")), "html.parser"))
    mail = section.select_one("#contact-mail")
    if mail is not None:
        mail.string = EMAIL
        mail["class"] = mail.get("class", []) + ["mail"]
        del mail["id"]
        row = mail.parent
        row["class"] = row.get("class", []) + ["copy-row"]
        if row.has_attr("style"):
            del row["style"]
        btn = row.select_one("[data-copy]")
        if btn is not None:
            btn["data-copy"] = EMAIL
    proto = footer.select_one(".proto")
    if proto is not None:
        proto.clear()
        proto.string = COPYRIGHT[lang]
    for table in section.select("table"):
        heads = []
        for th in table.select("thead th"):   # data-short-en / data-short-ja: a shorter name for phones
            heads.append(th.get("data-short-" + lang) or th.get_text(" ", strip=True))
            for code in ("en", "ja"):
                if th.has_attr("data-short-" + code):
                    del th["data-short-" + code]
        for tr in table.select("tbody tr") if heads else []:
            for i, td in enumerate(tr.find_all("td", recursive=False)):
                if i < len(heads) and heads[i]:
                    td["data-label"] = heads[i]   # shown on phones, where the table becomes stacked rows
    if lang == "ja":
        for part in (header, section, footer):
            phrase_breaks(soup, part)

    title, desc = META[token][lang]
    canonical = absolute(lang, token)
    prefix = rel(cur, "")
    lang_root = rel(cur, "ja" if lang == "ja" else "")
    org = ""
    if token in ("home", "company"):
        org = ('<script type="application/ld+json">' + json.dumps({
            "@context": "https://schema.org", "@type": "Organization",
            "name": "Anviksiki Simulation Systems Inc.", "url": BASE + "/",
            "email": EMAIL, "brand": {"@type": "Brand", "name": "Prakrti GSA"},
        }, ensure_ascii=False) + "</script>\n")
    skip = "Skip to content" if lang == "en" else "本文へ移動"
    head = f"""<!doctype html>
<html lang="{lang}" data-lang="{lang}" data-root="{lang_root}" data-app="{APP_URL}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{ROBOTS}<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="en" href="{absolute('en', token)}">
<link rel="alternate" hreflang="ja" href="{absolute('ja', token)}">
<link rel="alternate" hreflang="x-default" href="{absolute('en', token)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Prakrti GSA">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="{'en_US' if lang == 'en' else 'ja_JP'}">
<meta property="og:image" content="{BASE}/og-{lang}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{html.escape(OG_ALT[lang])}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F0F2F6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F1528" media="(prefers-color-scheme: dark)">
<link rel="icon" href="{prefix}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{prefix}assets/site.css?v={ASSET_V}">
<script src="{prefix}assets/site.js?v={ASSET_V}" defer></script>
{org}</head>
<body>
<a class="skip" href="#main">{skip}</a>
"""
    body = f'{header}\n<main id="main">\n{section}\n</main>\n{footer}\n</body>\n</html>\n'
    return head + body


def page_404():
    return """<!doctype html>
<html lang="en" data-lang="en" data-root="/">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Page not found | Prakrti GSA</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css?v=""" + ASSET_V + """">
</head>
<body>
<main id="main" class="wrap page-head">
<p class="eyebrow">404</p>
<h1>This road is not on the map.</h1>
<p class="lede">The page you asked for does not exist. <span lang="ja">お探しのページは見つかりませんでした。</span></p>
<div class="cta-row"><a class="btn btn-primary" href="/">Prakrti GSA</a><a class="btn" href="/ja/" lang="ja">日本語のトップへ</a></div>
</main>
</body>
</html>
"""


FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><polygon points="28.1,9 28.1,23 16,30 3.9,23 3.9,9 16,2" fill="#E0AF42" stroke="#182039" stroke-width="2"/><circle cx="16" cy="16" r="4.2" fill="#182039"/></svg>
"""


def sitemap():
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for token, _ in PAGES:
        for lang in ("en", "ja"):
            lines.append("  <url>")
            lines.append(f"    <loc>{absolute(lang, token)}</loc>")
            lines.append(f'    <xhtml:link rel="alternate" hreflang="en" href="{absolute("en", token)}"/>')
            lines.append(f'    <xhtml:link rel="alternate" hreflang="ja" href="{absolute("ja", token)}"/>')
            lines.append(f'    <xhtml:link rel="alternate" hreflang="x-default" href="{absolute("en", token)}"/>')
            lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def used_codepoints(texts):
    """Every character the site can show: page markup, scripts and styles, escapes decoded."""
    used = set()
    for t in texts:
        t = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), t)
        t = re.sub(r"\\([0-9a-fA-F]{1,6})\s?", lambda m: chr(int(m.group(1), 16)), t)
        used.update(ord(c) for c in html.unescape(t))
    return sorted(used)


def unicode_ranges(spec):
    """'U+0000-00FF,U+0131,U+4??' -> [(0x0, 0xFF), (0x131, 0x131), (0x400, 0x4FF)]"""
    out = []
    for part in spec.split(","):
        part = part.strip()[2:]
        if "?" in part:
            out.append((int(part.replace("?", "0"), 16), int(part.replace("?", "F"), 16)))
        elif "-" in part:
            lo, hi = part.split("-")
            out.append((int(lo, 16), int(hi, 16)))
        else:
            out.append((int(part, 16), int(part, 16)))
    return out


def font_faces(used):
    """The @font-face rules (and their files) whose unicode-range covers a used character."""
    rules, files = [], []
    for rule in FACE.findall(open(os.path.join(FONT_DIR, "fonts.css"), encoding="utf-8").read()):
        m = re.search(r"unicode-range:([^;}]+)", rule)
        if m:
            hit = False
            for lo, hi in unicode_ranges(m.group(1)):
                i = bisect.bisect_left(used, lo)
                if i < len(used) and used[i] <= hi:
                    hit = True
                    break
            if not hit:
                continue
        rules.append(rule)
        files.append(re.search(r"url\(fonts/([^)]+)\)", rule).group(1))
    return rules, files


def check(pages):
    problems = []
    js = open(os.path.join(DIST, "assets", "site.js"), encoding="utf-8").read()
    for m in BANNED.finditer(js):
        problems.append(f"assets/site.js: forbidden word '{m.group(0)}'")
    css = open(os.path.join(DIST, "assets", "site.css"), encoding="utf-8").read()
    for ref in re.findall(r"url\(\s*([^)\s]+)\s*\)", css):
        ref = ref.strip("'\"")
        if ref.startswith(("data:", "#")):
            continue
        if re.match(r"^(https?:)?//", ref):
            problems.append(f"assets/site.css: loads from another host: {ref}")
        elif not os.path.exists(os.path.join(DIST, "assets", ref)):
            problems.append(f"assets/site.css: missing file {ref}")
    for path, (lang, markup) in pages.items():
        soup = BeautifulSoup(markup, "html.parser")
        for s in soup(["script", "style"]):
            s.decompose()
        text = soup.get_text(" ")
        for m in BANNED.finditer(text):
            problems.append(f"{path}: forbidden word '{m.group(0)}'")
        if lang == "en":
            for el in soup.select('[lang="ja"]'):
                el.decompose()
            found = set(JA_CHARS.findall(soup.get_text(" ")))
            if found:
                problems.append(f"{path}: Japanese characters on an English page: {''.join(sorted(found))[:40]}")
        here = posixpath.dirname(path)
        for a in BeautifulSoup(markup, "html.parser").find_all(["a", "link", "script", "img", "iframe"]):
            ref = a.get("href") or a.get("src")
            loads = a.name in ("script", "img", "iframe") or (
                a.name == "link" and set(a.get("rel", [])) & {"stylesheet", "preload", "preconnect", "modulepreload", "icon"})
            if ref and loads and re.match(r"^(https?:)?//", ref):
                problems.append(f"{path}: loads from another host: {ref}")
                continue
            if ref and ref.startswith("#") and len(ref) > 1:   # a place on this page
                if not re.search(r'(?<![\w-])id="%s"' % re.escape(ref[1:]), markup):
                    problems.append(f"{path}: no place {ref} on this page")
                continue
            if not ref or re.match(r"^(https?:|mailto:|tel:|#|data:)", ref):
                continue
            target = posixpath.normpath(posixpath.join(here, ref.split("#")[0].split("?")[0]))
            full = os.path.join(DIST, target)
            if ref.endswith("/") or os.path.isdir(full):
                full = os.path.join(full, "index.html")
            if not os.path.exists(full):
                problems.append(f"{path}: broken link {ref}")
            elif "#" in ref and ref.split("#", 1)[1]:   # a place on another page
                with open(full, encoding="utf-8") as f:
                    if not re.search(r'(?<![\w-])id="%s"' % re.escape(ref.split("#", 1)[1]), f.read()):
                        problems.append(f"{path}: no place {ref}")
    return problems


def main():
    raw = open(os.path.join(SRC, "site.html"), encoding="utf-8").read()
    css = open(os.path.join(SRC, "site.css"), encoding="utf-8").read()
    js = open(os.path.join(SRC, "site.js"), encoding="utf-8").read()
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(os.path.join(DIST, "assets", "fonts"))
    shutil.copy(os.path.join(SRC, "site.js"), os.path.join(DIST, "assets", "site.js"))
    pages = {}
    for lang in ("en", "ja"):
        for token, _ in PAGES:
            d = page_dir(lang, token)
            path = posixpath.join(d, "index.html") if d else "index.html"
            pages[path] = (lang, build_page(raw, lang, token))
    used = used_codepoints([m for _, m in pages.values()] + [page_404(), js, css])
    rules, files = font_faces(used)
    for name in files:
        shutil.copy(os.path.join(FONT_DIR, name), os.path.join(DIST, "assets", "fonts", name))
    for name in os.listdir(FONT_DIR):
        if name.startswith("LICENSE"):
            shutil.copy(os.path.join(FONT_DIR, name), os.path.join(DIST, "assets", "fonts", name))
    full_css = "/* fonts: SIL Open Font License 1.1, see fonts/LICENSE-*.txt */\n" + "\n".join(rules) + "\n" + css
    with open(os.path.join(DIST, "assets", "site.css"), "w", encoding="utf-8") as f:
        f.write(full_css)
    version = hashlib.sha256((full_css + "\n/*js*/\n" + js).encode("utf-8")).hexdigest()[:10]
    for path, (lang, markup) in list(pages.items()):
        markup = markup.replace(ASSET_V, version)
        os.makedirs(os.path.dirname(os.path.join(DIST, path)), exist_ok=True)
        with open(os.path.join(DIST, path), "w", encoding="utf-8") as f:
            f.write(markup)
        pages[path] = (lang, markup)
    with open(os.path.join(DIST, "404.html"), "w", encoding="utf-8") as f:
        f.write(page_404().replace(ASSET_V, version))
    font_bytes = sum(os.path.getsize(os.path.join(DIST, "assets", "fonts", n)) for n in files)
    for name in ("og-en.png", "og-ja.png"):   # share images (made from the site's own fonts)
        shutil.copy(os.path.join(SRC, "og", name), os.path.join(DIST, name))
    with open(os.path.join(DIST, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(FAVICON)
    with open(os.path.join(DIST, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap())
    with open(os.path.join(DIST, "robots.txt"), "w", encoding="utf-8") as f:
        # Crawling stays allowed so that a search engine can read the noindex; without indexing, no sitemap is named.
        f.write(f"User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n" if INDEXING else "User-agent: *\nAllow: /\n")
    problems = check(pages)
    for p in problems:
        print("PROBLEM:", p)
    print(f"Built {len(pages)} pages into dist/ (invitations {'open' if INVITE_OPEN else 'closed until the test launch'}; "
          f"{'listed in search engines' if INDEXING else 'hidden from search engines'}; assets ?v={version}).")
    print(f"Fonts: {len(files)} of {len(FACE.findall(open(os.path.join(FONT_DIR, 'fonts.css'), encoding='utf-8').read()))} "
          f"subset files are needed ({font_bytes / 1e6:.1f} MB on the server; a visitor downloads only the ones a page uses).")
    if problems:
        sys.exit(1)


if __name__ == "__main__":
    main()
