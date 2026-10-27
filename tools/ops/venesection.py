"""Венесекция: Кованов (с. 241), Николаев (с. 163)."""
from svglib import *
from scenes import *

META = {
    'summary': 'Обнажение и вскрытие поверхностной вены для введения иглы или катетера, когда пункция невозможна (спавшиеся вены, шок). Классическое место — большая подкожная вена впереди медиальной лодыжки.',
    'anesthesia': 'Местная инфильтрационная (0,25–0,5% прокаин)',
    'position': 'На спине; конечность отведена и уложена на приставной столик',
    'duration': '10–20 мин',
    'indications': [
        'Необходимость длительных инфузий и переливания крови при невозможности пункции вен',
        'Спавшиеся вены при шоке, массивной кровопотере',
    ],
    'contraindications': [
        'Воспаление кожи, флебит или тромбоз вены в месте вмешательства',
        'Повреждение конечности выше места венесекции',
    ],
    'complications': [
        'Флебит и тромбоз вены',
        'Нагноение раны',
        'Повреждение подкожного нерва (n. saphenus) — онемение по медиальному краю стопы',
        'Выпадение иглы или катетера, кровотечение',
    ],
    'postop': [
        'Наблюдение за местом введения: отёк, гиперемия',
        'После окончания инфузий — завязать центральную лигатуру, снять швы на 7–8 сутки',
    ],
    'sources': [
        {'book': 'kovanov', 'pages': '241'},
        {'book': 'nikolaev', 'pages': '163'},
        {'book': 'turgunov', 'pages': '13'},
    ],
}

PER = '← периферия'
CEN = 'к сердцу →'


def field(cut=True, vein_y=210, nerve=True, isolated=False, opened=False):
    s = rect(30, 60, 580, 320, C['skin'], stroke=C['skin_line'], sw=2, rx=20)
    if cut:
        s += f'<ellipse cx="320" cy="{vein_y}" rx="190" ry="85" fill="url(#fatp)" stroke="{C["skin_line"]}" stroke-width="3"/>'
    vy = vein_y
    if isolated:
        s += path(f'M60 {vy + 10} Q200 {vy} 320 {vy - 25} Q440 {vy} 580 {vy + 10}', stroke=C['vein'], sw=22, extra='stroke-linecap="round"')
    else:
        s += path(f'M60 {vy} L580 {vy}', stroke=C['vein'], sw=22, extra='stroke-linecap="round"')
    if nerve:
        s += path(f'M60 {vy + 36} Q320 {vy + 44} 580 {vy + 36}', stroke=C['nerve'], sw=4)
    s += text(40, 395, PER, sm=True, color=C['muted']) + text(600, 395, CEN, anchor='end', sm=True, color=C['muted'])
    return s


def s_ankle():
    s = path('M80 60 L200 60 Q210 230 230 280 Q260 330 400 330 L580 330 Q600 360 580 385 L200 385 Q120 380 100 300 Q80 200 80 60 Z',
             fill=C['skin'], stroke=C['skin_line'], sw=2)
    s += f'<ellipse cx="180" cy="290" rx="34" ry="26" fill="{C["bone"]}" stroke="{C["bone_line"]}" stroke-width="2"/>'
    s += path('M150 60 Q165 200 230 270 Q300 320 520 340', stroke=C['vein'], sw=8)
    s += path('M142 60 Q155 200 222 278 Q290 330 500 352', stroke=C['nerve'], sw=3)
    s += cutline('M215 250 L265 225', 4)
    s += label(180, 290, 'медиальная лодыжка', 30, 370, anchor='start', sm=True)
    s += label(160, 150, 'v. saphena magna — впереди\nмедиальной лодыжки,\nположение постоянно', 300, 90, anchor='start')
    s += label(150, 190, 'n. saphenus рядом', 300, 190, anchor='start', sm=True)
    s += label(240, 238, 'разрез 3–4 см над\nпроекцией вены', 330, 250, anchor='start', sm=True)
    s += text(420, 375, 'также: вены локтевой ямки, предплечья', sm=True, color=C['accent'])
    return svg(s, 'Выбор вены (медиальная поверхность голеностопа)')


def s_tourniquet():
    s = path('M40 160 L600 160 L600 260 L40 260 Z', fill=C['skin'], stroke=C['skin_line'], sw=2)
    s += rect(430, 150, 34, 120, C['accent'], rx=6)
    s += path('M60 210 L600 210', stroke=C['vein'], sw=10)
    s += cutline('M200 190 L260 230', 4)
    s += place(t_syringe_needle(90), 230, 210, 220, 0.8)
    s += label(447, 160, 'жгут выше места\nвенесекции — вена\nнаполняется', 470, 70, anchor='start')
    s += label(230, 210, 'инфильтрация прокаином\nпо линии разреза', 40, 330, anchor='start', sm=True)
    return svg(s, 'Жгут и местная анестезия')


def s_incision():
    s = field(cut=True)
    s += place(t_scalpel(), 400, 180, 160, 0.9)
    s += label(320, 160, 'разрез кожи и подкожной\nклетчатки 3–4 см', 420, 80, anchor='start')
    return svg(s, 'Разрез над веной')


def s_isolate():
    s = field(isolated=True)
    s += place(t_clamp(curved=True), 320, 200, -100, 0.6)
    s += label(320, 185, 'вену выделяют из клетчатки\nсомкнутыми браншами москита', 380, 90, anchor='start')
    s += label(320, 252, 'нерв отделить —\nне захватывать', 400, 330, anchor='start', sm=True)
    return svg(s, 'Выделение вены')


def s_ligatures():
    s = field(isolated=True)
    s += place(t_deschamps(), 300, 205, -80, 0.9)
    s += path('M230 170 Q232 200 230 230', stroke=C['suture'], sw=3) + path('M410 170 Q408 200 410 230', stroke=C['suture'], sw=3)
    s += label(230, 178, 'периферическая\nлигатура', 60, 100, anchor='start', sm=True)
    s += label(410, 178, 'центральная\nлигатура', 460, 100, anchor='start', sm=True)
    s += label(300, 205, 'игла Дешана с двойной\nлигатурой под веной', 330, 340, anchor='start')
    return svg(s, 'Подведение двойной лигатуры')


def s_lift():
    s = field(isolated=True)
    s += ligature(220, 178, 236, 232)
    s += path('M228 178 L200 110', stroke=C['suture'], sw=2) + place(t_clamp(), 200, 110, -110, 0.45)
    s += path('M410 170 Q408 200 410 230', stroke=C['suture'], sw=3)
    s += arrow(228, 160, 228, 120)
    s += label(228, 205, 'периферическая лигатура\nзавязана — за неё\nвену приподнимают', 40, 330, anchor='start')
    s += label(410, 200, 'центральная — пока\nне завязана', 460, 300, anchor='start', sm=True)
    return svg(s, 'Перевязка периферической лигатуры')


def s_open():
    s = field(isolated=True)
    s += ligature(220, 178, 236, 232) + path('M410 170 Q408 200 410 230', stroke=C['suture'], sw=3)
    s += path('M300 182 L312 196 L324 182', stroke='#0b1f3a', sw=4)
    s += place(t_scissors(), 312, 190, 160, 0.6)
    s += label(312, 192, 'V-образный надрез\nпередней стенки вены\nножницами', 360, 70, anchor='start')
    return svg(s, 'Вскрытие вены')


def s_insert():
    s = field(isolated=True)
    s += ligature(220, 178, 236, 232)
    s += path('M318 190 L470 196', stroke=C['steel_dark'], sw=6)
    s += rect(300, 176, 22, 30, C['steel'], stroke=C['steel_dark'], rx=3)
    s += path('M300 191 Q240 150 160 120', stroke='#c9a37a', sw=6)
    s += ligature(406, 172, 412, 220)
    s += label(420, 194, 'игла Дюфо (или катетер)\nв просвете вены к центру', 380, 330, anchor='start')
    s += label(409, 180, 'центральная лигатура —\nпровизорно, одним узлом\nна игле', 420, 80, anchor='start', sm=True)
    s += label(170, 125, 'к системе для переливания;\nжгут снять', 40, 90, anchor='start', sm=True)
    return svg(s, 'Введение иглы и подключение системы')


def s_fix():
    s = rect(30, 60, 580, 320, C['skin'], stroke=C['skin_line'], sw=2, rx=20)
    s += path('M150 210 L490 210', stroke=C['skin_line'], sw=3)
    for x in range(170, 480, 40):
        s += suture(f'M{x} 196 L{x} 224', 2.4) + knot(x, 196, 2.5)
    s += path('M330 210 Q240 160 120 130', stroke='#c9a37a', sw=6)
    s += rect(200, 138, 70, 26, '#fef3c7', stroke='#e5c07b')
    s += label(235, 151, 'пластырь фиксирует\nиглу и трубку к коже', 40, 330, anchor='start', sm=True)
    s += label(330, 210, 'швы на рану', 420, 300, anchor='start', sm=True)
    s += text(330, 90, 'после переливания: иглу извлечь,\nцентральную лигатуру завязать окончательно', sm=True, color=C['accent'])
    return svg(s, 'Фиксация и завершение')


STEPS = [
    dict(title='Выбор вены',
         text='Для венесекции используют поверхностные вены предплечья, локтевой ямки и начальный отдел большой подкожной вены ноги на передней поверхности медиальной лодыжки. '
              'В этом месте v. saphena magna лежит в подкожной клетчатке вместе с подкожным нервом (n. saphenus), окружённая поверхностной фасцией; её положение постоянно, поэтому здесь обычно и выполняют венесекцию.',
         instruments=[], draw=s_ankle, caption='Классическое место — впереди медиальной лодыжки'),
    dict(title='Жгут, обработка поля и анестезия',
         text='Выше места вмешательства накладывают жгут — вена наполняется и лучше определяется. Кожу обрабатывают антисептиком, поле отграничивают. '
              'По линии разреза выполняют местную инфильтрационную анестезию раствором прокаина.',
         instruments=['tourniquet', 'sponge-forceps'], draw=s_tourniquet, caption='Подготовка к разрезу'),
    dict(title='Разрез кожи',
         text='Над проекцией вены делают разрез кожи и подкожной клетчатки длиной 3–4 см.',
         instruments=['scalpel', 'hook-sharp'], draw=s_incision, caption='Вена видна в клетчатке'),
    dict(title='Выделение вены',
         text='Вену выделяют из окружающей клетчатки тупым путём — сомкнутыми браншами зажима «москит» — и приподнимают в рану на протяжении 1,5–2 см.',
         tip='У медиальной лодыжки вплотную к вене идёт подкожный нерв: отделите его, чтобы не захватить в лигатуру.',
         instruments=['clamp-mosquito', 'forceps-anatomical'], draw=s_isolate, caption='Вена выделена, нерв отведён'),
    dict(title='Подведение двойной лигатуры',
         text='Под выделенную вену иглой Дешана подводят двойную лигатуру и разрезают её, получая две нити: периферическую и центральную.',
         instruments=['deschamps-needle', 'suture-material'], draw=s_ligatures, caption='Две лигатуры под веной'),
    dict(title='Перевязка периферической лигатуры',
         text='Периферическую лигатуру завязывают. Её концы берут на зажим и за них приподнимают вену — она натягивается, кровь из периферии не поступает.',
         instruments=['clamp-mosquito', 'suture-material'], draw=s_lift, caption='Вена приподнята за периферическую лигатуру'),
    dict(title='Вскрытие вены',
         text='На передней стенке вены ножницами делают небольшой (V-образный) надрез — ближе к периферической лигатуре, примерно на треть окружности вены, не пересекая её полностью.',
         instruments=['scissors-metzenbaum', 'forceps-anatomical'], draw=s_open, caption='Надрез стенки вены'),
    dict(title='Введение иглы и подключение системы',
         text='Через надрез в просвет вены в центральном направлении вводят иглу Дюфо или полиэтиленовый катетер. На ней провизорно — одним узлом — завязывают центральную лигатуру. '
              'Жгут снимают. К игле (катетеру) присоединяют систему для переливания крови или кровезамещающих растворов и проверяют свободное поступление жидкости.',
         instruments=['dufaut-needle', 'suture-material', 'tourniquet'], draw=s_insert, caption='Игла фиксирована центральной лигатурой'),
    dict(title='Ушивание и фиксация; завершение инфузии',
         text='На рану накладывают швы; иглу и резиновую трубку фиксируют к коже полосками липкого пластыря. '
              'По окончании переливания иглу Дюфо извлекают из вены и центральную лигатуру завязывают окончательно.',
         instruments=['needle-holder-hegar', 'suture-material', 'forceps-surgical'], draw=s_fix, caption='Вид после окончания операции'),
]
