import React from 'react'
import {screen, render} from '@testing-library/react'

import {ErrorBoundary} from './error-boundary'

describe.only('when the component works without errors', () => {
  it('must render the component content', () => {
    render(
      <ErrorBoundary>
        <h1>Test pass</h1>
      </ErrorBoundary>,
    )

    expect(screen.getByText(/test pass/i)).toBeInTheDocument()
  })
})

describe('when the component throws an errors', () => {
  it("must render the message 'There is an unexpected error' and a reload button", () => {})
})

describe('when the user clicks on reload button', () => {
  it('must reload the app', () => {})
})
