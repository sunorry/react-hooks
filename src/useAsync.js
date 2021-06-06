import { useState, useCallback } from 'react'

export default function useAsync(asyncFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const execute = useCallback(() => {
    setLoading(true)
    setData(null)
    setError(null)
    return asyncFn()
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }, [asyncFn])

  return {
    execute,
    loading,
    data,
    error
  }
}