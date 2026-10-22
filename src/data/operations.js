// Операции. Поля instruments / diseases / anatomy / drugs — это id из других разделов,
// по ним строятся ссылки. В шаге можно указать image: 'images/файл.jpg' и caption.
// sources — ссылки на учебники из src/data/sources.js.

import { abdomenOperations } from './operations-abdomen.js'
import { otherOperations } from './operations-other.js'

export const operations = [...abdomenOperations, ...otherOperations]
