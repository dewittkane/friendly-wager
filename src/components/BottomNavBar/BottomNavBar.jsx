import React, { Component } from 'react';
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
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});
function BottomNavBar(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('recents');
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    props.dispatch({ type: 'LOGOUT' })
    setMobileMoreAnchorEl(null);
  }

  
  return (
    
    <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction label="Board" onClick={() => {props.history.push('/the-board')}} value="recents" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Friends" onClick={() => {props.history.push('/friends')}} value="favorites" icon={ <img src={process.env.PUBLIC_URL + '/Images/friends.svg'} />} />
      <BottomNavigationAction label="My Bets" value="nearby" icon={ <img src={process.env.PUBLIC_URL + '/Images/Ticket.svg'} />} />
      <BottomNavigationAction value="folder" onClick={handleMobileMenuOpen} icon={<AccountCircleIcon />} />
      <Menu
                id="menu-appbar"
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
              >
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
    </BottomNavigation>
  );
}
export default connect(mapStoreToProps)(withRouter(BottomNavBar));