// Встроенные схематичные SVG-иллюстрации. Это заглушки: для настоящих фото
// укажите у записи поле image (путь к файлу в public/images).

const S = { stroke: 'var(--ink)', strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }
const METAL = 'url(#metal)'

function Rings({ x = 30, y1 = 45, y2 = 75 }) {
  return (
    <>
      <circle cx={x} cy={y1} r="11" {...S} fill="var(--bg)" />
      <circle cx={x} cy={y2} r="11" {...S} fill="var(--bg)" />
    </>
  )
}

const DRAWINGS = {
  scalpel: (
    <>
      <rect x="20" y="54" width="100" height="12" rx="4" {...S} fill={METAL} />
      <path d="M120 54 L150 50 Q185 52 180 64 L120 66 Z" {...S} fill="var(--blade)" />
      <line x1="30" y1="60" x2="110" y2="60" stroke="var(--muted)" strokeWidth="1.5" />
    </>
  ),
  forceps: (
    <>
      <path d="M20 58 L170 52 M20 62 L170 68" {...S} strokeWidth="5" stroke={METAL} />
      <path d="M20 58 L170 52 M20 62 L170 68" {...S} />
      <path d="M20 58 Q14 60 20 62" {...S} />
      {[60, 75, 90, 105].map((x) => (
        <line key={x} x1={x} y1={57 - (x - 20) * 0.04} x2={x} y2={63 + (x - 20) * 0.04} stroke="var(--muted)" strokeWidth="1.5" />
      ))}
    </>
  ),
  scissors: (
    <>
      <Rings />
      <path d="M40 48 L95 62 L180 55 M40 72 L95 58 L180 66" {...S} strokeWidth="4" />
      <circle cx="95" cy="60" r="3.5" fill="var(--ink)" />
    </>
  ),
  clamp: (
    <>
      <Rings />
      <path d="M40 48 L100 62 L175 58 M40 72 L100 58 L175 62" {...S} strokeWidth="4" />
      <circle cx="100" cy="60" r="3.5" fill="var(--ink)" />
      <path d="M55 52 l6 4 l-6 4 M55 68 l6 -4 l-6 -4" stroke="var(--muted)" strokeWidth="1.5" fill="none" />
      {[125, 135, 145, 155, 165].map((x) => (
        <line key={x} x1={x} y1="56" x2={x} y2="64" stroke="var(--muted)" strokeWidth="1.2" />
      ))}
    </>
  ),
  needleholder: (
    <>
      <Rings />
      <path d="M40 48 L120 61 L165 58 M40 72 L120 59 L165 62" {...S} strokeWidth="4" />
      <circle cx="120" cy="60" r="3.5" fill="var(--ink)" />
      <path d="M160 60 Q175 30 195 45" {...S} stroke="var(--accent)" />
    </>
  ),
  needle: (
    <>
      <path d="M40 85 A60 60 0 0 1 160 85" {...S} strokeWidth="4" />
      <path d="M160 85 l-2 -10 l8 6 z" fill="var(--ink)" />
      <path d="M40 85 Q20 95 30 110 Q45 118 60 105" {...S} stroke="var(--accent)" />
    </>
  ),
  'needle-straight': (
    <>
      <rect x="15" y="52" width="45" height="16" rx="4" {...S} fill={METAL} />
      <line x1="60" y1="60" x2="175" y2="60" {...S} strokeWidth="5" />
      <path d="M175 56 L190 60 L175 64 Z" fill="var(--ink)" />
      <rect x="60" y="56" width="10" height="8" fill="var(--accent)" />
    </>
  ),
  suture: (
    <>
      <rect x="35" y="25" width="130" height="70" rx="8" {...S} fill="var(--bg)" />
      <path d="M50 75 C70 30, 90 90, 110 50 S150 40, 150 70" {...S} stroke="var(--accent)" strokeWidth="3" />
      <path d="M130 45 A15 15 0 0 1 155 45" {...S} />
      <text x="100" y="110" textAnchor="middle" fontSize="12" fill="var(--muted)">USP 3/0</text>
    </>
  ),
  retractor: (
    <>
      <path d="M30 30 L30 50 Q30 60 45 60 L155 60 Q170 60 170 72 L170 95" {...S} strokeWidth="9" stroke={METAL} />
      <path d="M30 30 L30 50 Q30 60 45 60 L155 60 Q170 60 170 72 L170 95" {...S} />
    </>
  ),
  hook: (
    <>
      <rect x="15" y="54" width="90" height="12" rx="5" {...S} fill={METAL} />
      <line x1="105" y1="60" x2="160" y2="60" {...S} strokeWidth="4" />
      <path d="M160 60 Q180 60 178 80 L170 74" {...S} strokeWidth="4" />
    </>
  ),
  dilator: (
    <>
      <path d="M30 40 Q60 55 95 58 M30 80 Q60 65 95 62" {...S} strokeWidth="5" />
      <circle cx="95" cy="60" r="3.5" fill="var(--ink)" />
      <path d="M95 58 Q140 40 175 40 Q185 42 178 50 M95 62 Q140 80 175 80 Q185 78 178 70" {...S} strokeWidth="4" />
    </>
  ),
  tube: (
    <>
      <rect x="20" y="30" width="60" height="14" rx="5" {...S} fill="var(--bg)" />
      <path d="M50 44 L50 55 Q50 95 100 95 L160 95" {...S} strokeWidth="12" stroke="var(--accent-soft)" />
      <path d="M50 44 L50 55 Q50 95 100 95 L160 95" {...S} />
      <ellipse cx="130" cy="95" rx="18" ry="11" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 3" />
    </>
  ),
  towel: (
    <>
      <Rings />
      <path d="M40 48 L100 60 Q150 40 165 60 M40 72 L100 60 Q150 80 165 60" {...S} strokeWidth="3.5" />
      <circle cx="100" cy="60" r="3.5" fill="var(--ink)" />
    </>
  ),
  suction: (
    <>
      <path d="M15 60 Q40 40 70 60" {...S} stroke="var(--muted)" strokeWidth="6" />
      <path d="M70 60 L150 60 Q170 60 182 80" {...S} strokeWidth="8" stroke={METAL} />
      <path d="M70 60 L150 60 Q170 60 182 80" {...S} />
    </>
  ),
  cautery: (
    <>
      <path d="M10 70 Q20 60 25 60" {...S} stroke="var(--muted)" strokeWidth="4" />
      <rect x="25" y="50" width="100" height="20" rx="8" {...S} fill="var(--bg)" />
      <rect x="55" y="45" width="14" height="6" rx="2" fill="#eab308" />
      <rect x="78" y="45" width="14" height="6" rx="2" fill="#3b82f6" />
      <path d="M125 60 L175 60 L175 75" {...S} strokeWidth="3" />
      <path d="M180 62 l6 -6 M182 70 l8 -2" stroke="var(--accent)" strokeWidth="2" />
    </>
  ),
  trocar: (
    <>
      <rect x="20" y="40" width="40" height="40" rx="6" {...S} fill="var(--bg)" />
      <rect x="60" y="50" width="100" height="20" rx="3" {...S} fill={METAL} />
      <path d="M160 52 L185 60 L160 68" fill="var(--ink)" />
      <circle cx="40" cy="60" r="8" {...S} />
    </>
  ),
  scope: (
    <>
      <rect x="15" y="45" width="45" height="30" rx="6" {...S} fill="var(--bg)" />
      <line x1="60" y1="60" x2="185" y2="60" {...S} strokeWidth="7" stroke={METAL} />
      <line x1="60" y1="60" x2="185" y2="60" {...S} />
      <path d="M40 45 L40 25 L80 25" {...S} stroke="var(--muted)" strokeWidth="3" />
      <path d="M185 60 l10 -10 M185 60 l12 0 M185 60 l10 10" stroke="#eab308" strokeWidth="2" />
    </>
  ),
  lapinstrument: (
    <>
      <path d="M20 90 L35 55 L60 55 L50 90 Z" {...S} fill="var(--bg)" />
      <circle cx="35" cy="45" r="8" {...S} />
      <line x1="60" y1="58" x2="170" y2="58" {...S} strokeWidth="5" stroke={METAL} />
      <line x1="60" y1="58" x2="170" y2="58" {...S} />
      <path d="M170 58 L190 50 M170 58 L190 66" {...S} strokeWidth="3" />
    </>
  ),
  mesh: (
    <>
      <path d="M35 30 L165 30 Q175 60 165 90 L35 90 Q25 60 35 30 Z" {...S} fill="var(--accent-soft)" />
      {[50, 65, 80, 95, 110, 125, 140, 155].map((x) => (
        <line key={x} x1={x} y1="32" x2={x} y2="88" stroke="var(--accent)" strokeWidth="0.8" />
      ))}
      {[40, 50, 60, 70, 80].map((y) => (
        <line key={y} x1="32" y1={y} x2="168" y2={y} stroke="var(--accent)" strokeWidth="0.8" />
      ))}
    </>
  ),
  organ: (
    <>
      <path d="M60 30 C20 35 25 95 70 92 C110 90 120 110 150 95 C185 78 170 35 135 40 C110 44 100 25 60 30 Z" {...S} fill="var(--organ)" />
      <path d="M70 55 C90 65 120 50 140 65" stroke="var(--muted)" strokeWidth="1.5" fill="none" />
    </>
  ),
  region: (
    <>
      <rect x="30" y="20" width="140" height="85" rx="10" {...S} fill="var(--organ)" />
      <line x1="100" y1="20" x2="100" y2="105" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M45 95 L95 70" {...S} stroke="var(--accent)" strokeWidth="3" />
    </>
  ),
  layers: (
    <>
      <rect x="20" y="20" width="160" height="14" {...S} fill="#f5d0b5" />
      <rect x="20" y="34" width="160" height="30" {...S} fill="#f0b8a0" />
      <rect x="20" y="64" width="160" height="38" {...S} fill="#fbe7a6" />
      <text x="185" y="31" fontSize="9" fill="var(--muted)" textAnchor="end">эпидермис</text>
    </>
  ),
  probe: (
    <>
      <rect x="15" y="52" width="40" height="16" rx="3" {...S} fill={METAL} />
      <path d="M55 56 L180 56 Q188 60 180 64 L55 64 Z" {...S} fill={METAL} />
      <line x1="62" y1="60" x2="176" y2="60" stroke="var(--muted)" strokeWidth="1.5" />
    </>
  ),
  spatula: (
    <>
      <rect x="15" y="54" width="70" height="12" rx="5" {...S} fill={METAL} />
      <path d="M85 50 L185 42 Q192 60 185 78 L85 70 Z" {...S} fill={METAL} />
    </>
  ),
  saw: (
    <>
      <rect x="15" y="40" width="40" height="40" rx="8" {...S} fill="var(--bg)" />
      <rect x="55" y="45" width="130" height="22" {...S} fill={METAL} />
      <path d={'M55 67 ' + Array.from({ length: 13 }, (_, i) => `l5 8 l5 -8`).join(' ')} {...S} />
    </>
  ),
  tourniquet: (
    <>
      <path d="M20 60 Q60 20 100 60 T180 60" {...S} strokeWidth="10" stroke="var(--accent)" />
      <path d="M20 60 Q60 20 100 60 T180 60" {...S} strokeWidth="2" stroke="var(--bg)" />
      <rect x="170" y="50" width="16" height="20" rx="3" {...S} fill={METAL} />
    </>
  ),
  raspatory: (
    <>
      <rect x="15" y="52" width="100" height="16" rx="6" {...S} fill={METAL} />
      <line x1="115" y1="60" x2="160" y2="60" {...S} strokeWidth="4" />
      <path d="M160 48 L185 52 L185 68 L160 72 Z" {...S} fill="var(--blade)" />
    </>
  ),
}

export default function Illustration({ kind, image, title, size = 'md' }) {
  if (image) {
    // путь без ведущего «/», чтобы картинки работали и в подпапке GitHub Pages
    return <img className={`illu illu-${size}`} src={image.replace(/^\//, '')} alt={title} loading="lazy" />
  }
  const drawing = DRAWINGS[kind]
  return (
    <svg className={`illu illu-${size}`} viewBox="0 0 200 120" role="img" aria-label={title}>
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--metal-1)" />
          <stop offset="1" stopColor="var(--metal-2)" />
        </linearGradient>
      </defs>
      {drawing || (
        <text x="100" y="66" textAnchor="middle" fontSize="40">
          ⚕
        </text>
      )}
    </svg>
  )
}
