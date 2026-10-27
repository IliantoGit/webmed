"""Общие «декорации» для схем: торс спереди, послойный разрез стенки, рана сверху, кишка и т.п."""
from svglib import C, path, rect, circle, label, text, cutline

# ——— Торс спереди (живот). Правая сторона пациента — слева на рисунке. ———
def torso(navel=(320, 200), show_ribs=True, show_inguinal=True, midline=True):
    nx, ny = navel
    s = path('M170 40 Q160 160 175 260 Q185 330 230 372 L410 372 Q455 330 465 260 Q480 160 470 40 Z',
             fill=C['skin'], stroke=C['skin_line'], sw=2)
    if show_ribs:
        s += path('M178 120 Q250 175 320 112 Q390 175 462 120', stroke=C['skin_line'], sw=2, extra='stroke-dasharray="5 5"')
        s += text(206, 104, 'рёберная дуга', sm=True, color=C['muted'])
    if midline:
        s += path('M320 70 L320 365', stroke=C['skin_line'], sw=1.2, extra='stroke-dasharray="3 6"')
    if show_inguinal:
        s += path('M215 300 Q250 335 300 365', stroke=C['skin_line'], sw=2)
        s += path('M425 300 Q390 335 340 365', stroke=C['skin_line'], sw=2)
        s += circle(215, 300, 4, C['skin_line']) + circle(425, 300, 4, C['skin_line'])
    s += f'<ellipse cx="{nx}" cy="{ny}" rx="6" ry="8" fill="{C["skin_line"]}"/>'
    s += text(150, 392, '← правая сторона пациента', sm=True, color=C['muted'])
    return s


# ——— Послойный разрез стенки (вид сбоку). layers: [(название, толщина, заливка)] ———
def wall(x0, y0, w, layers, labels=True, label_x=None, gap=None):
    """gap=(cx, n, top_w, bot_w): клиновидная рана шириной top_w..bot_w через первые n слоёв."""
    s, y, ys = '', y0, []
    for name, h, fill in layers:
        s += rect(x0, y, w, h, fill, stroke='#ffffff', sw=0.6)
        ys.append((name, y, y + h))
        y += h
    if gap:
        cx, n, tw, bw = gap
        yb = ys[n - 1][2]
        s += path(f'M{cx - tw / 2} {y0} L{cx - bw / 2} {yb} L{cx + bw / 2} {yb} L{cx + tw / 2} {y0} Z',
                  fill=C['panel'], stroke=C['cut'], sw=1.6)
    if labels:
        lx = label_x or (x0 + w + 14)
        prev = -99
        for name, a, b in ys:
            if name:
                ty = max((a + b) / 2, prev + 15)  # тонкие слои — подписи раздвигаем
                prev = ty
                s += label(x0 + w - 6, (a + b) / 2, name, lx, ty, anchor='start', sm=True)
    return s, ys


LAYERS_RIF = [  # правая подвздошная область (доступ Волковича–Дьяконова)
    ('кожа', 16, C['skin']),
    ('подкожная клетчатка', 34, 'url(#fatp)'),
    ('апоневроз наружной косой мышцы', 9, 'url(#apo)'),
    ('внутренняя косая мышца', 24, 'url(#fib2)'),
    ('поперечная мышца', 20, 'url(#fibh)'),
    ('поперечная фасция', 5, C['fascia']),
    ('брюшина', 5, C['peritoneum']),
]


# ——— Операционная рана сверху: края кожи + клетчатка + «дно» ———
def wound_top(cx, cy, rx, ry, floor='url(#apo)', angle=0):
    t = f' transform="rotate({angle} {cx} {cy})"' if angle else ''
    return (f'<g{t}>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx + 26}" ry="{ry + 22}" fill="{C["skin"]}" stroke="{C["skin_line"]}" stroke-width="2"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx + 10}" ry="{ry + 8}" fill="url(#fatp)"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{floor}" stroke="{C["fat_line"]}" stroke-width="1.5"/>'
            '</g>')


# ——— Слепая кишка с отростком (вид спереди) ———
def cecum(x=250, y=150, appendix=True, app_path=None, mesentery=True, artery=True):
    s = path(f'M{x - 20} {y - 110} Q{x - 70} {y - 100} {x - 75} {y - 30} Q{x - 85} {y + 70} {x - 10} {y + 90} '
             f'Q{x + 70} {y + 100} {x + 80} {y + 20} Q{x + 85} {y - 60} {x + 45} {y - 110} Z',
             fill=C['colon'], stroke=C['colon_line'], sw=2)
    # ленты (taeniae) — сходятся к основанию отростка
    s += path(f'M{x + 8} {y - 108} Q{x + 10} {y} {x + 20} {y + 88}', stroke=C['colon_line'], sw=5, extra='stroke-opacity="0.45"')
    s += path(f'M{x - 55} {y - 80} Q{x - 40} {y + 20} {x + 18} {y + 90}', stroke=C['colon_line'], sw=1, extra='stroke-dasharray="4 4"')
    # подвздошная кишка
    s += path(f'M{x + 230} {y - 40} Q{x + 150} {y - 30} {x + 80} {y - 10}', stroke=C['bowel_line'], sw=34, extra='stroke-linecap="round"')
    s += path(f'M{x + 230} {y - 40} Q{x + 150} {y - 30} {x + 80} {y - 10}', stroke=C['bowel'], sw=30, extra='stroke-linecap="round"')
    if appendix:
        ap = app_path or f'M{x + 22} {y + 88} Q{x + 40} {y + 150} {x + 110} {y + 170} Q{x + 160} {y + 180} {x + 190} {y + 160}'
        if mesentery:
            s += path(f'{ap} L{x + 120} {y + 20} Z', fill='#f7e3a8', stroke='#d8b964', sw=1.2)
        if artery:
            s += path(f'M{x + 120} {y + 22} Q{x + 120} {y + 110} {x + 175} {y + 158}', stroke=C['artery'], sw=2.5)
            s += path(f'M{x + 121} {y + 70} Q{x + 100} {y + 120} {x + 80} {y + 150}', stroke=C['artery'], sw=1.8)
        s += path(ap, stroke=C['bowel_line'], sw=20, extra='stroke-linecap="round"')
        s += path(ap, stroke='#f0a69b', sw=16, extra='stroke-linecap="round"')
    return s


def gauze(x, y, w, h, angle=0):
    return (f'<g transform="rotate({angle} {x + w / 2} {y + h / 2})">'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>'
            f'<path d="M{x} {y + h / 3} H{x + w} M{x} {y + 2 * h / 3} H{x + w} M{x + w / 3} {y} V{y + h} M{x + 2 * w / 3} {y} V{y + h}" '
            f'stroke="#e2e8f0" stroke-width="1"/></g>')
