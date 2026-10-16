import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import { ALL, ALL_TAGS, TYPES, TYPE_KEYS } from '../data/index.js'
import { CardGrid } from '../components/Card.jsx'

const fuse = new Fuse(ALL, {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'aliases', weight: 2 },
    { name: 'summary', weight: 1 },
    { name: 'tags', weight: 1 },
    { name: 'category', weight: 1 },
    { name: 'group', weight: 1 },
    { name: 'system', weight: 1 },
    { name: 'icd', weight: 1 },
    { name: 'description', weight: 0.5 },
    { name: 'symptoms', weight: 0.5 },
    { name: 'indications', weight: 0.5 },
    { name: 'steps.title', weight: 0.5 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
})

const splitParam = (v) => (v ? v.split(',').filter(Boolean) : [])

// Если передан fixedType — это страница каталога одного раздела
export default function Search({ fixedType }) {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const types = fixedType ? [fixedType] : splitParam(params.get('type'))
  const tags = splitParam(params.get('tag'))
  const sub = params.get('sub') || '' // категория инструмента / сложность операции и т.п.

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value && value.length) next.set(key, Array.isArray(value) ? value.join(',') : value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const toggleIn = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const base = useMemo(() => {
    if (!q.trim()) return [...ALL].sort((a, b) => a.title.localeCompare(b.title, 'ru'))
    return fuse.search(q.trim()).map((r) => r.item)
  }, [q])

  const subField = fixedType ? SUB_FIELDS[fixedType] : null
  const subOptions = subField ? [...new Set(TYPES[fixedType].items.map((i) => i[subField.key]).filter(Boolean))] : []

  const results = base.filter(
    (item) =>
      (!types.length || types.includes(item.type)) &&
      (!tags.length || tags.some((t) => item.tags?.includes(t))) &&
      (!sub || !subField || item[subField.key] === sub),
  )

  // Теги, которые есть хотя бы у одной записи выбранных разделов
  const visibleTags = ALL_TAGS.filter((tag) => ALL.some((i) => (!types.length || types.includes(i.type)) && i.tags?.includes(tag)))

  const counts = Object.fromEntries(TYPE_KEYS.map((t) => [t, base.filter((i) => i.type === t).length]))

  return (
    <div className="search-page">
      <h1>{fixedType ? `${TYPES[fixedType].icon} ${TYPES[fixedType].label}` : 'Поиск'}</h1>

      <input
        className="search-input"
        type="search"
        placeholder={fixedType ? `Искать в разделе «${TYPES[fixedType].label}»…` : 'Название, синоним, симптом…'}
        value={q}
        onChange={(e) => update('q', e.target.value)}
        autoFocus={!fixedType}
      />

      <div className="filters">
        {!fixedType && (
          <div className="filter-group">
            <span className="filter-label">Раздел:</span>
            {TYPE_KEYS.map((t) => (
              <button
                key={t}
                className={`chip ${types.includes(t) ? 'chip-on' : ''}`}
                onClick={() => update('type', toggleIn(types, t))}
              >
                {TYPES[t].icon} {TYPES[t].label} <span className="chip-count">{counts[t]}</span>
              </button>
            ))}
          </div>
        )}

        {subField && (
          <div className="filter-group">
            <span className="filter-label">{subField.label}:</span>
            {subOptions.map((opt) => (
              <button key={opt} className={`chip ${sub === opt ? 'chip-on' : ''}`} onClick={() => update('sub', sub === opt ? '' : opt)}>
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="filter-group">
          <span className="filter-label">Темы:</span>
          {visibleTags.map((tag) => (
            <button key={tag} className={`chip chip-tag ${tags.includes(tag) ? 'chip-on' : ''}`} onClick={() => update('tag', toggleIn(tags, tag))}>
              #{tag}
            </button>
          ))}
        </div>

        {(q || (!fixedType && types.length) || tags.length || sub) && (
          <button className="link-btn" onClick={() => setParams({}, { replace: true })}>
            Сбросить фильтры
          </button>
        )}
      </div>

      <p className="results-count">Найдено: {results.length}</p>
      {results.length ? <CardGrid items={results} /> : <p className="empty">Ничего не найдено. Попробуйте другой запрос или уберите фильтры.</p>}
    </div>
  )
}

const SUB_FIELDS = {
  operations: { key: 'difficulty', label: 'Сложность' },
  instruments: { key: 'category', label: 'Категория' },
  anatomy: { key: 'system', label: 'Система' },
  drugs: { key: 'group', label: 'Группа' },
}
