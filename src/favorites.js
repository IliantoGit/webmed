import { useEffect, useState } from 'react'

// Избранное хранится в браузере (localStorage). Аккаунты не нужны.
const KEY = 'webmed:favorites'
const listeners = new Set()

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // приватный режим — избранное просто не сохранится
  }
  listeners.forEach((fn) => fn(list))
}

export function useFavorites() {
  const [list, setList] = useState(read)
  useEffect(() => {
    listeners.add(setList)
    return () => listeners.delete(setList)
  }, [])

  const isFav = (type, id) => list.includes(`${type}/${id}`)
  const toggle = (type, id) => {
    const key = `${type}/${id}`
    write(list.includes(key) ? list.filter((k) => k !== key) : [...list, key])
  }
  return { list, isFav, toggle }
}
