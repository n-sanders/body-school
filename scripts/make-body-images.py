#!/usr/bin/env python3
"""Generate Body School diagrams: unlabeled organ cards and labeled lesson figures.

Organ files in public/images/organs/ have no visible text, so photo quizzes
cannot be answered by reading a label. Lesson files in public/images/lessons/
carry short labels because they are teaching pictures, not quiz photos.

Run:  python scripts/make-body-images.py
"""

from __future__ import annotations

import math
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORGANS = os.path.join(REPO, "public", "images", "organs")
LESSONS = os.path.join(REPO, "public", "images", "lessons")

BG = "#fbf6ef"
INK = "#2c2825"
MUTED = "#6d645c"
LINE = "#8d7f72"
CARD = "#fffdf9"
BONE = "#ead9bc"
BONE_D = "#c4ae8e"
MUSCLE = "#d4534e"
MUSCLE_D = "#a33b3b"
HEART = "#c53636"
LUNG = "#f4c3cb"
LUNG_D = "#e294a2"
ARTERY = "#d64545"
VEIN = "#3e6ea5"
STOMACH = "#e2b27a"
LIVER = "#8d4b2a"
GALL = "#3f8f62"
PANC = "#e4c15a"
INTEST = "#f0c4b2"
INTEST_D = "#d9a08c"
KIDNEY = "#d16b6b"
KIDNEY_D = "#a84e4e"
BRAIN = "#f0c6d4"
BRAIN_D = "#d9a3b6"
SKIN = "#f6d7b8"
SKIN_D = "#e2b48a"
LYMPH = "#7dcea0"
LYMPH_D = "#3e8f62"
SPLEEN = "#7b4f8d"
CREAM = "#fff8ee"
ACCENT = "#9c4324"

FONT = "font-family='Segoe UI, system-ui, sans-serif'"


def esc(s: str) -> str:
    return s.replace("&", " and ").replace("<", "(").replace(">", ")")


def T(x, y, s, size=16, anchor="middle", fill=INK, weight="normal"):
    w = "" if weight == "normal" else " font-weight='700'"
    return (
        f"<text x='{x}' y='{y}' text-anchor='{anchor}' font-size='{size}' "
        f"fill='{fill}'{w} {FONT}>{esc(s)}</text>"
    )


def R(x, y, w, h, fill, stroke=LINE, rx=10, sw=2):
    return (
        f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='{rx}' "
        f"fill='{fill}' stroke='{stroke}' stroke-width='{sw}'/>"
    )


def E(cx, cy, rx, ry, fill, stroke=INK, sw=2):
    return (
        f"<ellipse cx='{cx}' cy='{cy}' rx='{rx}' ry='{ry}' fill='{fill}' "
        f"stroke='{stroke}' stroke-width='{sw}'/>"
    )


def C(cx, cy, r, fill, stroke="none", sw=0):
    return f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='{fill}' stroke='{stroke}' stroke-width='{sw}'/>"


def P(d, fill, stroke=INK, sw=2, extra=""):
    return f"<path d='{d}' fill='{fill}' stroke='{stroke}' stroke-width='{sw}' {extra}/>"


def arrow(x1, y1, x2, y2, color=ACCENT, w=3.5):
    ang = math.atan2(y2 - y1, x2 - x1)
    L = 11
    p1 = (x2 - L * math.cos(ang - 0.45), y2 - L * math.sin(ang - 0.45))
    p2 = (x2 - L * math.cos(ang + 0.45), y2 - L * math.sin(ang + 0.45))
    return (
        f"<line x1='{x1}' y1='{y1}' x2='{x2}' y2='{y2}' stroke='{color}' stroke-width='{w}' "
        f"stroke-linecap='round'/>"
        f"<polygon points='{x2:.1f},{y2:.1f} {p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}' fill='{color}'/>"
    )


def doc(w, h, title, desc, body) -> str:
    return (
        "<?xml version='1.0' encoding='UTF-8'?>\n"
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}' role='img'>\n"
        f"<title>{esc(title)}</title><desc>{esc(desc)}</desc>\n"
        f"<rect width='100%' height='100%' fill='{BG}'/>\n{body}\n</svg>\n"
    )


def write(folder, name, w, h, title, desc, body) -> None:
    path = os.path.join(folder, name)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(doc(w, h, title, desc, body))


def torso() -> str:
    return (
        "<g fill='none' stroke='#d9cfc4' stroke-width='4' stroke-linejoin='round'>"
        "<circle cx='240' cy='46' r='26'/>"
        "<path d='M228 70 v22 h-78 l-8 78 18 8 28-70 v150 l18 28 h64 l18-28 v-150 l28 70 18-8 -8-78 h-78 v-22'/>"
        "</g>"
    )


def card(glyph: str, context: str, slug: str, title: str, desc: str) -> None:
    write(
        ORGANS,
        f"{slug}-diagram.svg",
        480,
        360,
        title,
        desc,
        f"<g transform='translate(240 188) scale(1.35) translate(-100 -100)'>{glyph}</g>",
    )
    write(
        ORGANS,
        f"{slug}-context.svg",
        480,
        360,
        f"{title} in the body",
        f"Where this structure sits: {desc}",
        torso() + f"<g transform='translate(240 200)'>{context}</g>",
    )


def g_skull() -> str:
    return "".join(
        [
            E(100, 78, 62, 54, BONE, BONE_D, 4),
            P("M48 108 Q40 150 62 168 Q100 188 138 168 Q160 150 152 108 Q130 124 100 124 Q70 124 48 108 Z", BONE, BONE_D, 4),
            C(74, 78, 14, "#3a342f"),
            C(126, 78, 14, "#3a342f"),
            P("M92 96 L100 118 L108 96 Z", "#cbb89a", BONE_D, 2),
            P("M68 150 h64", "none", BONE_D, 3),
            "".join(R(70 + i * 8, 146, 6, 12, "#fffaf3", BONE_D, 1, 1) for i in range(8)),
        ]
    )


def g_ribs() -> str:
    ribs = []
    for i, y in enumerate(range(48, 150, 16)):
        span = 28 + i * 6
        ribs.append(
            f"<path d='M100 {y} Q{100 - span} {y + 18} {100 - span + 8} {y + 34}' fill='none' stroke='{BONE_D}' stroke-width='5' stroke-linecap='round'/>"
        )
        ribs.append(
            f"<path d='M100 {y} Q{100 + span} {y + 18} {100 + span - 8} {y + 34}' fill='none' stroke='{BONE_D}' stroke-width='5' stroke-linecap='round'/>"
        )
    return R(92, 36, 16, 140, BONE, BONE_D, 6, 3) + "".join(ribs)


def g_spine() -> str:
    parts = []
    for i in range(8):
        y = 18 + i * 22
        x = 78 + int(10 * math.sin(i / 2.2))
        parts.append(R(x, y, 44, 16, BONE, BONE_D, 5, 2))
        parts.append(C(x + 16, y + 8, 4, "#f7f1e6", BONE_D, 1))
        parts.append(R(x + 36, y + 5, 14, 6, BONE_D, BONE_D, 2, 1))
    return "".join(parts)


def g_muscle() -> str:
    return "".join(
        [
            R(90, 24, 18, 150, BONE, BONE_D, 8, 3),
            C(99, 28, 16, BONE, BONE_D, 3),
            C(99, 170, 14, BONE, BONE_D, 3),
            P("M78 50 Q40 90 70 150 Q96 120 108 70 Z", MUSCLE, MUSCLE_D, 3),
            P("M112 58 Q150 96 124 148 Q104 110 100 70 Z", "#e07a6a", MUSCLE_D, 3),
            "<path d='M62 80 h28 M58 100 h30 M64 120 h24' stroke='#fff6f4' stroke-width='2' fill='none'/>",
        ]
    )


def g_heart() -> str:
    return "".join(
        [
            P(
                "M100 40 C100 28 78 16 62 32 C46 48 52 70 70 88 L100 118 L130 88 C148 70 154 48 138 32 C122 16 100 28 100 40 Z",
                HEART,
                "#8e2424",
                3,
            ),
            P("M70 20 Q100 8 132 28", "none", ARTERY, 6),
            P("M100 48 L100 108 M72 78 L128 78", "none", "#f6d0d0", 2),
            C(84, 62, 7, "#f4d2d2"),
            C(116, 66, 7, "#f4d2d2"),
        ]
    )


def g_vessels() -> str:
    return "".join(
        [
            P("M70 150 C70 90 40 70 28 40", "none", ARTERY, 7),
            P("M70 110 C40 100 30 80 18 78", "none", ARTERY, 4),
            P("M70 90 C96 70 110 50 108 28", "none", ARTERY, 4),
            P("M130 150 C130 90 160 70 176 36", "none", VEIN, 7),
            P("M130 108 C160 100 168 82 184 76", "none", VEIN, 4),
            P("M100 150 v-40", "none", "#7a6a62", 3),
            C(100, 96, 5, MUSCLE),
            C(28, 40, 4, ARTERY),
            C(176, 36, 4, VEIN),
        ]
    )


def g_lungs() -> str:
    return "".join(
        [
            R(92, 8, 16, 36, "#f7e7ea", LUNG_D, 6, 3),
            P("M100 40 L70 70", "none", LUNG_D, 5),
            P("M100 40 L132 68", "none", LUNG_D, 5),
            P("M18 78 Q18 170 78 176 Q104 150 96 78 Q60 60 18 78 Z", LUNG, LUNG_D, 3),
            P("M112 74 Q150 58 184 84 Q190 168 124 176 Q100 148 112 74 Z", LUNG, LUNG_D, 3),
            P("M40 100 Q60 120 48 150 M150 100 Q168 124 156 150", "none", "#fff", 2),
        ]
    )


def g_diaphragm() -> str:
    return "".join(
        [
            P("M30 70 Q55 40 95 78 Q70 110 30 100 Z", LUNG, LUNG_D, 2),
            P("M110 74 Q150 40 176 78 Q150 108 112 98 Z", LUNG, LUNG_D, 2),
            P("M16 108 Q100 168 184 108 Q160 132 100 138 Q40 132 16 108 Z", MUSCLE, MUSCLE_D, 3),
            P("M24 96 Q16 140 28 150 M176 96 Q186 140 172 150", "none", BONE_D, 4),
        ]
    )


def g_stomach() -> str:
    return "".join(
        [
            P("M70 30 Q60 70 78 100 Q40 150 86 168 Q150 184 160 120 Q168 60 120 48 Q90 40 70 30 Z", STOMACH, "#b8884e", 3),
            P("M92 78 Q110 100 96 130", "none", "#f6e2c4", 3),
            R(78, 12, 12, 28, "#f3d7b0", "#b8884e", 4, 2),
        ]
    )


def g_liver() -> str:
    return "".join(
        [
            P("M18 70 Q20 36 78 40 Q110 30 150 58 Q186 90 160 140 Q110 160 40 132 Q12 112 18 70 Z", LIVER, "#6b341c", 3),
            P("M78 48 Q92 90 70 130", "none", "#6b341c", 3),
            P("M118 108 Q132 140 150 132 Q156 112 140 104 Z", GALL, "#246746", 2),
        ]
    )


def g_pancreas() -> str:
    bumps = "".join(C(40 + i * 16, 100 + (4 if i % 2 else -4), 12, PANC, "#b89030", 2) for i in range(8))
    stomach = P("M30 40 Q20 80 50 100 Q30 130 70 140 Q120 150 130 90 Q120 40 70 36 Z", "#f6e6cf", "#e2d3bc", 2)
    return stomach + bumps + P("M36 100 H156", "none", "#b89030", 6)


def g_small_intestine() -> str:
    coils = []
    for i in range(5):
        y = 36 + i * 28
        d = f"M30 {y} Q70 {y - 16} 100 {y} Q140 {y + 16} 170 {y}"
        coils.append(f"<path d='{d}' fill='none' stroke='{INTEST_D}' stroke-width='14' stroke-linecap='round'/>")
        coils.append(f"<path d='{d}' fill='none' stroke='{INTEST}' stroke-width='8' stroke-linecap='round'/>")
    return "".join(coils)


def g_large_intestine() -> str:
    frame = (
        f"<path d='M40 40 H150 Q176 40 176 70 V150 Q176 176 146 176 H70 Q40 176 40 146 V70 Q40 40 70 40' "
        f"fill='none' stroke='{INTEST_D}' stroke-width='18' stroke-linecap='round'/>"
        f"<path d='M40 40 H150 Q176 40 176 70 V150 Q176 176 146 176 H70 Q40 176 40 146 V70 Q40 40 70 40' "
        f"fill='none' stroke='{INTEST}' stroke-width='10'/>"
    )
    inner = P("M70 80 Q100 70 120 96 Q90 110 80 140", "none", "#f6e0d4", 8)
    return frame + inner


def g_kidneys() -> str:
    return "".join(
        [
            P("M40 40 Q18 80 36 130 Q60 156 78 120 Q90 80 70 40 Q58 28 40 40 Z", KIDNEY, KIDNEY_D, 3),
            P("M160 40 Q182 80 164 130 Q140 156 122 120 Q110 80 130 40 Q142 28 160 40 Z", KIDNEY, KIDNEY_D, 3),
            P("M58 70 Q70 90 60 112", "none", "#f8e4e4", 3),
            P("M142 70 Q130 90 140 112", "none", "#f8e4e4", 3),
            P("M62 124 C80 150 80 150 96 168", "none", KIDNEY_D, 4),
            P("M138 124 C120 150 120 150 104 168", "none", KIDNEY_D, 4),
            E(100, 176, 22, 14, "#f3c9c4", KIDNEY_D, 3),
        ]
    )


def g_brain() -> str:
    sulci = "<path d='M40 70 Q70 50 90 78 Q120 48 150 80 M46 96 Q80 80 110 104 Q140 86 160 108' fill='none' stroke='#c4849c' stroke-width='3'/>"
    return "".join(
        [
            P("M30 90 Q28 40 90 34 Q150 24 176 70 Q186 120 140 132 Q100 146 60 124 Q20 112 30 90 Z", BRAIN, BRAIN_D, 3),
            sulci,
            P("M120 124 Q150 150 168 132 Q150 118 132 128 Z", "#e7b0c4", BRAIN_D, 2),
            R(92, 140, 16, 28, BRAIN_D, BRAIN_D, 6, 1),
        ]
    )


def g_cord() -> str:
    nerves = []
    for i, y in enumerate(range(30, 180, 24)):
        nerves.append(f"<path d='M100 {y} L{40 if i % 2 == 0 else 160} {y + 10}' stroke='#e2b84a' stroke-width='3' fill='none'/>")
        nerves.append(R(86, y - 8, 28, 14, BONE, BONE_D, 4, 2))
    return "".join(nerves) + "<path d='M100 16 V186' stroke='#e2b84a' stroke-width='8' fill='none' stroke-linecap='round'/>"


def g_thyroid() -> str:
    rings = "".join(
        f"<path d='M86 {y} H114' stroke='#d8c8b8' stroke-width='3'/>" for y in range(36, 160, 16)
    )
    return "".join(
        [
            R(84, 16, 32, 168, "#f6efe6", "#d8c8b8", 12, 2),
            rings,
            P("M86 70 Q40 60 36 100 Q40 146 90 130 Q78 96 86 70 Z", "#c45b58", "#8d3a38", 3),
            P("M114 70 Q160 60 164 100 Q160 146 110 130 Q122 96 114 70 Z", "#c45b58", "#8d3a38", 3),
            P("M86 112 H114", "#c45b58", "#8d3a38", 8),
        ]
    )


def g_adrenal() -> str:
    return g_kidneys() + "".join(
        [
            P("M36 36 L62 18 L78 42 Z", "#e6c15c", "#b89030", 2),
            P("M164 36 L138 18 L122 42 Z", "#e6c15c", "#b89030", 2),
        ]
    )


def g_skin() -> str:
    return "".join(
        [
            R(16, 36, 168, 28, "#f3c49a", "#c99262", 4, 2),
            R(16, 64, 168, 70, SKIN, SKIN_D, 4, 2),
            R(16, 134, 168, 36, "#f7e7d4", "#e2c8aa", 4, 2),
            P("M70 20 v18 Q70 80 86 110", "none", "#6b5344", 4),
            C(70, 18, 6, "#6b5344"),
            P("M120 100 Q132 124 120 146", "none", VEIN, 3),
            C(148, 96, 8, "#f7d2d2", ARTERY, 2),
        ]
    )


def g_nodes() -> str:
    nodes = []
    for x, y in ((40, 50), (100, 36), (150, 70), (70, 120), (130, 150)):
        nodes.append(E(x, y, 18, 12, LYMPH, LYMPH_D, 2))
        nodes.append(C(x - 4, y, 3, "#e9fff2"))
    vessels = "<path d='M40 50 C70 40 80 40 100 36 C130 50 140 60 150 70 M70 120 C100 130 110 140 130 150 M100 48 V140' fill='none' stroke='#3e8f62' stroke-width='3'/>"
    return vessels + "".join(nodes)


def g_spleen() -> str:
    return "".join(
        [
            P("M120 40 Q150 36 160 80 Q150 130 110 120 Q90 70 120 40 Z", "#f6e6cf", "#e2d3bc", 2),
            P("M36 48 Q20 90 48 150 Q100 168 112 110 Q120 60 78 46 Q56 40 36 48 Z", SPLEEN, "#5c386b", 3),
        ]
    )


ORGANS_SPEC = [
    ("skull", "Skull", "Cranium, jaw, eye openings, and teeth.", g_skull, "translate(-70 -150) scale(0.85)"),
    ("rib-cage", "Rib cage", "Sternum with paired curved ribs.", g_ribs, "translate(-70 -130) scale(0.8)"),
    ("spine", "Spine", "Stacked vertebrae with a gentle curve.", g_spine, "translate(-78 -150) scale(0.78)"),
    ("skeletal-muscle", "Skeletal muscle", "Bone with a muscle that has light stripes.", g_muscle, "translate(-78 -120) scale(0.7)"),
    ("heart", "Heart", "Muscular pump with an arching vessel on top.", g_heart, "translate(-55 -130) scale(0.85)"),
    ("blood-vessels", "Blood vessels", "Branching red and blue tubes.", g_vessels, "translate(-70 -120) scale(0.7)"),
    ("lungs", "Lungs", "Windpipe splitting into two spongy lungs.", g_lungs, "translate(-78 -130) scale(0.75)"),
    ("diaphragm", "Diaphragm", "Dome-shaped muscle under the lungs.", g_diaphragm, "translate(-78 -120) scale(0.75)"),
    ("stomach", "Stomach", "J-shaped sac under a short tube.", g_stomach, "translate(-70 -120) scale(0.75)"),
    ("liver", "Liver", "Large brown organ with a small green sac.", g_liver, "translate(-85 -130) scale(0.8)"),
    ("pancreas", "Pancreas", "Long bumpy gland lying across the belly.", g_pancreas, "translate(-78 -110) scale(0.7)"),
    ("small-intestine", "Small intestine", "Coiled narrow tube.", g_small_intestine, "translate(-78 -120) scale(0.7)"),
    ("large-intestine", "Large intestine", "Wider tube framing a coil.", g_large_intestine, "translate(-78 -120) scale(0.72)"),
    ("kidneys", "Kidneys", "Two bean-shaped filters draining to a bladder.", g_kidneys, "translate(-78 -140) scale(0.72)"),
    ("brain", "Brain", "Wrinkled cerebrum, smaller cerebellum, and stalk.", g_brain, "translate(-55 -145) scale(0.7)"),
    ("spinal-cord", "Spinal cord", "Cord inside vertebrae with side branches.", g_cord, "translate(-78 -140) scale(0.7)"),
    ("thyroid-gland", "Thyroid gland", "Butterfly-shaped gland on the windpipe.", g_thyroid, "translate(-70 -130) scale(0.7)"),
    ("adrenal-glands", "Adrenal glands", "Small caps sitting on the kidneys.", g_adrenal, "translate(-78 -140) scale(0.7)"),
    ("skin", "Skin", "Layered skin with a hair and a gland.", g_skin, "translate(-70 -80) scale(0.85)"),
    ("lymph-nodes", "Lymph nodes", "Small beans along thin vessels.", g_nodes, "translate(-70 -100) scale(0.75)"),
    ("spleen", "Spleen", "Smooth purple organ beside a pale stomach.", g_spleen, "translate(-70 -120) scale(0.75)"),
]


def panel(x, y, w, h, heading) -> str:
    return R(x, y, w, h, CARD) + T(x + w / 2, y + 28, heading, 15, fill=ACCENT)


def lesson_levels() -> str:
    labels = ["Cell", "Tissue", "Organ", "System", "Body"]
    colors = ["#f7d7a8", LUNG, HEART, LYMPH, "#f3e6c8"]
    body = T(400, 36, "From one cell to the whole body", 22, weight="bold")
    for i, (lab, col) in enumerate(zip(labels, colors)):
        x = 36 + i * 150
        body += R(x, 80, 130, 250, CARD)
        body += C(x + 65, 160, 18 + i * 8, col, INK, 2)
        body += T(x + 65, 280, lab, 16, weight="bold")
        if i < 4:
            body += arrow(x + 132, 160, x + 148, 160)
    return body


def lesson_tissues() -> str:
    body = T(400, 36, "Four tissue types", 22, weight="bold")
    titles = ["Epithelial", "Connective", "Muscle", "Nervous"]
    notes = ["covers surfaces", "connects parts", "can shorten", "carries signals"]
    for i, (title, note) in enumerate(zip(titles, notes)):
        x = 30 + (i % 4) * 190
        body += panel(x, 70, 170, 250, title)
        body += T(x + 85, 290, note, 13, fill=MUTED)
    body += R(50, 130, 130, 16, SKIN, SKIN_D, 3, 2)
    body += R(50, 150, 130, 40, "#f7e7d4", "#e2c8aa", 3, 2)
    body += C(250, 150, 10, BONE)
    body += C(280, 180, 14, "#e7d3ef")
    body += C(240, 190, 8, LYMPH)
    body += P("M430 140 Q470 180 430 220", "none", MUSCLE, 10)
    body += P("M620 130 L700 170 L640 210 L610 160 Z", "none", "#e2b84a", 3)
    body += C(700, 170, 8, "#e2b84a")
    return body


def lesson_organ() -> str:
    body = T(400, 40, "An organ uses more than one tissue", 22, weight="bold")
    body += P("M180 80 Q150 160 210 250 Q300 300 360 200 Q390 120 300 90 Q230 70 180 80 Z", STOMACH, "#b8884e", 3)
    body += T(560, 120, "Lining: epithelial", 16, anchor="start")
    body += T(560, 160, "Wall: muscle", 16, anchor="start")
    body += T(560, 200, "Nerves: signals", 16, anchor="start")
    body += T(560, 240, "Blood: connective", 16, anchor="start")
    body += arrow(520, 120, 360, 130)
    body += arrow(520, 200, 300, 200)
    return body


def lesson_link() -> str:
    body = T(400, 40, "Systems depend on each other", 22, weight="bold")
    boxes = [("Muscles", MUSCLE), ("Blood", ARTERY), ("Lungs", LUNG), ("Food", STOMACH)]
    for i, (name, col) in enumerate(boxes):
        x = 70 + i * 180
        body += R(x, 140, 140, 90, col, INK, 16, 2)
        body += T(x + 70, 192, name, 18, weight="bold", fill="#fff" if name != "Lungs" and name != "Food" else INK)
        if i < 3:
            body += arrow(x + 142, 185, x + 176, 185)
    body += T(400, 300, "Moving needs oxygen, blood, and fuel together", 16, fill=MUTED)
    return body


def lesson_jobs() -> str:
    body = T(400, 40, "Jobs of the skeleton", 22, weight="bold")
    jobs = ["Shape and support", "Protect organs", "Anchor muscles", "Store calcium", "Make blood cells"]
    for i, job in enumerate(jobs):
        y = 80 + i * 58
        body += R(80, y, 640, 48, CARD)
        body += C(112, y + 24, 12, BONE, BONE_D, 2)
        body += T(150, y + 30, job, 18, anchor="start")
    return body


def lesson_joints() -> str:
    body = T(400, 40, "Joints do not all move the same way", 22, weight="bold")
    body += panel(40, 80, 230, 280, "Fixed")
    body += R(100, 180, 50, 40, BONE, BONE_D, 4, 3) + R(155, 180, 50, 40, BONE, BONE_D, 4, 3)
    body += T(155, 280, "skull seams", 14, fill=MUTED)
    body += panel(290, 80, 230, 280, "Hinge")
    body += R(350, 160, 110, 28, BONE, BONE_D, 8, 3)
    body += R(430, 188, 28, 80, BONE, BONE_D, 8, 3)
    body += T(405, 300, "knee, elbow", 14, fill=MUTED)
    body += panel(540, 80, 220, 280, "Ball and socket")
    body += C(650, 190, 28, BONE, BONE_D, 3)
    body += E(650, 240, 26, 18, "#f7efe2", BONE_D, 3)
    body += T(650, 310, "shoulder, hip", 14, fill=MUTED)
    return body


def lesson_muscle_types() -> str:
    body = T(400, 40, "Three kinds of muscle", 22, weight="bold")
    names = ["Skeletal", "Cardiac", "Smooth"]
    notes = ["you choose to move it", "heart, automatic", "organs, automatic"]
    for i, (n, note) in enumerate(zip(names, notes)):
        x = 40 + i * 250
        body += panel(x, 80, 230, 280, n)
        body += T(x + 115, 300, note, 14, fill=MUTED)
        body += P(f"M{x+40} 180 Q{x+115} 140 {x+190} 180", "none", MUSCLE, 16)
    body += T(155, 230, "stripes", 13, fill=MUTED)
    body += T(405, 230, "branches", 13, fill=MUTED)
    body += T(655, 230, "smooth sheets", 13, fill=MUTED)
    return body


def lesson_pairs() -> str:
    body = T(400, 40, "Muscles pull in pairs", 22, weight="bold")
    body += R(370, 90, 28, 240, BONE, BONE_D, 10, 3)
    body += P("M250 140 Q330 180 378 150", MUSCLE, MUSCLE_D, 3)
    body += P("M430 200 Q500 240 398 250", "#e07a6a", MUSCLE_D, 3)
    body += T(230, 130, "One shortens", 16, anchor="start")
    body += T(520, 300, "The other lengthens", 16)
    body += arrow(300, 200, 300, 250, MUSCLE)
    body += T(400, 360, "Muscles pull. They never push.", 18, weight="bold")
    return body


def lesson_heart() -> str:
    body = T(400, 36, "A drop of blood through the heart", 22, weight="bold")
    body += g_wrap(g_heart(), 180, 210, 1.3)
    steps = ["Body to right side", "Right side to lungs", "Lungs to left side", "Left side to body"]
    for i, s in enumerate(steps):
        body += R(430, 80 + i * 60, 320, 46, CARD)
        body += T(590, 110 + i * 60, f"{i + 1}. {s}", 16)
    return body


def g_wrap(glyph: str, x, y, scale) -> str:
    return f"<g transform='translate({x} {y}) scale({scale}) translate(-100 -100)'>{glyph}</g>"


def lesson_vessels() -> str:
    body = T(400, 40, "Three kinds of blood vessels", 22, weight="bold")
    labels = [("Artery", "away from the heart", ARTERY), ("Capillary", "exchange happens here", "#c47a7a"), ("Vein", "back to the heart", VEIN)]
    for i, (name, note, col) in enumerate(labels):
        x = 50 + i * 250
        body += panel(x, 80, 220, 260, name)
        body += f"<line x1='{x+40}' y1='180' x2='{x+180}' y2='180' stroke='{col}' stroke-width='{16 if i != 1 else 4}' stroke-linecap='round'/>"
        body += T(x + 110, 250, note, 14, fill=MUTED)
    return body


def lesson_air() -> str:
    body = T(400, 40, "Path of a breath", 22, weight="bold")
    stops = ["Nose or mouth", "Windpipe", "Bronchi", "Lungs", "Air sacs"]
    for i, s in enumerate(stops):
        x = 40 + i * 150
        body += C(x + 50, 180, 36, LUNG, LUNG_D, 3)
        body += T(x + 50, 186, str(i + 1), 18, weight="bold")
        body += T(x + 50, 260, s, 14)
        if i < 4:
            body += arrow(x + 92, 180, x + 112, 180)
    return body


def lesson_exchange() -> str:
    body = T(400, 40, "Gas exchange in an air sac", 22, weight="bold")
    body += C(250, 190, 80, "#fde8ec", LUNG_D, 3)
    body += T(250, 186, "air sac", 16)
    body += f"<path d='M360 120 Q470 190 360 270' fill='none' stroke='{ARTERY}' stroke-width='16'/>"
    body += arrow(430, 150, 330, 170, ARTERY)
    body += T(560, 150, "Oxygen in", 16, anchor="start", fill=ARTERY)
    body += T(560, 250, "Carbon dioxide out", 16, anchor="start", fill=VEIN)
    return body


def lesson_sandwich() -> str:
    body = T(400, 40, "Journey of a sandwich", 22, weight="bold")
    stops = [("Mouth", "chew + saliva"), ("Esophagus", "muscle waves"), ("Stomach", "acid + churning")]
    for i, (n, note) in enumerate(stops):
        x = 60 + i * 250
        body += panel(x, 90, 210, 220, n)
        body += T(x + 105, 250, note, 15, fill=MUTED)
        if i < 2:
            body += arrow(x + 214, 200, x + 246, 200)
    return body


def lesson_absorb() -> str:
    body = T(400, 40, "Helpers and the small intestine", 22, weight="bold")
    body += g_wrap(g_liver(), 150, 180, 0.9)
    body += g_wrap(g_small_intestine(), 430, 200, 0.8)
    body += T(150, 320, "Liver and gallbladder", 15)
    body += T(500, 320, "Small intestine absorbs", 15)
    body += arrow(250, 180, 330, 180)
    return body


def lesson_filter() -> str:
    body = T(400, 40, "Kidneys keep the useful parts", 22, weight="bold")
    body += g_wrap(g_kidneys(), 200, 190, 1.0)
    body += R(430, 110, 280, 70, "#e7f6ea")
    body += T(570, 152, "Keep: water, salts, sugar", 16)
    body += R(430, 210, 280, 70, "#fde8e8")
    body += T(570, 252, "Release: wastes, extra water", 16)
    return body


def lesson_nerve() -> str:
    body = T(400, 40, "A fast nerve signal", 22, weight="bold")
    body += P("M80 180 Q200 120 320 180", "none", "#e2b84a", 8)
    body += C(330, 180, 16, "#e2b84a", "#b89030", 3)
    body += P("M360 180 Q480 120 620 180", "none", "#e2b84a", 8)
    body += T(345, 240, "gap", 14, fill=MUTED)
    body += arrow(80, 120, 620, 120, ACCENT)
    body += T(400, 100, "electrical impulse, then a chemical hop", 16)
    return body


def lesson_hormone() -> str:
    body = T(400, 40, "A slower hormone message", 22, weight="bold")
    body += C(140, 180, 40, "#e6c15c", "#b89030", 3)
    body += T(140, 186, "gland", 14)
    body += P("M190 180 H620", "none", ARTERY, 8)
    for x in (280, 400, 540):
        body += C(x, 180, 10, "#fff3c4", "#b89030", 2)
    body += T(400, 260, "The message rides in the blood to many cells", 16)
    return body


def lesson_feedback() -> str:
    body = T(400, 40, "Negative feedback", 22, weight="bold")
    steps = ["Sensor notices", "Control center decides", "Effector acts", "Change reverses"]
    for i, s in enumerate(steps):
        x = 40 + (i % 4) * 190
        body += R(x, 140, 170, 80, CARD)
        body += T(x + 85, 186, s, 14)
        if i < 3:
            body += arrow(x + 172, 180, x + 188, 180)
    body += T(400, 300, "The response brings the body back toward its usual range", 16, fill=MUTED)
    return body


def lesson_skin_jobs() -> str:
    body = T(400, 40, "Jobs of the skin", 22, weight="bold")
    jobs = ["Blocks germs", "Holds water in", "Senses touch", "Cools by sweating", "Makes vitamin D"]
    for i, job in enumerate(jobs):
        x = 40 + (i % 5) * 150
        body += R(x, 140, 136, 120, SKIN, SKIN_D, 16, 2)
        body += T(x + 68, 206, job, 14)
    return body


def lesson_immune() -> str:
    body = T(400, 40, "Immune team", 22, weight="bold")
    names = ["White blood cells", "Antibodies", "Lymph nodes", "Spleen"]
    cols = ["#f7e7ea", "#fff3c4", LYMPH, SPLEEN]
    for i, (n, c) in enumerate(zip(names, cols)):
        x = 40 + i * 190
        body += C(x + 70, 160, 46, c, INK, 2)
        body += T(x + 70, 270, n, 15)
    return body


def lesson_defenses() -> str:
    body = T(400, 40, "Two lines of defense", 22, weight="bold")
    body += panel(40, 80, 340, 260, "First: barriers")
    body += T(210, 180, "skin, mucus, acid", 18)
    body += panel(420, 80, 340, 260, "Second: immune cells")
    body += T(590, 180, "find and attack", 18)
    body += arrow(384, 210, 416, 210)
    return body


def lesson_exercise() -> str:
    body = T(400, 36, "Systems during exercise", 22, weight="bold")
    names = ["Muscles", "Lungs", "Heart", "Nerves", "Skin"]
    for i, n in enumerate(names):
        body += R(40, 80 + i * 52, 720, 44, CARD)
        body += T(80, 108 + i * 52, n, 16, anchor="start", weight="bold", fill=ACCENT)
        notes = [
            "demand more oxygen and fuel",
            "breathe faster",
            "beat faster and send more blood",
            "coordinate the changes",
            "sweat to cool the body",
        ]
        body += T(240, 108 + i * 52, notes[i], 16, anchor="start")
    return body


def lesson_meal() -> str:
    body = T(400, 40, "Systems after a meal", 22, weight="bold")
    chain = ["Digest", "Absorb", "Blood carries", "Insulin helps", "Kidneys clean"]
    for i, s in enumerate(chain):
        x = 30 + i * 154
        body += R(x, 150, 140, 80, CARD)
        body += T(x + 70, 196, s, 14)
        if i < 4:
            body += arrow(x + 142, 190, x + 152, 190)
    return body


def lesson_close() -> str:
    body = T(400, 40, "One body, many connections", 22, weight="bold")
    body += C(400, 200, 70, "#f7e1c8", ACCENT, 3)
    body += T(400, 196, "stable", 18, weight="bold")
    body += T(400, 218, "range", 16)
    labels = [("temperature", 180, 80), ("oxygen", 620, 80), ("sugar", 180, 320), ("water", 620, 320)]
    for lab, x, y in labels:
        body += T(x, y, lab, 16)
        body += arrow(x, y + (12 if y < 200 else -16), 400, 200 if y > 200 else 160)
    return body


LESSONS_SPEC = [
    ("organization-01-levels.svg", "Levels of organization", "Cell, tissue, organ, system, and whole body.", lesson_levels),
    ("organization-01-tissues.svg", "Four tissue types", "Epithelial, connective, muscle, and nervous tissue.", lesson_tissues),
    ("organization-02-organ-from-tissues.svg", "Tissues inside an organ", "A stomach uses lining, muscle, nerve, and blood.", lesson_organ),
    ("organization-03-systems-link.svg", "Systems linked together", "Muscles depend on blood, lungs, and food.", lesson_link),
    ("support-01-skeleton-jobs.svg", "Jobs of the skeleton", "Support, protection, anchors, minerals, and blood cells.", lesson_jobs),
    ("support-01-joint-types.svg", "Joint types", "Fixed, hinge, and ball-and-socket joints.", lesson_joints),
    ("support-02-muscle-types.svg", "Three muscle types", "Skeletal, cardiac, and smooth muscle.", lesson_muscle_types),
    ("support-03-muscle-pairs.svg", "Muscle pairs", "One muscle shortens while its partner lengthens.", lesson_pairs),
    ("circulation-01-heart-path.svg", "Path through the heart", "Blood visits the lungs and then the body.", lesson_heart),
    ("circulation-02-three-vessels.svg", "Three vessel types", "Arteries, capillaries, and veins.", lesson_vessels),
    ("circulation-03-air-path.svg", "Path of inhaled air", "From nose or mouth to the air sacs.", lesson_air),
    ("circulation-03-gas-exchange.svg", "Gas exchange", "Oxygen enters blood and carbon dioxide leaves.", lesson_exchange),
    ("fuel-01-sandwich-path.svg", "Start of digestion", "Mouth, esophagus, and stomach.", lesson_sandwich),
    ("fuel-02-absorption.svg", "Absorption", "Liver helpers and the coiled small intestine.", lesson_absorb),
    ("fuel-03-kidney-filter.svg", "Kidney filter", "Keep useful substances and release wastes.", lesson_filter),
    ("control-01-nerve-signal.svg", "Nerve signal", "A fast impulse and a chemical gap.", lesson_nerve),
    ("control-02-hormone-message.svg", "Hormone message", "A gland releases a message into the blood.", lesson_hormone),
    ("control-03-feedback-loop.svg", "Feedback loop", "Sensor, control center, effector, and reversal.", lesson_feedback),
    ("protection-01-skin-jobs.svg", "Jobs of skin", "Barrier, water, touch, cooling, and vitamin D.", lesson_skin_jobs),
    ("protection-02-immune-team.svg", "Immune team", "White cells, antibodies, nodes, and spleen.", lesson_immune),
    ("protection-03-two-defenses.svg", "Two defenses", "Barriers first, then immune cells.", lesson_defenses),
    ("together-01-exercise-chain.svg", "Exercise chain", "How several systems respond to exercise.", lesson_exercise),
    ("together-02-meal-chain.svg", "Meal chain", "How several systems handle a meal.", lesson_meal),
    ("together-03-connections.svg", "Stable internal conditions", "Temperature, oxygen, sugar, and water.", lesson_close),
]


def main() -> None:
    os.makedirs(ORGANS, exist_ok=True)
    os.makedirs(LESSONS, exist_ok=True)
    for slug, title, desc, glyph_fn, context_tf in ORGANS_SPEC:
        glyph = glyph_fn()
        card(glyph, f"<g transform='{context_tf}'>{glyph}</g>", slug, title, desc)
        print(f"organ {slug}")
    for name, title, desc, fn in LESSONS_SPEC:
        write(LESSONS, name, 800, 380, title, desc, fn())
        print(f"lesson {name}")
    print(f"{len(ORGANS_SPEC) * 2} organ images, {len(LESSONS_SPEC)} lesson diagrams")


if __name__ == "__main__":
    main()
