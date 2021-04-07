import repos30Paginated from './repos-30-paginated.json'
import repos50Paginated from './repos-50-paginated.json'

// create fake response
export const makeFakeResponse = ({totalCount = 0} = {}) => ({
  total_count: totalCount,
  items: [],
})

// create fake repo
export const makeFakeRepo = ({
  name = 'django-rest-framework-reactive',
  id = '56757919',
} = {}) => ({
  id,
  name,
  owner: {
    avatar_url: 'https://avatars0.githubusercontent.com/u/2120224?v=4',
  },
  html_url: 'https://github.com/genialis/django-rest-framework-reactive',
  updated_at: '2020-10-24',
  stargazers_count: 58,
  forks_count: 9,
  open_issues_count: 0,
})

// array of fake repos
const reposData = ['go', 'freeCodeCamp', 'laravel', 'Phyton', 'Java']

// list of repos that return a fake repo per each element of the array
const reposList = reposData.map(name => makeFakeRepo({name, id: name}))

// filter by repo name
export const getReposListBy = ({name}) =>
  reposList.filter(repo => repo.name === name)

// filter elements per page
export const getReposPerPage = ({currentPage, perPage}) => {
  return perPage === 30
    ? repos30Paginated[currentPage]
    : repos50Paginated[currentPage]
}

export default {
  makeFakeResponse,
  makeFakeRepo,
  getReposListBy,
  getReposPerPage,
}
