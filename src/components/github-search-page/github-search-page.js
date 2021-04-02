import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

export const GithubSearchPage = () => {
  // state
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)

  // event click handler
  const handleClick = async () => {
    // when button receives the event, an API request is sent (async) and the button is disabled
    setIsSearching(true)

    // once the promise is resolved, the button is enabled again
    await Promise.resolve()
    setIsSearchApplied(true)
    setIsSearching(false)
  }

  return (
    <Container>
      <Typography variant="h3" component="h1">
        Github repositories list
      </Typography>

      <Grid container spacing={2} justify="space-between">
        <Grid item md={6} xs={12}>
          <TextField fullWidth label="Filter by" id="filterby"></TextField>
        </Grid>

        <Grid item md={3} xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={isSearching}
            onClick={handleClick}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {isSearchApplied ? (
        <table></table>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={400}
        >
          <Typography>
            Please provide a search option and click in the search button
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default GithubSearchPage
