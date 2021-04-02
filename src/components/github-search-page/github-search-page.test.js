import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'

import {GithubSearchPage} from './github-search-page'

// render the component before each test
beforeEach(() => render(<GithubSearchPage />))

describe('when the GithubSearchPage is mounted', () => {
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

describe('when the user does a search', () => {
  // test disabled search button
  it('the search button should be disabled until the search is done', async () => {
    const button = screen.getByRole('button', {name: /search/i})
    // before the event the button should not be disabled
    expect(button).not.toBeDisabled()

    // event
    fireEvent.click(button)

    // after the event the button should be disabled until the search is done
    expect(button).toBeDisabled()

    // once the search is done the button should not be disabled
    await waitFor(() => expect(button).not.toBeDisabled())
  })

  // test sticky table
  it('the data should be displayed as a sticky table', async () => {
    // event
    fireEvent.click(screen.getByRole('button', {name: /search/i}))

    // after the event, the initial message should not be displayed
    await waitFor(() =>
      expect(
        screen.queryByText(
          /please provide a search option and click in the search button/i,
        ),
      ).not.toBeDisabled(),
    )

    // after the event, a table should be displayed
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
