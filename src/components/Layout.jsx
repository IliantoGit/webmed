import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { TYPES, TYPE_KEYS } from '../data/index.js'

export default function Layout() {
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
    setMenuOpen(false)
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-mark">+</span> WebMed
          </Link>
          <form className="header-search" onSubmit={submit} role="search">
            <input
              type="search"
              placeholder="Поиск: аппендэктомия, зажим Кохера…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Поиск"
            />
          </form>
          <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Меню">
            ☰
          </button>
        </div>
        <nav className={`container nav ${menuOpen ? 'nav-open' : ''}`}>
          {TYPE_KEYS.map((type) => (
            <NavLink key={type} to={`/${type}`} onClick={() => setMenuOpen(false)}>
              {TYPES[type].icon} {TYPES[type].label}
            </NavLink>
          ))}
          <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>
            ★ Избранное
          </NavLink>
        </nav>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          WebMed — учебный справочник для студентов-медиков. Материалы носят образовательный характер и не заменяют
          учебники, клинические рекомендации и обучение под руководством преподавателя.
        </div>
      </footer>
    </>
  )
}
