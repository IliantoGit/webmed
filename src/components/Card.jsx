import { Link } from 'react-router-dom'
import { TYPES } from '../data/index.js'
import Illustration from './Illustration.jsx'
import FavButton from './FavButton.jsx'

export default function Card({ item }) {
  const t = TYPES[item.type]
  return (
    <article className="card">
      <Link to={`/${item.type}/${item.id}`} className="card-link">
        {(item.illustration || item.image) && (
          <div className="card-media">
            <Illustration kind={item.illustration} image={item.image} title={item.title} size="sm" />
          </div>
        )}
        <div className="card-body">
          <span className={`badge badge-${item.type}`}>
            {t.icon} {t.one}
          </span>
          {item.status === 'review' && <span className="badge badge-review">На проверке</span>}
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <Meta item={item} />
        </div>
      </Link>
      <FavButton type={item.type} id={item.id} small />
    </article>
  )
}

function Meta({ item }) {
  const parts = []
  if (item.difficulty) parts.push(`Сложность: ${item.difficulty}`)
  if (item.duration) parts.push(item.duration)
  if (item.category) parts.push(item.category)
  if (item.icd) parts.push(`МКБ-10: ${item.icd}`)
  if (item.system) parts.push(item.system)
  if (item.group) parts.push(item.group)
  if (!parts.length) return null
  return <div className="card-meta">{parts.join(' · ')}</div>
}

export function CardGrid({ items }) {
  return (
    <div className="grid">
      {items.map((item) => (
        <Card key={`${item.type}/${item.id}`} item={item} />
      ))}
    </div>
  )
}
