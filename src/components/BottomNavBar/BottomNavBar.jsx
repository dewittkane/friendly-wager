import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withRouter } from "react-router";

const useStyles = makeStyles({
  navBar: {
    backgroundColor: '#404040',
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});

function BottomNavBar(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.shadow}>
      <BottomNavigation position="fixed" value={value} onChange={handleChange} className={classes.navBar}>
        <BottomNavigationAction label="The Board" className={classes.navIcons} style={{ color: 'white' }} onClick={() => { props.history.push('/the-board') }} value="recents" icon={<DashboardIcon fontSize="large" />} />
        <BottomNavigationAction label="My Bets" style={{ color: 'white' }} onClick={() => { props.history.push('/mybets') }} value="nearby" icon={<img alt="ticket icon" src={process.env.PUBLIC_URL + '/Images/Ticket.svg'} />} />
        <BottomNavigationAction label="Friends" style={{ color: 'white' }} onClick={() => { props.history.push('/friends') }} value="favorites" icon={<img alt="friend icon" src={process.env.PUBLIC_URL + '/Images/friends.svg'} />} />
        <BottomNavigationAction label="My Profile" style={{ color: 'white' }} value="folder" onClick={() => { props.history.push(`/profile/${props.store.user.id}`) }} icon={<AccountCircleIcon fontSize="large" />} />
      </BottomNavigation>
    </div>
  );
}
export default connect(mapStoreToProps)(withRouter(BottomNavBar));