import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Detail from './pages/Detail.jsx'
import Favorites from './pages/Favorites.jsx'
import NotFound from './pages/NotFound.jsx'
import { TYPES } from './data/index.js'
import './styles.css'

// Каталог раздела: #/operations, #/instruments ...
function Catalog() {
  const { type } = useParams()
  if (!TYPES[type]) return <NotFound />
  return <Search key={type} fixedType={type} />
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// HashRouter: адреса вида /#/operations/... — работает на GitHub Pages без настройки сервера
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path=":type" element={<Catalog />} />
          <Route path=":type/:id" element={<Detail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
