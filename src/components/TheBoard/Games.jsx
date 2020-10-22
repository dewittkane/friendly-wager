import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  tableContainer: {
    marginTop: '2.9em',
    backgroundColor: '#151515',
  },
  conditionalText: {
    padding: '24px',
    paddingTop: '32px',
    backgroundColor: '#151515',
    textAlign: 'center'
  },
});

function SimpleTable(props) {

  const classes = useStyles();
  
  return (
    <>
      {props.store.games[0]
        ?
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{color: 'white'}} align="left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Game</TableCell>
                <TableCell style={{color: 'white'}} align="left">Time</TableCell>
                <TableCell style={{color: 'white'}} align="right">Spread</TableCell>
                <TableCell style={{color: 'white'}} align="right">O/U</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {props.store.games.map((game, i) => {
                return (
                  <TableRow key={game.id} onClick={() => props.history.push(`/game-details/${game.id}`)}>
                    <TableCell style={{color: 'white'}} align="left">
                      <Grid container alignItems="center" >
                        <Grid item style={{verticalAlign: "middle"}} xs={12}>
                          <img style={{verticalAlign: "middle"}} src={game.away_team_logo} alt={game.away_team} width="20" height="20" />  {game.away_team} 
                        </Grid>
                        <Grid item style={{verticalAlign: "middle"}} xs={12}>
                          <img style={{verticalAlign: "middle"}} src={game.home_team_logo} alt={game.home_team} width="20" height="20" />  {game.home_team}
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell style={{color: 'white'}} align="left">{moment(game.date).format("ddd MMM D h:mm a")}</TableCell>
                    {(game.home_team_spread < 0) ?
                      <TableCell style={{color: 'white'}} align="right">{game.home_team} <br/> {game.home_team_spread}</TableCell>
                      :
                      <TableCell style={{color: 'white'}} align="right">{game.away_team} <br/> {game.away_team_spread}</TableCell>
                    }
                    <TableCell style={{color: 'white'}} align="right">{game.over_under}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <Typography color="textPrimary" className={classes.conditionalText}>There aren't any games to display.</Typography>
      }
    </>
  );
}


export default connect(mapStoreToProps)(withRouter(SimpleTable));