import { useEffect, useMemo, useState } from 'react'

function getUserList() {
  return new Promise(resolve => {
    setTimeout(() => resolve([1,2,3,4]), 1000)
  })
}

export default function SearchableUser() {
  const [users, setUsers] = useState(null)
  const [searchKey, setSearchKey] = useState(null)

  useEffect(() => {
    async function fetchList() {
      const list = await getUserList()
      setUsers(list)
    }
    fetchList()
  }, [])

  // let usersToShow = null
  // // 只需要在 users 或 searchKey 改变才需要重新计算
  // if (users) {
  //   usersToShow = users.filter(user => user.includes(searchKey))
  // }
  const usersToShow = useMemo(() => {
    if (!users) return null
    return users.filter(user => user.includes(searchKey))
  }, [searchKey, users])

  return (
    <div>
      <input type="text" value={searchKey} onChange={ evt => setSearchKey(evt.target.value) } />
      <ul>
        { usersToShow && usersToShow.map(user => <li>{ user }</li>) }
      </ul>
    </div>
  )
}

