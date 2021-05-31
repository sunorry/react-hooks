import { useState } from 'react'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://reqres.in/api/users/")
      const json = await res.json()
      setUsers(json.data)
    } catch (err) {
      setError(err)
    }
    setLoading(false)
  }

  return (
    <div>
      <button onClick={ fetchUsers } disabled={ loading }>{ loading ? 'Loading...' : 'Show Users' }</button>
      {
        error && <div style={{ color: 'red' }}>Failed: { error }</div>
      }
      <br />
      <ul>
        {
          users.length > 0 &&
            users.map(user => <li key={ user.id }>{ user.first_name }</li>)
        }
      </ul>
    </div>
  )
}