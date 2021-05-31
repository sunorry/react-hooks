import React from 'react'

const withWindowSize = Component => {
  class WrappedComponent extends React.PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        size: this.getSize()
      }
    }

    componentDidMount() {
      window.addEventListener("resize", this.handleResize)
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize)
    }

    handleResize = () => {
      // const currentSize = this.getSize()
      this.setState({
        size: this.getSize()
      })
    }

    getSize() {
      return window.innerWidth > 1000 ? 'large' : 'small'
    }

    render() { // 将窗口大小传递给真正的业务逻辑组件
      return <Component size={ this.state.size } />
    }
  }
  return WrappedComponent
}

class MyComponent extends React.Component {
  render() {
    const { size } = this.props
    return  <>
      <span>high comp: </span> 
      {size === 'small' ? 'small' : 'large'}
    </>
  }
}

export default withWindowSize(MyComponent)