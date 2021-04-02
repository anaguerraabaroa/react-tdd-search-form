import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'

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
  // event variable
  const fireClickSearch = () =>
    fireEvent.click(screen.getByRole('button', {name: /search/i}))

  // test disabled search button
  it('the search button should be disabled until the search is done', async () => {
    // before the event the button should not be disabled
    expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled()

    // event
    fireClickSearch()

    // after the event the button should be disabled until the search is done
    expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()

    // once the search is done the button should not be disabled
    await waitFor(() =>
      expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled(),
    )
  })

  // test table
  it('the data should be displayed as a sticky table', async () => {
    // event
    fireClickSearch()

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

  // test table header
  it('the table header must contain: repository, stars, forks, open issues and updated at', async () => {
    // event
    fireClickSearch()

    // find matchers returns a promise that waits for the table to be displayed
    const table = await screen.findByRole('table')

    // within applies a query inside table node
    const tableHeaders = within(table).getAllByRole('columnheader')

    // tableHeaders must return an array with 5 elements
    expect(tableHeaders).toHaveLength(5)

    // tableHeaders
    const [repository, stars, forks, openIssues, updatedAt] = tableHeaders
    expect(repository).toHaveTextContent(/repository/i)
    expect(stars).toHaveTextContent(/stars/i)
    expect(forks).toHaveTextContent(/forks/i)
    expect(openIssues).toHaveTextContent(/open issues/i)
    expect(updatedAt).toHaveTextContent(/updated at/i)
  })

  // test table cells
  it('each table result must contain: owner avatar image, name, stars, updated at, forks, open issues, updated at, it should have a link that opens in a new tab', async () => {
    // event
    fireClickSearch()

    // find matchers returns a promise that waits for the table to be displayed
    const table = await screen.findByRole('table')

    // within applies a query inside table node
    const withinTable = within(table)

    // get tableCells
    const tableCells = withinTable.getAllByRole('cell')

    // tableCells array
    const [repository, stars, forks, openIssues, updatedAt] = tableCells

    // owner avatar image
    expect(within(repository).getByRole('img', {name: /test/i}))

    // tableCells must return an array with 5 elements
    expect(tableCells).toHaveLength(5)

    // array elements
    expect(repository).toHaveTextContent(/test/i)
    expect(stars).toHaveTextContent(/10/i)
    expect(forks).toHaveTextContent(/5/i)
    expect(openIssues).toHaveTextContent(/2/i)
    expect(updatedAt).toHaveTextContent(/2021-04-02/i)

    // repository link
    expect(withinTable.getByText(/test/i).closest('a')).toHaveAttribute(
      'href',
      'http://localhost:3000/test',
    )
  })

  // test total results
  it('must display the total results number of the search and the current number of results', async () => {
    // event
    fireClickSearch()

    // find matchers returns a promise that waits for the table to be displayed
    await screen.findByRole('table')

    // total results
    expect(screen.getByText(/1-1 of 1/i)).toBeInTheDocument()
  })

  it('results size per page select/combobox with the options: 30, 50, 100. The default is 30', async () => {
    // event
    fireClickSearch()

    // find matchers returns a promise that waits for the table to be displayed
    await screen.findByRole('table')

    // select
    expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument()

    // event (open select collapsable)
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))

    // options array
    const listbox = screen.getByRole('listbox', {name: /rows per page/i})

    // within applies a query inside listbox node
    const options = within(listbox).getAllByRole('option')

    // options destructuring
    const [option30, option50, option100] = options

    // options
    expect(option30).toHaveTextContent(/30/)
    expect(option50).toHaveTextContent(/50/)
    expect(option100).toHaveTextContent(/100/)
  })
})
