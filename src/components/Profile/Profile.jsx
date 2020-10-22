import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import LogoutButton from '../BottomNavBar/LogOutButton';
import { Typography, withStyles, Grid } from '@material-ui/core';


// Basic class component structure for React with default state
// value setup. When making a new component be sure to replace
// the component name FriendsList with the name for the new
// component.

const styles = theme => ({
    heading: {
        padding: '1em',
        textAlign: 'center',
        position: 'fixed',
        width: '100%',
        top: 0,
        backgroundColor: '#424242',
        height: '4.5em',
    },
    container: {
        maxHeight: '100vh'
    },
    info: {
        marginTop: '6.5em'
    },

    headingText: {
        marginTop: '.2em',
    },
    headingTextGroup: {
        paddingRight: '1em',
    },
});

class Profile extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.heading}>
                    <Typography variant="h4" className={classes.headingText} color="textPrimary">My Profile</Typography>
                </div>
                <Grid className={classes.info}>
                    <Grid item xs={12}>
                        <Typography color="textPrimary" variant="h5">Name: {this.props.store.user.first_name} {this.props.store.user.last_name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography color="textPrimary" variant="h5">Email: {this.props.store.user.username}</Typography>
                    </Grid>
                    
                </Grid>
                <center>
               <LogoutButton/>
               </center>


            </div>
        );
    }
}
const ProfileStyled = withStyles(styles)(Profile);
export default connect(mapStoreToProps)(ProfileStyled);