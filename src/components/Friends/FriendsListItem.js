import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemAvatar, ListItemText, Grid, Typography, Avatar, Container, TableContainer, Table, TableBody, TableRow } from '@material-ui/core';
import { withRouter } from "react-router";
import { deepOrange, deepPurple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
    marginBottom: '3.5em',
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  orange: {
    color: 'white',
    backgroundColor: '#606060',
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  conditionalText: {
    marginTop: '1.5em',
    paddingLeft: '24px',
    paddingRight: '24px',
    color: 'white',
  },
  tableContainer: {
    marginTop: '7em',
  },
  mainContainer: {
    marginTop: '13.5em',
  },
}));

function FriendsListItem(props) {
  const classes = useStyles();
  // const [dense, setDense] = React.useState(false);
  // const [secondary, setSecondary] = React.useState(false);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.root}>
        {props.store.friendsList[0]
          ?
          <Grid container spacing={0} className={classes.grids}>
            <Grid item xs={12} md={6}>
              <div>
                {props.store.friendsList.map((friend) =>
                  <ListItem key={friend.id} onClick={() => { props.history.push(`/friends/statistics/${friend.id}`) }}>
                    <ListItemAvatar>
                      <Avatar
                        className={classes.orange}>{friend.first_name[0].toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography style={{color: 'white'}}>{friend.first_name} {friend.last_name}</Typography>}
                      secondary={<Typography style={{color: 'white'}}>{friend.username}</Typography>}
                    />
                  </ListItem>,
                )}
              </div>
            </Grid>
          </Grid>
          :
          <Typography className={classes.conditionalText}>There are no friend results.</Typography>
        }
      </div>
    </div>
  );
}
export default connect(mapStoreToProps)(withRouter(FriendsListItem));