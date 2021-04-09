import React from 'react'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {GithubSearchPage} from './github-search-page'
import {makeFakeResponse, makeFakeRepo} from '../../__fixtures__/repos'
import {handlerPaginated} from '../../__fixtures__/handlers'
import {OK_STATUS} from '../../consts/index'

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

describe('when the developer does a search and selects 50 rows per page', () => {
  // test to validate rows per page
  it('must fetch a new search and display 50 rows results on the table', async () => {
    // config mock server response
    server.use(rest.get('/search/repositories', handlerPaginated))

    // click search
    fireClickSearch()

    // wait for table to exist and expect 31 rows per page (30 + table headings)
    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(await screen.findAllByRole('row')).toHaveLength(31)

    // display select options (30,50,100) after click on arrow
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))

    // select 50 rows per page
    fireEvent.click(screen.getByRole('option', {name: '50'}))

    // wait for the button to not be disabled to render the table
    // default timeout is 1000 but it is not enough time to complete the test
    await waitFor(
      () =>
        expect(
          screen.getByRole('button', {name: /search/i}),
        ).not.toBeDisabled(),
      {timeout: 3000},
    )

    // expect 51 rows per page (50 + table headings)
    // default timeout is not enough time to complete the test
    expect(screen.getAllByRole('row')).toHaveLength(51)
  }, 6000)
})

describe('when the developer clicks on search and then on next page button and clicks on search again', () => {
  // test to validate pagination
  it('must display the next repositories page', async () => {
    // config server handler
    server.use(rest.get('/search/repositories', handlerPaginated))

    // click search
    fireClickSearch()

    // wait table
    expect(await screen.findByRole('table')).toBeInTheDocument()

    // expect first repo name is from page 0
    expect(screen.getByRole('cell', {name: /1-0/i})).toBeInTheDocument()

    // expect next page is not disabled
    expect(screen.getByRole('button', {name: /next page/i})).not.toBeDisabled()

    // click next page button
    fireEvent.click(screen.getByRole('button', {name: /next page/i}))

    // wait search button is not disabled
    expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()

    await waitFor(
      () =>
        expect(
          screen.getByRole('button', {name: /search/i}),
        ).not.toBeDisabled(),
      {timeout: 3000},
    )

    // expect first repo name is from page 1
    expect(screen.getByRole('cell', {name: /2-0/i})).toBeInTheDocument()

    // click on previous page
    fireEvent.click(screen.getByRole('button', {name: /previous page/i}))

    // wait search finish
    await waitFor(
      () =>
        expect(
          screen.getByRole('button', {name: /search/i}),
        ).not.toBeDisabled(),
      {timeout: 3000},
    )

    // expect
    expect(screen.getByRole('cell', {name: /1-0/i})).toBeInTheDocument()
  }, 30000)
})
