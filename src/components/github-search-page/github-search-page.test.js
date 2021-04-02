import React from 'react'
import {render, screen} from '@testing-library/react'

import {GithubSearchPage} from './github-search-page'

describe('when the GithubSearchPage is mounted', () => {
  // render the component before each test
  beforeEach(() => render(<GithubSearchPage />))

  // test page title
  it('must display the title', () => {
    expect(
      screen.getByRole('heading', {name: /github repositories list/i}),
    ).toBeInTheDocument()
  })

  // test input text + label
  it('must be an input text with label "filter by" field', () => {
    expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument()
  })

  // test search button
  it('must be a search button', () => {
    expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument()
  })

  // test initial message
  it('must be an initial message "Please provide a search option and click in the search button"', () => {
    expect(
      screen.getByText(
        /please provide a search option and click in the search button/i,
      ),
    ).toBeInTheDocument()
  })
})
