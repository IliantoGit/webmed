import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TYPES, TYPE_KEYS, ALL_TAGS } from '../data/index.js'
import { CardGrid } from '../components/Card.jsx'

export default function Home() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const featured = TYPES.operations.items.slice(0, 3).map((i) => ({ ...i, type: 'operations' }))

  return (
    <div className="home">
      <section className="hero">
        <h1>Справочник хирургии для студентов-медиков</h1>
        <p>Пошаговые описания операций, хирургические инструменты, болезни, анатомия и препараты — всё связано между собой.</p>
        <form
          className="hero-search"
          onSubmit={(e) => {
            e.preventDefault()
            navigate(`/search?q=${encodeURIComponent(q.trim())}`)
          }}
        >
          <input type="search" placeholder="Что ищем? Например: холецистэктомия" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="submit">Найти</button>
        </form>
        <div className="hero-tags">
          {ALL_TAGS.slice(0, 8).map((tag) => (
            <Link key={tag} to={`/search?tag=${encodeURIComponent(tag)}`} className="chip chip-tag">
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      <section className="sections">
        {TYPE_KEYS.map((type) => (
          <Link key={type} to={`/${type}`} className={`section-tile tile-${type}`}>
            <span className="tile-icon">{TYPES[type].icon}</span>
            <span className="tile-label">{TYPES[type].label}</span>
            <span className="tile-count">{TYPES[type].items.length} записей</span>
          </Link>
        ))}
      </section>

      <section>
        <h2>Операции</h2>
        <CardGrid items={featured} />
        <Link to="/operations" className="more-link">
          Все операции →
        </Link>
      </section>
    </div>
  )
}
