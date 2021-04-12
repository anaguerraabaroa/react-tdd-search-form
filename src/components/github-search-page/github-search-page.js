import React, {useState, useEffect, useCallback, useRef} from 'react'
import {withStyles} from '@material-ui/core/styles'
import GitHubIcon from '@material-ui/icons/GitHub'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import TablePagination from '@material-ui/core/TablePagination'
import Snackbar from '@material-ui/core/Snackbar'

import {Content} from '../content/index'
import {GithubTable} from '../github-table'
import {getRepos} from '../../services'

// initial values variables
const ROWS_PER_PAGE_DEFAULT = 30
const INITIAL_CURRENT_PAGE = 0
const INITIAL_TOTAL_COUNT = 0

// customize material UI styles
const StyledButton = withStyles(theme => ({
  root: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
  },
}))(Button)

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
  },
})(TextField)

export const GithubSearchPage = () => {
  // state
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_DEFAULT)
  const [currentPage, setCurrentPage] = useState(INITIAL_CURRENT_PAGE)
  const [totalCount, setTotalCount] = useState(INITIAL_TOTAL_COUNT)
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const didMount = useRef(false)
  const searchByInput = useRef(null)

  // event click handler
  const handleSearch = useCallback(async () => {
    try {
      // when button receives the event, an API request is sent and the button is disabled
      setIsSearching(true)

      // once the promise is resolved, the button is enabled again and table is displayed
      const response = await getRepos({
        q: searchByInput.current.value,
        rowsPerPage,
        currentPage,
      })

      // validate server errors
      if (!response.ok) {
        throw response
      }

      // success response
      const data = await response.json()

      setReposList(data.items)
      setTotalCount(data.total_count)
      setIsSearchApplied(true)
      setIsSearching(false)
    } catch (err) {
      // error response
      const data = await err.json()
      setIsOpen(true)
      setErrorMessage(data.message)
    } finally {
      // whatever the server response is success or error, it confirms that the search has finished
      setIsSearching(false)
    }
  }, [rowsPerPage, currentPage])

  // event handlers
  const handleChangeRowsPerPage = ({target: {value}}) => {
    setCurrentPage(INITIAL_CURRENT_PAGE)
    setRowsPerPage(value)
  }
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage)
  }

  const handleClickSearch = () => {
    if (currentPage === INITIAL_CURRENT_PAGE) {
      handleSearch()
      return
    }
    setCurrentPage(INITIAL_CURRENT_PAGE)
  }

  useEffect(() => {
    // stop search when component is mounted for the first time
    if (!didMount.current) {
      didMount.current = true
      return
    }
    // trigger search when search button is clicked
    handleSearch()
  }, [handleSearch])

  return (
    <Container>
      <Box
        my={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
      >
        <GitHubIcon fontSize="large" />
        <Typography variant="h3" component="h1" align="center">
          <Box m={4}>Github Repositories List </Box>
        </Typography>
        <GitHubIcon fontSize="large" />
      </Box>

      <Grid container spacing={2} justify="space-between">
        <Grid item md={6} xs={12}>
          <CssTextField
            inputRef={searchByInput}
            fullWidth
            label="Filter by"
            id="filterby"
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <StyledButton
            fullWidth
            disabled={isSearching}
            onClick={handleClickSearch}
            variant="contained"
          >
            Search
          </StyledButton>
        </Grid>
      </Grid>

      <Box my={4}>
        <Content isSearchApplied={isSearchApplied} reposList={reposList}>
          <>
            <GithubTable reposList={reposList} />
            <TablePagination
              rowsPerPageOptions={[30, 50, 100]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </>
        </Content>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={() => setIsOpen(false)}
        message={errorMessage}
      />
    </Container>
  )
}

export default GithubSearchPage
