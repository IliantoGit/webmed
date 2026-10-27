"""Собирает схемы этапов операций и подробные шаги.

Запуск:  python tools/build_ops.py [id операции ...]
Для каждой операции модуль tools/ops/<id>.py задаёт:
  META  — поля статьи, которые нужно обновить (показания, осложнения и т.п.);
  STEPS — список шагов: dict(title, text, tip?, instruments, draw, caption),
          где draw() возвращает SVG-схему шага.
Скрипт пишет public/images/operations/<id>/NN.svg и обновляет src/content/operations/<id>.json.
"""
import importlib, json, os, sys
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'ops'))

ALL = ['appendectomy-open', 'hernia-inguinal', 'cholecystectomy', 'gastrostomy-witzel', 'gastric-resection',
       'splenectomy', 'tracheostomy', 'pleural-puncture', 'venesection', 'amputation-thigh']


def build(op_id):
    mod = importlib.import_module(op_id.replace('-', '_'))
    out_dir = os.path.join(ROOT, 'public', 'images', 'operations', op_id)
    os.makedirs(out_dir, exist_ok=True)
    for f in os.listdir(out_dir):  # удаляем старые схемы этой операции
        if f.endswith('.svg'):
            os.remove(os.path.join(out_dir, f))

    steps = []
    for i, st in enumerate(mod.STEPS, 1):
        step = {'title': st['title'], 'text': st['text']}
        if st.get('tip'):
            step['tip'] = st['tip']
        step['instruments'] = st.get('instruments', [])
        if st.get('draw'):
            name = f'{i:02d}.svg'
            svg_text = st['draw']()
            ET.fromstring(svg_text)  # проверка: SVG должен быть корректным XML (иначе браузер его не покажет)
            with open(os.path.join(out_dir, name), 'w', encoding='utf-8') as f:
                f.write(svg_text)
            step['image'] = f'images/operations/{op_id}/{name}'
            step['caption'] = st.get('caption', '')
            step['imageCredit'] = {'kind': 'scheme', 'author': 'WebMed'}
        elif st.get('image'):  # внешняя картинка (например, с Wikimedia Commons)
            step['image'] = st['image']
            step['caption'] = st.get('caption', '')
            step['imageCredit'] = st['imageCredit']
        steps.append(step)

    jp = os.path.join(ROOT, 'src', 'content', 'operations', op_id + '.json')
    data = json.load(open(jp, encoding='utf-8'))
    data.update(getattr(mod, 'META', {}))
    data['steps'] = steps
    with open(jp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f'{op_id}: {len(steps)} шагов')


if __name__ == '__main__':
    for op in sys.argv[1:] or ALL:
        build(op)
