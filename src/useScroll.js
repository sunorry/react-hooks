import { useEffect, useState } from 'react'

const getPosition = () => {
  return {
    x: document.body.scrollLeft,
    y: document.body.scrollTop
  }
}

const useScroll = () => {
  const [position, setPosition] = useState(getPosition())
  useEffect(() => {
    const handler = () => {
      setPosition(getPosition())
    }
    document.body.addEventListener('scroll', handler)

    return () => {
      document.body.removeEventListener('scroll', handler)
    }
  }, [])

  return position
}