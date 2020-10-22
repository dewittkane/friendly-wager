import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withRouter } from "react-router";
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, deepPurple } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));



function FriendsListItem(props) {
  const classes = useStyles();
  // const [dense, setDense] = React.useState(false);
  // const [secondary, setSecondary] = React.useState(false);
 

  return (
    <div className={classes.root}>
    
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Friends List
          </Typography>
          <div className={classes.demo}>
              {props.store.friendsList.map((friend) =>
                <ListItem key={friend.id} onClick={() => {props.history.push(`/friends/statistics/${friend.id}`)}}>
                  <ListItemAvatar>
                    <Avatar
                    className={classes.orange}>{friend.first_name[0].toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${friend.first_name} ${friend.last_name}`}
                    secondary={friend.username}
                  />
                </ListItem>,
              )}
             
          </div>
        </Grid>
      
      </Grid>
    </div>
  );
}
export default connect(mapStoreToProps)(withRouter(FriendsListItem));