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
import {
  makeFakeResponse,
  makeFakeRepo,
  getReposListBy,
  makeFakeError,
} from '../../__fixtures__/repos'
import {
  OK_STATUS,
  UNEXPECTED_STATUS,
  UNPROCESSABLE_STATUS,
} from '../../consts/index'

// fake response variable
const fakeResponse = makeFakeResponse({totalCount: 1})

// fake repo variable
const fakeRepo = makeFakeRepo()

fakeResponse.items = [fakeRepo]

// setup server
const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) =>
    res(ctx.status(OK_STATUS), ctx.json(fakeResponse)),
  ),
)

// enable API mocking before tests
beforeAll(() => server.listen())

// reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers())

// disable API mocking after the tests are done
afterAll(() => server.close())

// render the component before each test
beforeEach(() => render(<GithubSearchPage />))

// event variable
const fireClickSearch = () =>
  fireEvent.click(screen.getByRole('button', {name: /search/i}))

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
  // test disabled search button
  it('the search button should be disabled until the search is done', async () => {
    // before the event the button should not be disabled
    expect(screen.getByRole('button', {name: /search/i})).not.toBeDisabled()

    // change input
    fireEvent.change(screen.getByLabelText(/filter by/i), {
      target: {value: 'test'},
    })

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
      ).not.toBeInTheDocument(),
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
  // test results not found
  it('must display an empty state message: "Your search has no results', async () => {
    // set the mock server results not found
    // server.use create the server again. It is needed to set up an expected response only for this test
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(ctx.status(OK_STATUS), ctx.json(makeFakeResponse({}))),
      ),
    )
    // event
    fireClickSearch()

    // expect error message
    await waitFor(() =>
      expect(
        screen.getByText(/your search has no results/i),
      ).toBeInTheDocument(),
    )

    // expect not table
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})

describe('when the developer types on filter by and does a search', () => {
  // test filter by repo name
  it('must display the related repos', async () => {
    // setup the mock server
    const internalFakeResponse = makeFakeResponse()
    const REPO_NAME = 'laravel'
    const expectedRepo = getReposListBy({name: REPO_NAME})[0]

    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(
          ctx.status(OK_STATUS),
          ctx.json({
            ...internalFakeResponse,
            items: getReposListBy({name: req.url.searchParams.get('q')}),
          }),
        ),
      ),
    )
    // type for a word in filter by input
    fireEvent.change(screen.getByLabelText(/filter by/i), {
      target: {value: REPO_NAME},
    })

    // click on search
    fireClickSearch()

    // variable
    const table = await screen.findByRole('table')

    // expect the table content
    expect(table).toBeInTheDocument()

    // within applies a query inside table node
    const withinTable = within(table)

    // get tableCells
    const tableCells = withinTable.getAllByRole('cell')

    // tableCells array
    const [repository] = tableCells

    // array elements
    expect(repository).toHaveTextContent(expectedRepo.name)
  })
})

describe('when there is an unprocessable entity from the backend', () => {
  // test to validate unprocessable errors
  it('must display an alert message error with the message from the service', async () => {
    // before the test, the error message should not be displayed
    expect(screen.queryByText(/validation failed/i)).not.toBeInTheDocument()

    // config server return error message
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(ctx.status(UNPROCESSABLE_STATUS), ctx.json(makeFakeError())),
      ),
    )

    // click search
    fireClickSearch()

    // expect error message (snackbar)
    expect(await screen.findByText(/validation failed/i)).toBeVisible()
  })
})

describe('when there is an unexpected error from the backend', () => {
  // test to validate unexpected errors
  it('must display an alert message error with the message from the service', async () => {
    // before the test, the error message should not be displayed
    expect(screen.queryByText(/unexpected error/i)).not.toBeInTheDocument()

    // config server return error message
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(
          ctx.status(UNEXPECTED_STATUS),
          ctx.json(makeFakeError({message: 'Unexpected Error'})),
        ),
      ),
    )

    // click search
    fireClickSearch()

    // expect error message (snackbar)
    expect(await screen.findByText(/unexpected error/i)).toBeVisible()
  })
})
