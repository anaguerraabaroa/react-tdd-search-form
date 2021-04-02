import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Avatar from '@material-ui/core/Avatar'
import Link from '@material-ui/core/Link'

export const GithubSearchPage = () => {
  // state
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)

  // event click handler
  const handleClick = async () => {
    // when button receives the event, an API request is sent and the button is disabled
    setIsSearching(true)

    // once the promise is resolved, the button is enabled again and table is displayed
    await Promise.resolve()
    setIsSearchApplied(true)
    setIsSearching(false)
  }

  // render content: initial message or table
  const renderContent = () =>
    isSearchApplied ? (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Repository</TableCell>
              <TableCell>Stars</TableCell>
              <TableCell>Forks</TableCell>
              <TableCell>Open issues</TableCell>
              <TableCell>Updated at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Avatar alt="test" src="/logo192.png" />
                <Link href="http://localhost:3000/test">Test</Link>
              </TableCell>
              <TableCell>10</TableCell>
              <TableCell>5</TableCell>
              <TableCell>2</TableCell>
              <TableCell>2021-04-02</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
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
    )

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

      {renderContent()}
    </Container>
  )
}

export default GithubSearchPage
