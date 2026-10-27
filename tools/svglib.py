"""Мини-библиотека для схем этапов операций (SVG, подписи на русском).

Все инструменты рисуются «кончиком» в точке (0, 0) и направлены вправо;
их ставят функцией place(tool, x, y, angle, scale).
"""
from html import escape

W, H = 640, 400

# Палитра (единая для всех схем)
C = dict(
    ink='#1f2d26', muted='#5b7266', bg='#ffffff', panel='#f2faf5',
    skin='#f6d5c3', skin_line='#d9a58c', fat='#fde9b0', fat_line='#e8c766',
    fascia='#eef2f7', apo='#e6ecf3', apo_line='#9fb0c3',
    muscle='#e7a59b', muscle_line='#c46f62', peritoneum='#bfe3cf',
    bowel='#f4bcb3', bowel_line='#c97d72', colon='#ecc9a8', colon_line='#b98a5c',
    liver='#b5543c', liver_line='#7d3221', gall='#8bbf6a', gall_line='#4f7f33',
    stomach='#f2aaa2', stomach_line='#b8655c', spleen='#8e3b4f', spleen_line='#5c2131',
    artery='#d62828', vein='#3a6ea5', nerve='#e9b824', duct='#5c9e3a',
    bone='#f5efe0', bone_line='#b9a77f', marrow='#e9c8a0', cart='#e6eef5', cart_line='#8aa0b6',
    steel='#9aa7b4', steel_dark='#5f6b78', steel_light='#e8edf2',
    cut='#d62828', suture='#2563eb', accent='#16a34a', tube='#f0b65a',
)

STYLE = f"""
<style>
  .lbl {{ font: 600 13px system-ui, 'Segoe UI', Arial, sans-serif; fill: {C['ink']};
          paint-order: stroke; stroke: #fff; stroke-width: 4px; stroke-linejoin: round; }}
  .sm  {{ font-size: 11.5px; font-weight: 500; }}
  .ttl {{ font: 700 15px system-ui, 'Segoe UI', Arial, sans-serif; fill: {C['accent']}; }}
  .lead {{ stroke: {C['ink']}; stroke-width: 1.2; fill: none; }}
</style>
<defs>
  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M0 0 L10 5 L0 10 z" fill="{C['accent']}"/>
  </marker>
  <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
    <circle cx="5" cy="5" r="4" fill="{C['ink']}"/>
  </marker>
  <pattern id="fib" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
    <rect width="8" height="8" fill="{C['muscle']}"/><line x1="0" y1="4" x2="8" y2="4" stroke="{C['muscle_line']}" stroke-width="1"/>
  </pattern>
  <pattern id="fib2" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
    <rect width="8" height="8" fill="{C['muscle']}"/><line x1="0" y1="4" x2="8" y2="4" stroke="{C['muscle_line']}" stroke-width="1"/>
  </pattern>
  <pattern id="fibh" width="8" height="8" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="{C['muscle']}"/><line x1="0" y1="4" x2="8" y2="4" stroke="{C['muscle_line']}" stroke-width="1"/>
  </pattern>
  <pattern id="apo" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
    <rect width="10" height="10" fill="{C['apo']}"/><line x1="0" y1="5" x2="10" y2="5" stroke="{C['apo_line']}" stroke-width="0.8"/>
  </pattern>
  <pattern id="fatp" width="14" height="14" patternUnits="userSpaceOnUse">
    <rect width="14" height="14" fill="{C['fat']}"/><circle cx="7" cy="7" r="5" fill="none" stroke="{C['fat_line']}" stroke-width="0.8"/>
  </pattern>
  <pattern id="mesh" width="8" height="8" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="#ffffff" fill-opacity="0.55"/><path d="M0 0 L8 8 M8 0 L0 8" stroke="#7aa6c9" stroke-width="0.7"/>
  </pattern>
  <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{C['steel_light']}"/><stop offset="1" stop-color="{C['steel']}"/>
  </linearGradient>
</defs>
"""


def svg(body, title=None, w=W, h=H):
    head = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img"'
    head += f' aria-label="{escape(title or "")}">' + STYLE
    bg = f'<rect width="{w}" height="{h}" rx="14" fill="{C["panel"]}"/>'
    t = f'<text class="ttl" x="18" y="28">{escape(title)}</text>' if title else ''
    return head + bg + body + t + '</svg>\n'


def label(x, y, text, tx, ty, anchor=None, sm=False):
    """Подпись с выноской: (x, y) — точка на объекте, (tx, ty) — где текст."""
    anchor = anchor or ('end' if tx < x else 'start')
    dx = -4 if anchor == 'end' else 4
    cls = 'lbl sm' if sm else 'lbl'
    lines = text.split('\n')
    width = max(len(l) for l in lines) * (6.4 if sm else 7.2)
    if anchor == 'end' and tx - width < 8:      # не выходить за левый край
        tx = width + 12
    if anchor == 'start' and tx + width > W - 8:  # и за правый
        tx = W - 12 - width
    t = ''.join(f'<tspan x="{tx + dx}" dy="{0 if i == 0 else 14}">{escape(s)}</tspan>' for i, s in enumerate(lines))
    return (f'<polyline class="lead" points="{x},{y} {tx},{ty}" marker-start="url(#dot)"/>'
            f'<text class="{cls}" x="{tx + dx}" y="{ty + 4}" text-anchor="{anchor}">{t}</text>')


def text(x, y, s, anchor='start', sm=False, color=None):
    cls = 'lbl sm' if sm else 'lbl'
    fill = f' style="fill:{color}"' if color else ''
    if color in ('#fff', '#ffffff'):  # светлый текст на тёмном органе — тёмная обводка
        fill = ' style="fill:#fff; stroke:#3a1a12; stroke-opacity:0.55"'
    lines = s.split('\n')
    t = ''.join(f'<tspan x="{x}" dy="{0 if i == 0 else 15}">{escape(l)}</tspan>' for i, l in enumerate(lines))
    return f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}"{fill}>{t}</text>'


def arrow(x1, y1, x2, y2, curve=0, color=None, width=2.5):
    col = color or C['accent']
    if curve:
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        nx, ny = -(y2 - y1), (x2 - x1)
        L = (nx * nx + ny * ny) ** 0.5 or 1
        cx, cy = mx + nx / L * curve, my + ny / L * curve
        d = f'M{x1} {y1} Q{cx:.1f} {cy:.1f} {x2} {y2}'
    else:
        d = f'M{x1} {y1} L{x2} {y2}'
    return f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{width}" marker-end="url(#arr)"/>'


def cutline(d, width=3):
    """Линия разреза (красный пунктир)."""
    return f'<path d="{d}" fill="none" stroke="{C["cut"]}" stroke-width="{width}" stroke-dasharray="9 6" stroke-linecap="round"/>'


def suture(d, width=2):
    return f'<path d="{d}" fill="none" stroke="{C["suture"]}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'


def knot(x, y, r=4):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{C["suture"]}"/>'


def ligature(x1, y1, x2, y2):
    """Лигатура поперёк сосуда/протока (синяя черта с узлом)."""
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{C["suture"]}" stroke-width="4" stroke-linecap="round"/>'
            + knot((x1 + x2) / 2, (y1 + y2) / 2, 4))


def place(tool, x, y, angle=0, scale=1.0):
    return f'<g transform="translate({x} {y}) rotate({angle}) scale({scale})">{tool}</g>'


def path(d, fill='none', stroke=None, sw=1.5, extra=''):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{s} {extra}/>'


def rect(x, y, w, h, fill, stroke=None, sw=1.2, rx=0):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{s}/>'


def circle(x, y, r, fill, stroke=None, sw=1.2):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"{s}/>'


# ——— Инструменты (кончик в 0,0, ручка уходит влево) ———
ST = f'stroke="{C["steel_dark"]}"'  # толщину линии задаём отдельно


def t_scalpel():
    return (f'<rect x="-150" y="-6" width="110" height="12" rx="4" fill="url(#steel)" {ST} stroke-width="1.3"/>'
            f'<path d="M-40 -6 L-8 -9 Q4 -6 0 2 L-40 6 Z" fill="#f8fafc" {ST} stroke-width="1.3"/>')


def t_forceps(open_=8):
    return (f'<path d="M-140 -4 L0 -1 M-140 4 L0 1" stroke="{C["steel"]}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M-140 -4 L-20 -{open_ / 2} L0 -1 M-140 4 L-20 {open_ / 2} L0 1" fill="none" {ST} stroke-width="1.3"/>')


def _rings(x=-150):
    return (f'<circle cx="{x}" cy="-14" r="10" fill="none" {ST} stroke-width="3"/>'
            f'<circle cx="{x}" cy="14" r="10" fill="none" {ST} stroke-width="3"/>')


def t_clamp(curved=False):
    tip = 'Q-10 -2 0 -10' if curved else 'L0 -1'
    tip2 = 'Q-10 2 0 -6' if curved else 'L0 1'
    return (_rings() + f'<path d="M-142 -10 L-60 2 L-25 -2 {tip}" fill="none" stroke="{C["steel_dark"]}" stroke-width="3.5"/>'
            f'<path d="M-142 10 L-60 -2 L-25 2 {tip2}" fill="none" stroke="{C["steel_dark"]}" stroke-width="3.5"/>'
            f'<circle cx="-60" cy="0" r="3" fill="{C["ink"]}"/>'
            f'<path d="M-135 -6 l8 6 l-8 6" stroke="{C["steel_dark"]}" fill="none" stroke-width="1.5"/>')


def t_scissors():
    return (_rings() + f'<path d="M-142 -10 L-55 2 L0 -4 M-142 10 L-55 -2 L0 4" fill="none" stroke="{C["steel_dark"]}" stroke-width="3.5"/>'
            f'<circle cx="-55" cy="0" r="3" fill="{C["ink"]}"/>')


def t_needle_holder(with_needle=True):
    n = ''
    if with_needle:
        n = f'<path d="M-4 0 A16 16 0 0 1 22 -18" fill="none" stroke="{C["ink"]}" stroke-width="2"/>'
        n += f'<path d="M-4 0 Q-20 20 -40 26" fill="none" stroke="{C["suture"]}" stroke-width="1.8"/>'
    return (_rings() + f'<path d="M-142 -10 L-40 1 L0 0 M-142 10 L-40 -1 L0 0" fill="none" stroke="{C["steel_dark"]}" stroke-width="4"/>'
            f'<circle cx="-40" cy="0" r="3" fill="{C["ink"]}"/>' + n)


def t_retractor(depth=40):
    return (f'<path d="M-160 0 L-10 0 Q0 0 0 10 L0 {depth}" fill="none" stroke="{C["steel"]}" stroke-width="9" stroke-linecap="round"/>'
            f'<path d="M-160 0 L-10 0 Q0 0 0 10 L0 {depth}" fill="none" stroke="{C["steel_dark"]}" stroke-width="1.2"/>')


def t_hook(sharp=True):
    end = 'L10 18 L4 10' if sharp else 'Q12 18 4 18'
    return (f'<rect x="-150" y="-6" width="80" height="12" rx="5" fill="url(#steel)" {ST} stroke-width="1.3"/>'
            f'<path d="M-70 0 L0 0 Q14 0 12 14 {end}" fill="none" stroke="{C["steel_dark"]}" stroke-width="3"/>')


def t_probe():
    return (f'<rect x="-150" y="-6" width="30" height="12" rx="3" fill="url(#steel)" {ST} stroke-width="1.3"/>'
            f'<path d="M-120 -4 L-4 -4 Q4 0 -4 4 L-120 4 Z" fill="url(#steel)" {ST} stroke-width="1.3"/>'
            f'<line x1="-115" y1="0" x2="-8" y2="0" stroke="{C["steel_dark"]}" stroke-width="1"/>')


def t_syringe_needle(length=90):
    return (f'<line x1="-{length}" y1="0" x2="0" y2="0" stroke="{C["steel_dark"]}" stroke-width="2.5"/>'
            f'<rect x="-{length + 16}" y="-5" width="16" height="10" fill="{C["steel"]}" {ST} stroke-width="1.3"/>'
            f'<path d="M-{length + 16} 0 C-{length + 60} 0 -{length + 50} 50 -{length + 110} 50" fill="none" stroke="#c9a37a" stroke-width="5"/>'
            f'<rect x="-{length + 40}" y="-14" width="10" height="28" rx="2" fill="{C["ink"]}"/>')


def t_saw():
    teeth = ''.join(f'l6 8 l6 -8 ' for _ in range(13))
    return (f'<rect x="-200" y="-20" width="40" height="40" rx="8" fill="#ece3d3" {ST} stroke-width="1.3"/>'
            f'<rect x="-160" y="-16" width="160" height="22" fill="url(#steel)" {ST} stroke-width="1.3"/>'
            f'<path d="M-160 6 {teeth}" fill="none" stroke="{C["steel_dark"]}" stroke-width="1.5"/>')


def t_knife():
    return (f'<rect x="-210" y="-8" width="70" height="16" rx="6" fill="#4b3b2f"/>'
            f'<path d="M-140 -6 L-10 -6 Q8 0 -10 8 L-140 8 Z" fill="url(#steel)" {ST} stroke-width="1.3"/>')


def t_raspatory():
    return (f'<rect x="-150" y="-7" width="100" height="14" rx="6" fill="url(#steel)" {ST} stroke-width="1.3"/>'
            f'<line x1="-50" y1="0" x2="-14" y2="0" stroke="{C["steel_dark"]}" stroke-width="4"/>'
            f'<path d="M-14 -10 L2 -7 L2 7 L-14 10 Z" fill="#f8fafc" {ST} stroke-width="1.3"/>')


def t_tube(length=160, color=None):
    col = color or C['tube']
    return f'<line x1="-{length}" y1="0" x2="0" y2="0" stroke="{col}" stroke-width="12" stroke-linecap="round"/>' \
           f'<line x1="-{length}" y1="0" x2="0" y2="0" stroke="#fff" stroke-opacity="0.45" stroke-width="3"/>'


def t_deschamps():
    return (f'<rect x="-160" y="-6" width="80" height="12" rx="5" fill="url(#steel)" {ST} stroke-width="1.3"/>'
            f'<path d="M-80 0 L-20 0 Q10 0 6 24 Q2 34 -8 30" fill="none" stroke="{C["steel_dark"]}" stroke-width="3"/>')
