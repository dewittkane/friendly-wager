import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Open from './Open';
import History from './History';
import Active from './Active'

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
        <Box p={3}>
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
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    width: '33%',
  },
  games: {
    width: '100%',
  },
}));

function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  //filters open bet reducer to get appropriate length
  const openBetsLength = props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === props.store.user.id).length
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label={`Open (${openBetsLength})`} {...a11yProps(0)} className={classes.tabs}/>
          <Tab label={`Active (${props.store.betReducer.activeBetReducer.length})`} {...a11yProps(1)} className={classes.tabs}/>
          <Tab label={`History (${props.store.betReducer.completedBetReducer.length})`} {...a11yProps(2)} className={classes.tabs}/>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Open />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Active />
      </TabPanel>
      <TabPanel value={value} index={2}>
          <History />
      </TabPanel>
    </div>
  );
}

export default connect(mapStoreToProps)(SimpleTabs)