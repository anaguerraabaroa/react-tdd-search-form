import React from 'react'
import PropTypes from 'prop-types'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  // lifecycle that stays in caché when the error happens
  static getDerivedStateFromError() {
    return {hasError: true}
  }

  // event handler
  handleReloadClick = () => window.location.reload()

  render() {
    const {children} = this.props
    const {hasError} = this.state
    if (hasError) {
      return (
        <>
          <p>There is an unexpected error</p>
          <button type="button" onClick={this.handleReloadClick}>
            Reload
          </button>
        </>
      )
    }
    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
