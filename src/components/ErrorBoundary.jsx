import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error('Caught by ErrorBoundary:', error, errorInfo)
  }

  componentDidUpdate(prevProps) {
    // Reset error state if the resetKey has changed
    if (this.props.resetKey !== prevProps.resetKey && this.state.error) {
      this.setState({ error: null, errorInfo: null })
    }
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div style={{ background: '#ffeef0', padding: '0.5rem', border: '1px solid red' }}>
          <h4>Something went wrong.</h4>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      )
    }

    return this.props.children
  }
}
