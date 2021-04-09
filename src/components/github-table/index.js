import React from 'react'
import PropTypes from 'prop-types'
import {withStyles, makeStyles} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Avatar from '@material-ui/core/Avatar'
import Link from '@material-ui/core/Link'
import Box from '@material-ui/core/Box'

// tableHeaders array
const tableHeaders = [
  'Repository',
  'Stars',
  'Forks',
  'Open issues',
  'Updated at',
]

// customize material UI styles
const useStyles = makeStyles({
  container: {
    maxHeight: 440,
  },
})

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textTransform: 'uppercase',
    fontWeight: 700,
    textAlign: 'center',
  },
  body: {
    color: theme.palette.common.black,
    textAlign: 'center',
  },
}))(TableCell)

export const GithubTable = ({reposList}) => {
  const classes = useStyles()
  return (
    <TableContainer className={classes.container}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {tableHeaders.map(header => (
              <StyledTableCell key={header}>{header}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {reposList.map(
            ({
              name,
              id,
              stargazers_count: stargazersCount,
              forks_count: forksCount,
              open_issues_count: openIssuesCount,
              updated_at: updatedAt,
              html_url: htmlUrl,
              owner: {avatar_url: avatarUrl},
            }) => (
              <TableRow key={id}>
                <StyledTableCell>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                  >
                    <Avatar alt={name} src={avatarUrl} />
                    <Link href={htmlUrl}>{name}</Link>
                  </Box>
                </StyledTableCell>

                <StyledTableCell>{stargazersCount}</StyledTableCell>
                <StyledTableCell>{forksCount}</StyledTableCell>
                <StyledTableCell>{openIssuesCount}</StyledTableCell>
                <StyledTableCell>{updatedAt}</StyledTableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default GithubTable

GithubTable.propTypes = {
  reposList: PropTypes.arrayOf(PropTypes.object).isRequired,
}
