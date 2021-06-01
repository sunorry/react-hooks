import { useState, useCallback, useRef } from 'react'

export default function Timer() {
  const timerId = useRef(null)
  const [time, setTime] = useState(0)

  const handleStart = useCallback(() => {
    timerId.current = setInterval(() => {
      setTime(time + 1)
    }, 1000)
  }, [time])

  const handleStop = useCallback(() => {
    clearInterval(timerId.current)
    timerId.current = null
  }, [])

  return (
    <div>
      { time }
      <button onClick={ handleStart }>Start</button>
      <button onClick={ handleStop }>Stop</button>
    </div>
  )
}