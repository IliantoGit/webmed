import { Link, useParams } from 'react-router-dom'
import { getItem, getItems, related, TYPES, TYPE_KEYS } from '../data/index.js'
import Illustration from '../components/Illustration.jsx'
import FavButton from '../components/FavButton.jsx'
import NotFound from './NotFound.jsx'
import { BOOKS } from '../data/sources.js'

export default function Detail() {
  const { type, id } = useParams()
  const item = getItem(type, id)
  if (!item) return <NotFound />
  const t = TYPES[type]
  const Body = BODIES[type]
  const rel = related(item)

  return (
    <article className="detail">
      <nav className="crumbs">
        <Link to="/">Главная</Link> / <Link to={`/${type}`}>{t.label}</Link> / <span>{item.title}</span>
      </nav>

      <header className="detail-head">
        <div className="detail-head-text">
          <span className={`badge badge-${type}`}>
            {t.icon} {t.one}
          </span>
          <h1>{item.title}</h1>
          {item.aliases?.length > 0 && <p className="aliases">Также: {item.aliases.join(', ')}</p>}
          <p className="lead">{item.summary}</p>
          <div className="tag-row">
            {item.tags?.map((tag) => (
              <Link key={tag} to={`/search?tag=${encodeURIComponent(tag)}`} className="chip chip-tag">
                #{tag}
              </Link>
            ))}
          </div>
          <FavButton type={type} id={id} />
        </div>
        {(item.illustration || item.image) && (
          <div className="detail-media">
            <Illustration kind={item.illustration} image={item.image} title={item.title} size="lg" />
            {item.image && item.imageCredit && <ImageCredit credit={item.imageCredit} />}
          </div>
        )}
      </header>

      {item.review && (
        <div className="review-banner" role="note">
          <strong>⚠ Статья на проверке</strong>
          <span>
            Материал подготовлен по учебной литературе и ещё не проверен преподавателем. Сверяйтесь с первоисточником.
          </span>
        </div>
      )}

      <Body item={item} />

      {item.sources?.length > 0 && (
        <section className="block sources">
          <h2>📚 Источники</h2>
          <ol>
            {item.sources.map((s, i) => (
              <li key={i}>
                {BOOKS[s.book] || s.book}
                {s.pages && <span className="muted"> — с. {s.pages}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {Object.keys(rel).length > 0 && (
        <section className="block">
          <h2>Связанные материалы</h2>
          <div className="related">
            {TYPE_KEYS.filter((k) => rel[k]).map((k) => (
              <div key={k} className="related-group">
                <h3>
                  {TYPES[k].icon} {TYPES[k].label}
                </h3>
                <ul>
                  {rel[k].map((r) => (
                    <li key={r.id}>
                      <Link to={`/${k}/${r.id}`}>{r.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

// Подпись к фото: автор, лицензия и ссылка на источник (требование лицензий CC)
function ImageCredit({ credit }) {
  const { author, license, source } = credit
  return (
    <p className="image-credit">
      {credit.kind === 'scheme' ? 'Схема' : 'Фото'}: {author || 'неизвестный автор'}
      {license && <>, {license}</>}
      {source && (
        <>
          {' · '}
          <a href={source} target="_blank" rel="noopener noreferrer">
            источник
          </a>
        </>
      )}
    </p>
  )
}

function List({ title, items, className }) {
  if (!items?.length) return null
  return (
    <section className={`block ${className || ''}`}>
      <h2>{title}</h2>
      <ul className="bullets">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </section>
  )
}

function Text({ title, children }) {
  if (!children) return null
  return (
    <section className="block">
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  )
}

function Facts({ rows }) {
  const visible = rows.filter(([, v]) => v)
  return (
    <dl className="facts">
      {visible.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function InstrumentChips({ ids }) {
  const list = getItems('instruments', ids)
  if (!list.length) return null
  return (
    <div className="instr-row">
      {list.map((ins) => (
        <Link key={ins.id} to={`/instruments/${ins.id}`} className="instr-chip" title={ins.title}>
          <Illustration kind={ins.illustration} image={ins.image} title={ins.title} size="xs" />
          <span>{ins.title}</span>
        </Link>
      ))}
    </div>
  )
}

function OperationBody({ item }) {
  return (
    <>
      <Facts
        rows={[
          ['Сложность', item.difficulty],
          ['Длительность', item.duration],
          ['Анестезия', item.anesthesia],
          ['Положение пациента', item.position],
        ]}
      />

      <section className="block">
        <h2>Инструменты ({item.instruments.length})</h2>
        <InstrumentChips ids={item.instruments} />
      </section>

      <div className="two-col">
        <List title="Показания" items={item.indications} className="good" />
        <List title="Противопоказания" items={item.contraindications} className="bad" />
      </div>

      <section className="block">
        <h2>Ход операции</h2>
        <ol className="toc">
          {item.steps.map((s, i) => (
            <li key={i}>
              <a href={`#step-${i + 1}`} onClick={(e) => scrollToStep(e, i + 1)}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
        <div className="steps">
          {item.steps.map((step, i) => (
            <Step key={i} n={i + 1} step={step} />
          ))}
        </div>
      </section>

      <div className="two-col">
        <List title="Возможные осложнения" items={item.complications} className="bad" />
        <List title="Послеоперационный период" items={item.postop} />
      </div>
    </>
  )
}

// HashRouter использует # для адресов, поэтому к шагам прокручиваем вручную
function scrollToStep(e, n) {
  e.preventDefault()
  document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Step({ n, step }) {
  const tools = getItems('instruments', step.instruments)
  return (
    <div className="step" id={`step-${n}`}>
      <div className="step-num">{n}</div>
      <div className="step-content">
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        {step.tip && <div className="tip">💡 {step.tip}</div>}
        {tools.length > 0 && (
          <div className="step-tools">
            <span className="muted">Инструменты шага:</span> <InstrumentChips ids={step.instruments} />
          </div>
        )}
      </div>
      {step.image && (
        <figure className="step-figure">
          <img src={step.image.replace(/^\//, '')} alt={step.title} loading="lazy" />
          {step.caption && <figcaption>{step.caption}</figcaption>}
          {step.imageCredit && <ImageCredit credit={step.imageCredit} />}
        </figure>
      )}
    </div>
  )
}

function InstrumentBody({ item }) {
  return (
    <>
      <Facts rows={[['Категория', item.category], ['Как держать', item.howToHold], ['Стерилизация', item.sterilization]]} />
      <Text title="Описание">{item.description}</Text>
      <List title="Применение" items={item.usage} />
    </>
  )
}

function DiseaseBody({ item }) {
  return (
    <>
      <Facts rows={[['Код МКБ-10', item.icd]]} />
      <Text title="Описание">{item.description}</Text>
      <List title="Клиническая картина" items={item.symptoms} />
      <List title="Диагностика" items={item.diagnostics} />
      <List title="Лечение" items={item.treatment} />
    </>
  )
}

function AnatomyBody({ item }) {
  return (
    <>
      <Facts rows={[['Система', item.system], ['Кровоснабжение', item.bloodSupply], ['Иннервация', item.innervation]]} />
      <Text title="Описание">{item.description}</Text>
      <List title="Важно для хирурга" items={item.keyFacts} />
    </>
  )
}

function DrugBody({ item }) {
  return (
    <>
      <Facts rows={[['Группа', item.group], ['Дозировка', item.dosage]]} />
      <div className="warn">Дозировки приведены в учебных целях. Перед назначением сверяйтесь с официальной инструкцией.</div>
      <Text title="Механизм действия">{item.mechanism}</Text>
      <List title="Показания" items={item.indications} className="good" />
      <div className="two-col">
        <List title="Противопоказания" items={item.contraindications} className="bad" />
        <List title="Побочные эффекты" items={item.sideEffects} />
      </div>
    </>
  )
}

const BODIES = {
  operations: OperationBody,
  instruments: InstrumentBody,
  diseases: DiseaseBody,
  anatomy: AnatomyBody,
  drugs: DrugBody,
}
