import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty">
      <h1>Страница не найдена</h1>
      <p>
        <Link to="/">На главную</Link> или <Link to="/search">к поиску</Link>
      </p>
    </div>
  )
}
