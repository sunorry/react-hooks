import { useState, useEffect } from 'react'
import Effect from './Effect'

const getSize = () => {
  return window.innerWidth > 1000 ? 'large' : 'small'
}

const useWindowSize = () => {
  const [size, setSize] = useState(getSize())
  useEffect(() => {
    const handler = () => {
      setSize(getSize)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])
  return size
}

const HooksResize = () => {
  const size = useWindowSize()
  return <div>
   hooks: {size === 'small' ? 'small' : 'large'}
   <Effect id={size} />
  </div>
}

export default HooksResize