
import React, { useEffect, useState } from 'react';
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
import Badge from '@material-ui/core/Badge';


const useStyles = makeStyles({
  navBar: {
    backgroundColor: '#303030',
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
});

function BottomNavBar(props) {

  const classes = useStyles();

  const [value, setValue] = React.useState('recents');
  const [iconColor, setIconColor] = React.useState({
    boardColor: 'white',
    myBetsColor: 'white',
    friendsColor: 'white',
    profileColor: 'white'
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIconColor({
      boardColor: 'white',
      myBetsColor: 'white',
      friendsColor: 'white',
      profileColor: 'white',
      [newValue]: '#01FF70'
    })
    console.log(newValue)
  };

  useEffect(() => {
    setIconColor({
      ...iconColor,
      boardColor: '#01FF70'
    })
    setValue('boardColor');
  }, []);

  return (
    <div className={classes.shadow}>
      <BottomNavigation position="fixed" value={value} onChange={handleChange} className={classes.navBar}>
        <BottomNavigationAction label="The Board" style={{ color: iconColor.boardColor }} onClick={() => { props.history.push('/the-board') }} value={'boardColor'} icon={<DashboardIcon fontSize="large" style={{ fill: iconColor.boardColor }} />} />
        <BottomNavigationAction label="My Bets" style={{ color: iconColor.myBetsColor }} onClick={() => { props.history.push('/mybets') }} value={'myBetsColor'} icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="26" viewBox="0 0 34.822 23.215"><path id="Icon_awesome-ticket-alt" data-name="Icon awesome-ticket-alt" d="M7.738,10.3H27.084V21.911H7.738Zm24.182,5.8a2.9,2.9,0,0,0,2.9,2.9v5.8a2.9,2.9,0,0,1-2.9,2.9H2.9a2.9,2.9,0,0,1-2.9-2.9v-5.8a2.9,2.9,0,0,0,2.9-2.9,2.9,2.9,0,0,0-2.9-2.9V7.4A2.9,2.9,0,0,1,2.9,4.5H31.92a2.9,2.9,0,0,1,2.9,2.9v5.8A2.9,2.9,0,0,0,31.92,16.107Zm-2.9-6.287a1.451,1.451,0,0,0-1.451-1.451H7.255A1.451,1.451,0,0,0,5.8,9.82V22.395a1.451,1.451,0,0,0,1.451,1.451H27.568a1.451,1.451,0,0,0,1.451-1.451Z" transform="translate(0 -4.5)" fill={iconColor.myBetsColor} /></svg>} />} />
        <BottomNavigationAction label="Friends" style={{ color: iconColor.friendsColor }} onClick={() => { props.history.push('/friends') }} value={'friendsColor'} icon={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="26" viewBox="0 0 35.473 24.831"><path id="Icon_awesome-user-friends" data-name="Icon awesome-user-friends" d="M10.642,14.666A6.208,6.208,0,1,0,4.434,8.458,6.2,6.2,0,0,0,10.642,14.666ZM14.9,16.439h-.46a8.571,8.571,0,0,1-7.593,0h-.46A6.387,6.387,0,0,0,0,22.824v1.6a2.661,2.661,0,0,0,2.66,2.66H18.623a2.661,2.661,0,0,0,2.66-2.66v-1.6A6.387,6.387,0,0,0,14.9,16.439ZM26.6,14.666a5.321,5.321,0,1,0-5.321-5.321A5.322,5.322,0,0,0,26.6,14.666Zm2.66,1.774h-.211a6.989,6.989,0,0,1-4.9,0h-.211a6.156,6.156,0,0,0-3.087.854,8.111,8.111,0,0,1,2.2,5.532v2.128c0,.122-.028.238-.033.355h9.788a2.661,2.661,0,0,0,2.66-2.66,6.2,6.2,0,0,0-6.208-6.208Z" transform="translate(0 -2.25)" fill={iconColor.friendsColor} /></svg>} />} />
        <BottomNavigationAction label="My Profile" style={{ color: iconColor.profileColor }} value={'profileColor'} onClick={() => { props.history.push(`/profile/${props.store.user.id}`) }} icon={<AccountCircleIcon style={{ fill: iconColor.profileColor }} fontSize="large" />} />
      </BottomNavigation>
    </div>
  );
};
export default connect(mapStoreToProps)(withRouter(BottomNavBar));
