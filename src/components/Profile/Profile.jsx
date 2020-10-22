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
import { put, takeLatest } from 'redux-saga/effects';
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
        backgroundColor: '#303030',
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
    },
    info: {
        marginTop: '6.5em',
        paddingLeft: '1em',
        paddingTop: '3em',
        
        
        width: '100%' 
    },
    profilePicture: {
       
        paddingBottom: '3em',
       
    },

    headingText: {
        marginTop: '.2em',
    },
    button: {
        marginTop: '1em'
    },
    cssLabel: {
        color: 'white'
      },
    logOutButton: {
        paddingTop: '10em'
    },
    headingTextGroup: {
        paddingRight: '1em',
    },
    multilineColor: {
        color: '#01FF70',
        borderColor: 'green !important'
        
      },
      borderColor: {
        color: 'white !important',
        borderColor: 'white !important',
      },
      notchedOutline: {
        borderWidth: '1px',
        borderColor: 'white !important'
      },
});



class Profile extends Component {
  
  state = {
      open: false,
      image_url: '',
      error: false
  }


  handleOpen = () => {
    this.setState({
        open: true
    });
  };

  handleClose = () => {
  let result = document.getElementById('urlfield').value;
  if (result != ''){
    this.setState({
        open: false,
        image_url: '',
        error: false
    });
}
else {
    this.setState({
        open: false,
        error: false
    });
}
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

 
// function that handles image upload
// calls verifyImageURL to verify validity
checkImageUpload = () => {
    let image=this.state.image_url
    let id=this.props.store.user.id;
    var self=this
this.verifyImageURL(image, async function (imageExists) {
        if (imageExists === true) {
            console.log('hi');
            await axios.put(`/api/user/imageupload`, {image_url: image, id: id})
            .then((result) => {
            self.props.dispatch({type: 'GET_IMAGE'});
            self.setState({
                open: false,
                image_url: '',
                error: false
            });
            })
        } else {
            self.setState({
                error: true,
                image_url: 'true'
            })
            document.getElementById('urlfield').value = '';
        }
    })
  };

  handleUpload = () => {
    this.props.dispatch({type: 'GET_IMAGE'})
    this.handleClose();
    
  }

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
                <Grid container align = "center" justify = "center" alignItems = "center" >
                    <div className={classes.profilePicture}>
                    <Grid item xs={12}> 
                    <Avatar className={classes.avatarLogo} src={this.props.store.user.image_url}></Avatar>
                    </Grid>
                    <Grid item xs={12}>
                    <Button variant="contained" onClick={this.handleOpen} className={classes.button} color="primary">Change Profile Picture</Button>
                    </Grid>
                    </div>
                    <Grid item xs={12}>
                        <Typography variant="h5" style={{color: 'white'}}>Name: {this.props.store.user.first_name} {this.props.store.user.last_name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography  variant="h5" style={{color: 'white'}}>Email: {this.props.store.user.username}</Typography>
                    </Grid>
                    
                </Grid>
                </div>
              
              
               <center>
                <div className={classes.logOutButton}>
               <LogoutButton/>
               </div>
               </center>


              </div>
              <Dialog  
              fullWidth={true}
              
              maxWidth={true} 
              open={this.state.open} 
              onClose={this.handleClose} 
              aria-labelledby="form-dialog-title">
              
              <DialogContent style={{backgroundColor: '#303030'}}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="urlfield"
                  defaultValue=''
                  onChange={this.handleChange}
                  label="Image URL"
                  type="url"
                  helperText={this.state.error ? "Image URL is not valid" : ""}
                  error={this.state.error}
                  fullWidth
                  InputProps={{
                    classes: {
                      root: classes.notchedOutline,
                      focused: classes.multilineColor,
                      
                    },
                }}
                InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.borderColor,
                    }
                  }}
                />
              </DialogContent>
              <DialogActions style={{backgroundColor: '#303030'}}>
                <Button style={{color: 'white'}} onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button style={{color: 'white'}} onClick={this.checkImageUpload} color="primary">
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