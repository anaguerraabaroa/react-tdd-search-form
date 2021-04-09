import React from 'react'

import {GithubSearchPage} from './components/github-search-page'
import {ErrorBoundary} from './components/error-boundary/index'

function App() {
  return (
    <>
      <ErrorBoundary>
        <GithubSearchPage />
      </ErrorBoundary>
    </>
  )
}

export default App
