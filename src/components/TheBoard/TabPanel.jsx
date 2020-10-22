import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import OpenBets from './OpenBets';
import Games from './Games';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{padding: "0"}} p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  mainTab: {
    position: 'fixed',
    width: '100%',
    backgroundColor: '#303030',
    marginTop: '0',
    boxShadow: '0px -4px 0px #151515',
  },
  tabs: {
    width: '50%',
  },
  tabPanel: {
    marginTop: '2.5em',
  },
  games: {
    width: '100%',
  },
}));

function SimpleTabs(props) {

  useEffect(() => {
    //this checks to see if page is loading from 3.2 back button
    if (props.store.goBackReducer) {
      setValue(1)
    };
    //unmounting reducer back to false to show open bets next time clicked
    return () => {
      props.dispatch({ type: 'SET_BACK_STATUS', payload: false });
    };
  }, []);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" className={classes.mainTab}>
          <Tab label="Open Bets" {...a11yProps(0)} className={classes.tabs} />
          <Tab label="Games" {...a11yProps(1)} className={classes.tabs} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className={classes.tabPanel}>
        <OpenBets />
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.tabPanel}>
        <Games />
      </TabPanel>
    </div>
  );
}

export default connect(mapStoreToProps)(SimpleTabs);