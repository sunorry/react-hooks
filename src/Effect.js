import { useState, useEffect } from 'react'

function BlogView({ id }) {
  const [blogContent, setBlogContent] = useState(null)

  useEffect(() => {
    console.log('id change ', id)
    setBlogContent(parseInt(Math.random() * 1000))
    // id 变化和组件销毁钱执行
    return () => {
      console.log('ops')
    }
  }, [id])

  const isLoading = !blogContent

  return <div>{ isLoading ? 'Loading...' : blogContent }</div>
}

export default BlogView