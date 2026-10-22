// Контент хранится в src/content/<раздел>/<id>.json — по одному файлу на статью.
// Эти файлы редактируются через админ-панель (/admin) или вручную.
const load = (modules) =>
  Object.values(modules)
    .map((m) => m.default)
    .sort((x, y) => x.title.localeCompare(y.title, 'ru'))

const operations = load(import.meta.glob('../content/operations/*.json', { eager: true }))
const instruments = load(import.meta.glob('../content/instruments/*.json', { eager: true }))
const diseases = load(import.meta.glob('../content/diseases/*.json', { eager: true }))
const anatomy = load(import.meta.glob('../content/anatomy/*.json', { eager: true }))
const drugs = load(import.meta.glob('../content/drugs/*.json', { eager: true }))

// Описание разделов. Ключ используется в адресах: #/operations/appendectomy-open
export const TYPES = {
  operations: { label: 'Операции', one: 'Операция', icon: '🩺', items: operations },
  instruments: { label: 'Инструменты', one: 'Инструмент', icon: '✂️', items: instruments },
  diseases: { label: 'Болезни', one: 'Болезнь', icon: '🦠', items: diseases },
  anatomy: { label: 'Анатомия', one: 'Анатомия', icon: '🫀', items: anatomy },
  drugs: { label: 'Препараты', one: 'Препарат', icon: '💊', items: drugs },
}

export const TYPE_KEYS = Object.keys(TYPES)

// Все записи с полем type
export const ALL = TYPE_KEYS.flatMap((type) => TYPES[type].items.map((item) => ({ ...item, type })))

const byKey = new Map(ALL.map((item) => [`${item.type}/${item.id}`, item]))

export function getItem(type, id) {
  return byKey.get(`${type}/${id}`)
}

export function getItems(type, ids = []) {
  return ids.map((id) => getItem(type, id)).filter(Boolean)
}

// Обратные ссылки: какие записи типа fromType ссылаются на данную запись
export function backlinks(item, fromType) {
  return TYPES[fromType].items
    .filter((other) => Array.isArray(other[item.type]) && other[item.type].includes(item.id))
    .map((other) => ({ ...other, type: fromType }))
}

// Все записи, связанные с данной (прямые + обратные), сгруппированные по типу
export function related(item) {
  const result = {}
  for (const type of TYPE_KEYS) {
    if (type === item.type) continue
    const direct = getItems(type, item[type])
    const back = backlinks(item, type)
    const merged = [...direct, ...back.filter((b) => !direct.some((d) => d.id === b.id))]
    if (merged.length) result[type] = merged
  }
  return result
}

export const ALL_TAGS = [...new Set(ALL.flatMap((i) => i.tags || []))].sort((a, b) => a.localeCompare(b, 'ru'))

// Проверка целостности ссылок в режиме разработки
if (import.meta.env.DEV) {
  for (const item of ALL) {
    for (const type of TYPE_KEYS) {
      for (const id of item[type] || []) {
        if (!getItem(type, id)) console.warn(`[WebMed] ${item.type}/${item.id}: нет записи ${type}/${id}`)
      }
    }
    for (const step of item.steps || []) {
      for (const id of step.instruments || []) {
        if (!getItem('instruments', id)) console.warn(`[WebMed] ${item.id}: в шаге нет инструмента ${id}`)
      }
    }
  }
}
