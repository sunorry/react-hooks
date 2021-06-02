作用：**逻辑重用、业务分离**

使得代码结构更加清晰。痛点eg：需要在组建中监听窗口变化，导致需要在不同生命周期去做事件 on 和 off。

- 2 个核心 Hooks：useState、useEffect
- 4 个常用内置 Hooks：useCallback、useMemo、useRef、useContext

为什么创造 Hooks?

1. React 组件之间不会互相继承，也就是没有用到 Class 的特性
2. UI 由状态驱动，很少在外部调用一个 class 实例（组建方法）。组件的所有方法都在内部调用或作为生命周期被自动调用
3. 其他：之前的函数组件无法存在内部状态，必须是纯函数，且无法提供完整的生命周期

所以，要达到的目的就是给函数组件加上状态：

1. 函数和对象不同，实例对象无法在多次执行之后保存状态，因此需要一个函数之外的空间保存状态，且能检测变化，从而出发函数的 render
2. 需要一个机制，保证把外部的数据绑定到函数的执行。变化时，函数能自动重新执行。因此，任何会影响 UI 的外部数据，都可以通过这个机制绑定到 React 的函数组件。（state、URL、windowSize）



**useState**

`useState` 让函数组件具有维持状态的能力。**不要保存可以通过计算得到的值**。

1. props 需要通过计算再显示，避免使用 state
2. URL 直接从 location 中获取
3. cookie 等直接获取，不用放到 state 中

缺点：一旦组件有自己的状态，意味着组件如果重新创建，就需要有恢复状态的过程，这通常让组件变得复杂。

如：userList 放到本地 state 中，每一个用到组件的地方，多需要重新获取。可以使用 Redux 管理 state，组件本身可以状态，成为更纯粹的表现层，没有太多业务逻辑，从而更易使用、测试和维护。



**useEffect** 执行副作用，useEffect 是每次组件 render 完**后**判断依赖并执行

副作用：**一段和当前执行无关的代码**，eg 修改函数外部变量，ajax 等。也就是，在函数组件的当次执行过程中，useEffect 中代码的执行时不影响 UI 的

```javascript
useEffect(callback, dependencies?)
```

无 dependencies，那么 callback 就会在每次函数组件执行后都执行，有，只有依赖项中的值改变了才会执行。

特殊用法

1. 没有依赖项，每次 ender 后都会重新执行
2. **空数组依赖**，只有首次执行时触发，对应的 Class 就是 componentDidMount
3. 返回一个函数，用于在组件销毁时做一些清理操作，类似于  componentWillUnmount



**理解 Hooks 的依赖**

1. 依赖项中变量一定时回调函数中用到的，否则无意义
2. 依赖项是一个常量数组，不是一个变量，即创建时就要定义清楚
3. React 使用浅比较对比依赖是否发生变化，所以**注意数组和对象**



**Hooks 使用规则**

一、只能在函数组件的顶级作用域使用

1. 不能在循环、条件或者潜逃函数内执行，必须在顶层
2. Hooks 在组件的多次渲染之间，必须按照顺序执行

```javascript
function MyComp() {
  const [count, setCount] = useState(0);
  if (count > 10) {
    // 错误：不能将 Hook 用在条件判断里
    useEffect(() => {
      // ...
    }, [count])
  }

  // 这里可能提前返回组件渲染结果，后面就不能再用 Hooks 了
  if (count === 0) {
    return 'No content';
  }

  // 错误：不能将 Hook 放在可能的 return 之后
  const [loading, setLoading] = useState(false);

  //...
  return <div>{count}</div>
}
```

总结：所有 Hook 必须要被执行到；必须按顺序执行



二、只能在函数组件或其他 Hooks 使用


**`useCallback` 缓存回调函数**
问题：每一次 UI 变化，都通过重新执行整个函数来完成，这和 Class 组件有很大区别：函数组件中没有一个直接的方式在多次渲染之间维持一个状态。
```javascript
function Counter() {
  const [count, setCount] = useState(0)
  const handleIncrement = () => setCount(count + 1)
  return <button onClick={ handleIncrement }>+</button>
}
```
每次 +1，函数多次渲染，无法重用 `handleIncrement`，每次需要创建一个新的。它里面包含了 `count` 这个变量的闭包，以确保每次都能够得到正确的结果。
同时意味着，即使 `count` 没有发生变化，但函数因为其他状态发生变化而重新渲染，也会重新生成 `handleIncrement`，虽然不影响结果，但没必要。不仅增加了系统开销，更重要的是：**每次创建新的函数会让接受事件处理函数的组件，需要重新渲染**。
所以我们需要只有 `count` 发生变化的时，才需要重新定义一个回调函数，这正是 `useCallback` 这个 hook 的作用。
```javascript
function Counter() {
  const [count, setCount] = useState(0)
  const handleIncrement = useCallback(() => setCount(count + 1), [count])
  return <button onClick={ handleIncrement }>+</button>
}
```

**`useMemo`： 缓存计算的结果**
某个数据通过其他数据计算得到，那只有当依赖数据改变时才需要重新计算。
作用：避免自组件重复渲染
```javascript
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
```

如果 `<li>` 换成组件，如果没有 `useMemo`，组件会一直 rerender。

**`useCallback` 的功能可以用 `useMemo` 来实现。
```javascript
const myEventHandler = useMemo(() => {
  return () => {

  }
}, [dep1, dep2])
```

**`useCallback` 和 `useMemo` 都是做同一件事的，建立了一个绑定某个结果到依赖数据的关系。只有依赖变了，这个结果才会被重新得到。**

**`useRef`： 在多个渲染之间共享数据、保存 DOM 节点**

**`useContext`: 定义全局状态**
一个 context 从某个组件为根组件的组件树上可用，是一个 Provider。
```javascript
const MyCtx = React.createContext(value)
```


Q: 是任何场景 函数都用useCallback 包裹吗？那种轻量的函数是不是不需要？
A: 确实不是，useCallback 可以减少不必要的渲染，主要体现在将回调函数作为属性传给某个组件。如果每次都不一样就会造成组件的重新渲染。但是如果你确定子组件多次渲染也没有太大问题，特别是原生的组件，比如 button，那么不用 useCallback 也问题不大。所以这和子组件的实现相关，和函数是否轻量无关。但是比较好的实践是都 useCallback。


**避免使用 Class 的思路写 Hooks**

引起状态变化的原因只有两个：
1. 用户操作产生事件，click
2. 副作用产生的事件，fetch =》 useEffect

```javascript
class BlogView extends React.Component {
  componentDidMount() {
    fetchBlog(this.props.id)
  }
  componentDidUpdate(prevProps) {
    if (provProps.id !== this.props.id) {
      fetchBlog(this.props.id)
    }
  }
}

function BlogView({ id }) {
  useEffect(() => {
    fetchBlog(id)
  }, [id])
}
```
思考方式是：**当某个状态发生变化时，我要做什么**