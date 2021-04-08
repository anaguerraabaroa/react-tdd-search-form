import {makeFakeResponse, getReposPerPage} from './repos'
import {OK_STATUS} from '../consts/index'

// handler paginated function to reuse it in different tests
export const handlerPaginated = (req, res, ctx) =>
  res(
    ctx.status(OK_STATUS),
    ctx.json({
      ...makeFakeResponse({totalCount: 1000}),
      items: getReposPerPage({
        perPage: parseInt(req.url.searchParams.get('per_page')),
        currentPage: req.url.searchParams.get('page'),
      }),
    }),
  )

export default {
  handlerPaginated,
}
