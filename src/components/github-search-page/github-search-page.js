import React from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

export const GithubSearchPage = () => (
  <>
    <Typography variant="h3" component="h1">
      Github repositories list
    </Typography>
    <TextField label="Filter by" id="filterby"></TextField>
  </>
)

export default GithubSearchPage
