#!/usr/bin/env python3
"""Download open-licensed anatomy figures from Wikimedia Commons.

The script re-checks live license metadata and refuses anything that is not
public domain, CC0, CC BY, or CC BY-SA. Files are saved in their original format.

Run:  python scripts/download-sourced-images.py
"""

from __future__ import annotations

import html
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = os.path.join(REPO, "public", "images", "lessons")
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "BodySchoolLessonImages/1.0 (school project; anatomy curriculum)"}

ACCEPT = ("public domain", "cc0", "cc by", "cc by-sa", "cc-by", "cc-by-sa", "pd")
REJECT = ("nc", "nd", "fair use", "copyrighted")

# (Commons File: title, local filename, credit author, credit license label)
PHOTOS = [
    ("Human skeleton front en.svg", "sourced-skeleton.svg", "Mariana Ruiz Villarreal (LadyofHats)", "Public domain"),
    ("Illu muscle tissues.jpg", "sourced-muscle-tissues.jpg", "National Cancer Institute SEER", "Public domain"),
    ("Illu muscle structure.jpg", "sourced-muscle-structure.jpg", "National Cancer Institute SEER", "Public domain"),
    ("622 Longitudinal Bone Growth.jpg", "sourced-bone-growth.jpg", "OpenStax College", "CC BY 4.0"),
    ("Heart diagram blood flow en.svg", "sourced-heart-flow.svg", "ZooFari", "CC BY-SA 3.0"),
    ("Respiratory system complete en.svg", "sourced-respiratory.svg", "Mariana Ruiz Villarreal (LadyofHats)", "Public domain"),
    ("Alveoli.svg", "sourced-alveoli.svg", "helix84", "CC BY 2.5"),
    ("Digestive system diagram en.svg", "sourced-digestive.svg", "Mariana Ruiz Villarreal (LadyofHats)", "Public domain"),
    ("Stomach colon rectum diagram-en.svg", "sourced-intestines.svg", "Medium69 / Indolences", "Public domain"),
    ("Illu urinary system.jpg", "sourced-urinary.jpg", "National Cancer Institute SEER", "Public domain"),
    ("Kidney nephron.png", "sourced-nephron.png", "Henry Gray (Gray's Anatomy)", "Public domain"),
    ("Human head and brain diagram.svg", "sourced-brain.svg", "Patrick J. Lynch", "CC BY 2.5"),
    ("Neuron.svg", "sourced-neuron.svg", "Dhp1080", "CC BY-SA 3.0"),
    ("Illu endocrine system.jpg", "sourced-endocrine.jpg", "National Cancer Institute SEER", "Public domain"),
    ("Illu thyroid parathyroid.jpg", "sourced-thyroid.jpg", "National Cancer Institute SEER", "Public domain"),
    ("Illu adrenal gland.jpg", "sourced-adrenal.jpg", "National Cancer Institute SEER", "Public domain"),
    ("Illu pituitary pineal glands.jpg", "sourced-pituitary.jpg", "National Cancer Institute SEER", "Public domain"),
    ("Skin layers.svg", "sourced-skin-layers.svg", "Madhero88 and M.Komorniczak", "CC BY-SA 3.0"),
    ("Illu lymphatic system.jpg", "sourced-lymphatic.jpg", "National Cancer Institute SEER", "Public domain"),
    ("Diagram of a lymph node CRUK 022.svg", "sourced-lymph-node.svg", "Cancer Research UK", "CC BY-SA 4.0"),
]


def clean(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", " ", s or "")).strip()


def api(params: dict):
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers=UA)
    last = None
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            last = e
            if e.code != 429:
                raise
            time.sleep(8 * (attempt + 1))
    raise last  # noqa: B904


def fetch(title: str):
    data = api(
        {
            "action": "query",
            "format": "json",
            "titles": f"File:{title}",
            "prop": "imageinfo",
            "iiprop": "url|mime|extmetadata",
            "iiextmetadatafilter": "LicenseShortName|Artist",
        }
    )
    pages = (data.get("query") or {}).get("pages") or {}
    page = next(iter(pages.values()))
    if page.get("missing") is not None:
        raise SystemExit(f"REFUSED {title}: file missing")
    info = (page.get("imageinfo") or [{}])[0]
    meta = info.get("extmetadata") or {}
    lic = clean((meta.get("LicenseShortName") or {}).get("value", ""))
    low = lic.lower()
    if any(r in low for r in REJECT) or not any(a in low for a in ACCEPT):
        raise SystemExit(f"REFUSED {title}: license {lic!r} is not reusable")
    if not info.get("url"):
        raise SystemExit(f"REFUSED {title}: no file URL returned")
    return info["url"], info.get("mime", ""), lic


def download(url: str) -> bytes:
    last = None
    for attempt in range(5):
        try:
            req = urllib.request.Request(url.split("?")[0], headers=UA)
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(3 * (attempt + 1))
    raise last  # noqa: B904


def main() -> None:
    os.makedirs(TARGET, exist_ok=True)
    for title, local, _author, _license in PHOTOS:
        url, _mime, live_lic = fetch(title)
        time.sleep(1.2)
        dest = os.path.join(TARGET, local)
        raw = download(url)
        with open(dest, "wb") as f:
            f.write(raw)
        print(f"OK {local} ({os.path.getsize(dest) / 1024:.0f} KB) [{live_lic}]")
    print(f"\n{len(PHOTOS)} sourced figures in {TARGET}")


if __name__ == "__main__":
    main()
