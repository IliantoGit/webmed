import { Link } from 'react-router-dom'
import { useFavorites } from '../favorites.js'
import { getItem } from '../data/index.js'
import { CardGrid } from '../components/Card.jsx'

export default function Favorites() {
  const { list } = useFavorites()
  const items = list
    .map((key) => {
      const [type, id] = key.split('/')
      const item = getItem(type, id)
      return item
    })
    .filter(Boolean)

  return (
    <div>
      <h1>★ Избранное</h1>
      <p className="muted">Избранное хранится только в этом браузере.</p>
      {items.length ? (
        <CardGrid items={items} />
      ) : (
        <p className="empty">
          Пока пусто. Нажмите ☆ на любой карточке, чтобы сохранить её. <Link to="/search">Перейти к поиску</Link>
        </p>
      )}
    </div>
  )
}
