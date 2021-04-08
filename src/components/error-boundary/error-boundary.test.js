import React from 'react'
import {screen, render, fireEvent} from '@testing-library/react'

import {ErrorBoundary} from './error-boundary'

// solution to test error boundaries
jest.spyOn(console, 'error')

// component
const ThrowError = () => {
  throw new Error('ups')
}

describe('when the component works without errors', () => {
  // test to validate that component renders
  it('must render the component content', () => {
    render(
      <ErrorBoundary>
        <h1>Test pass</h1>
      </ErrorBoundary>,
    )

    expect(screen.getByText(/test pass/i)).toBeInTheDocument()
  })
})

describe('when the component throws an error', () => {
  // test to validate error when component renders and reload button
  it("must render the message 'There is an unexpected error' and a reload button", () => {
    // render component
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )

    // error message
    expect(
      screen.getByText(/there is an unexpected error/i),
    ).toBeInTheDocument()

    // reload button
    expect(screen.getByRole('button', {name: /reload/i})).toBeInTheDocument()
  })
})

describe('when the user clicks on reload button', () => {
  // test to validate app reloads
  it('must reload the app', () => {
    // clear app
    delete window.location
    // reload mock function
    window.location = {reload: jest.fn()}

    // render component
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )

    // event
    fireEvent.click(screen.getByRole('button', {name: /reload/i}))

    // reload app
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})
