import { useState, useCallback, useEffect } from 'react'

export default function useCounter() {
  const [count, setCount] = useState(0)

  const increment  = useEffect(() => {
    setCount(count + 1)
  }, [count])

  const decremnet  = useEffect(() => {
    setCount(count - 1)
  }, [count])

  const reset = useCallback(() => setCount(0), [])

  return {
    count,
    increment,
    decremnet,
    reset
  }
}