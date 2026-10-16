import { useFavorites } from '../favorites.js'

export default function FavButton({ type, id, small }) {
  const { isFav, toggle } = useFavorites()
  const on = isFav(type, id)
  return (
    <button
      type="button"
      className={`fav ${on ? 'fav-on' : ''} ${small ? 'fav-small' : ''}`}
      onClick={() => toggle(type, id)}
      aria-pressed={on}
      title={on ? 'Убрать из избранного' : 'В избранное'}
    >
      {on ? '★' : '☆'}
      {!small && <span>{on ? ' В избранном' : ' В избранное'}</span>}
    </button>
  )
}
