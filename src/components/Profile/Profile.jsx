import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import LogoutButton from '../BottomNavBar/LogOutButton';
import { Typography, withStyles, Grid, Button, Avatar, TextField} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ThumbDownSharp } from '@material-ui/icons';
import axios from 'axios';




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
    avatarLogo : {
        width: '4em',
        height: '4em',
        position: 'relative',
         
    },
    container: {
        height: '50vh',
        position: 'fixed',
        justifyContent: 'center'
    },
    info: {
        marginTop: '6.5em',
        paddingLeft: '1em',
        paddingTop: '3em',
        display: 'flex',
        zIndex: '-1',
        width: '100%' 
    },

    headingText: {
        marginTop: '.2em',
    },
    button: {
        marginTop: '1em'
    },
    headingTextGroup: {
        paddingRight: '1em',
    },
});




class Profile extends Component {
  
  state = {
      open: false,
      image_url: '',
  }


  handleOpen = () => {
    this.setState({
        open: true
    });
  };

  handleClose = () => {
    //asynchronous, needs to be fixed
    this.props.dispatch({type: 'GET_IMAGE'});
    this.setState({
        open: false
    });
  };

  handleChange = (event) => {
    this.setState({
        image_url: event.target.value
    });
    console.log(this.state.image_url)
  };
  //verifys image validity 
 verifyImageURL(url, callBack) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
          callBack(true);
    };
    img.onerror = function () {
          callBack(false);
    };
  }

 
//function that handles image upload
//calls verifyImageURL to verify validity
handleImageUpload = () => {
    let image=this.state.image_url
    let id=this.props.store.user.id
this.verifyImageURL(image, function (imageExists) {
        if (imageExists === true) {
            console.log('hi');
            axios.put(`/api/user/imageupload`, {image_url: image, id: id})
        } else {
            alert("Image does not Exist");
        }
    })
    this.handleClose();
    
  };

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { classes } = this.props;

        return (
            <>
            <div className={classes.container}>
                <div className={classes.heading}>
                    <Typography variant="h4" className={classes.headingText} style={{color: 'white'}}>My Profile</Typography>
                   
                </div>
                <div className={classes.info}>
                <Grid container>
                    <Grid item xs={12}>
                        <center>
                    <Avatar className={classes.avatarLogo} src={this.props.store.user.image_url}></Avatar>
                    </center>
                    </Grid>
                    <Grid item xs={12}>
                        <center>
                    <Button variant="contained" onClick={this.handleOpen} className={classes.button} color="primary">Change Profile Picture</Button>
                    </center>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" style={{color: 'white'}}>{this.props.store.user.first_name} {this.props.store.user.last_name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography  variant="h5" style={{color: 'white'}}>{this.props.store.user.username}</Typography>
                    </Grid>
                    
                </Grid>
                </div>
              
              
                <center>
               <LogoutButton/>
               </center>


              </div>
              <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Change Profile Picture</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Enter Image URL
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  defaultValue=''
                  onChange={this.handleChange}
                  label="Image URL"
                  type="url"
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={this.handleImageUpload} color="primary">
                  Upload
                </Button>
              </DialogActions>
            </Dialog>
            </>
        );
    }
}
const ProfileStyled = withStyles(styles)(Profile);
export default connect(mapStoreToProps)(ProfileStyled);