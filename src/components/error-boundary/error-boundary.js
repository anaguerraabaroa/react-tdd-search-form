import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {Box} from '@material-ui/core'

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          padding={40}
        >
          <Typography variant="h4">There is an unexpected error</Typography>
          <Button
            type="button"
            onClick={this.handleReloadClick}
            variant="contained"
            color="primary"
          >
            Reload
          </Button>
        </Box>
      )
    }
    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
