import React, {useState, useEffect, useCallback, useRef} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import {Content} from '../content/index'
import {getRepos} from '../../services/index.js'

export const GithubSearchPage = () => {
  // state
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [searchBy, setSearchBy] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(30)
  const didMount = useRef(false)

  // event click handler
  const handleSearch = useCallback(async () => {
    // when button receives the event, an API request is sent and the button is disabled
    setIsSearching(true)

    // once the promise is resolved, the button is enabled again and table is displayed
    const response = await getRepos({q: searchBy, rowsPerPage})

    const data = await response.json()

    setReposList(data.items)
    setIsSearchApplied(true)
    setIsSearching(false)
  }, [rowsPerPage, searchBy])

  const handleChange = ({target: {value}}) => setSearchBy(value)

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
      <Box my={4}>
        <Typography variant="h3" component="h1">
          Github repositories list
        </Typography>
      </Box>

      <Grid container spacing={2} justify="space-between">
        <Grid item md={6} xs={12}>
          <TextField
            value={searchBy}
            fullWidth
            label="Filter by"
            id="filterby"
            onChange={handleChange}
          ></TextField>
        </Grid>

        <Grid item md={3} xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={isSearching}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <Box my={4}>
        <Content
          isSearchApplied={isSearchApplied}
          reposList={reposList}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Box>
    </Container>
  )
}

export default GithubSearchPage
