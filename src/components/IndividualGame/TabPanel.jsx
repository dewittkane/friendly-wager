import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';

import OpenBets from './OpenBets';
import MyBets from './MyBets';

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
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    width: '50%',
  },
  MyBets: {
    width: '100%',
  },
  mainTab: {
    position: 'fixed',
    width: '100%',
    backgroundColor: '#3f51b5',
    marginTop: '0',
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    //we could use this to set state - might fix the delay?
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" className={classes.mainTab}>
          <Tab label="Open Bets" {...a11yProps(0)} className={classes.tabs}/>
          <Tab label="My Bets" {...a11yProps(1)} className={classes.tabs}/>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <OpenBets />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MyBets />
      </TabPanel>
    </div>
  );
}
