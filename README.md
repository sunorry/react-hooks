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

1. 