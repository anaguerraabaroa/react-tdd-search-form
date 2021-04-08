import React from 'react'
import PropTypes from 'prop-types'

export const ErrorBoundary = ({children}) => children

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
