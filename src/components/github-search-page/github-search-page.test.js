import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {GithubSearchPage} from './github-search-page'

// api data variable
const fakeRepo = {
  id: '56757919',
  name: 'django-rest-framework-reactive',
  owner: {
    avatar_url: 'https://avatars0.githubusercontent.com/u/2120224?v=4',
  },
  html_url: 'https://github.com/genialis/django-rest-framework-reactive',
  updated_at: '2020-10-24',
  stargazers_count: 58,
  forks_count: 9,
  open_issues_count: 0,
}

// setup server
const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        total_count: 8643,
        incomplete_results: false,
        items: [fakeRepo],
      }),
    )
  }),
)

// enable API mocking before tests
beforeAll(() => server.listen())

// reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers())

// disable API mocking after the tests are done
afterAll(() => server.close())

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

describe('when the developer does a search', () => {
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
  it.only('the data should be displayed as a sticky table', async () => {
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
    const avatarImg = within(repository).getByRole('img', {name: fakeRepo.name})
    expect(avatarImg).toBeInTheDocument()

    // tableCells must return an array with 5 elements
    expect(tableCells).toHaveLength(5)

    // array elements
    expect(repository).toHaveTextContent(fakeRepo.name)
    expect(stars).toHaveTextContent(fakeRepo.stargazers_count)
    expect(forks).toHaveTextContent(fakeRepo.forks_count)
    expect(openIssues).toHaveTextContent(fakeRepo.open_issues_count)
    expect(updatedAt).toHaveTextContent(fakeRepo.updated_at)

    // repository link
    expect(withinTable.getByText(fakeRepo.name).closest('a')).toHaveAttribute(
      'href',
      fakeRepo.html_url,
    )

    // avatar image
    expect(avatarImg).toHaveAttribute('src', fakeRepo.owner_avatar_url)
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

  // test results per page
  it('results size per page select/combobox with the options: 30, 50, 100. The default is 30', async () => {
    // event
    fireClickSearch()

    // find matchers returns a promise that waits for the table to be displayed
    await screen.findByRole('table')

    // select
    expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument()

    // event (open select collapsable)
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))

    // get select collapsable
    const listbox = screen.getByRole('listbox', {name: /rows per page/i})

    // within applies a query inside listbox node
    const options = within(listbox).getAllByRole('option')

    // options destructuring
    const [option30, option50, option100] = options

    // options per page
    expect(option30).toHaveTextContent(/30/)
    expect(option50).toHaveTextContent(/50/)
    expect(option100).toHaveTextContent(/100/)
  })

  // test previous and next pagination buttons
  it('must exists the next and previous pagination button', async () => {
    // event
    fireClickSearch()

    // find matchers returns a promise that waits for the table to be displayed
    await screen.findByRole('table')

    // previous page variable
    const previousPageBtn = screen.getByRole('button', {name: /previous page/i})

    // previous page
    expect(previousPageBtn).toBeInTheDocument()

    // next page
    expect(screen.getByRole('button', {name: /next page/i})).toBeInTheDocument()

    // previous page should be disabled in the first page
    expect(previousPageBtn).toBeDisabled()
  })
})

describe('when the developer does a search without results', () => {
  // test not found search results
  it('must display an empty state message', () => {})
})
