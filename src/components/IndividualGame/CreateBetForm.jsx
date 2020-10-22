import React, { useState } from "react";
import { connect } from 'react-redux';
import { 
    Button, 
    TextField, 
    Typography, 
    Switch, 
    Grid, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogContentText, 
    DialogActions,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel } from '@material-ui/core';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
    createBetBtn: {
        width: '140px',
        marginLeft: '20%',
        marginRight: '20%',
        marginBottom: '2em',
    },
    formControlLabel: {
        color: 'white',
    },
    text: {
        margin: '1em',
        backgroundColor: '#151515',
    },
    radioColor: {
        color: 'white',
    },
    unitsInput: {
        backgroundColor: 'white',
        borderRadius: '.5em',
        marginTop: '1em',
        width: "120px",
    },

});

function CreateBetForm(props) {

    const classes = useStyles();
    const game = props.store.games.filter(game => game.id === Number(props.match.params.id))[0];
    const user = props.store.user;

    // state hook to handle opening dialog
    const [open, setOpen] = useState(false);

    // state hook to package up bet
    const [bet, setBet] = useState({
        proposers_id: user.id,
        wager: '',
        game_id: game.id,
        proposers_team_id: '',
        proposers_bet_is_over: '',
    });

    // opens the dialog to confirm bet
    const handleClickOpen = () => {
        setOpen(true);
    }

    // cancels the bet and closed dialog
    const cancelBet = () => {
        setOpen(false);
    }

    //handles the toggle switch
    const [modeSwitch, toggleSwitch] = useState({
        spread_mode: true,
    });
    const handleSwitchClick = (event) => {
        toggleSwitch({ spread_mode: event.target.checked });
        setBet({
            ...bet,
            proposers_team_id: '',
            proposers_bet_is_over: ''
        })
    }

    //handling input change for state hook
    const handleInputChange = (property, event) => {
        //if block fixes default to 0 and app crash
        if (event.target.value == '') {
            setBet({
                ...bet,
                wager: ''
            })
        }
        else {
            setBet({
                ...bet,
                [property]: Number(event.target.value)
            });
        }
    }

    //handles input change for 
    const handleOverUnderChange = (event) => {
        setBet({
            ...bet,
            proposers_bet_is_over: event.target.value
        })
    }

    //sending packaged bet to saga
    //then emptying radio button and input
    const handleCreateBet = () => {
        if (bet.wager === '' || (bet.proposers_team_id === '' && bet.proposers_bet_is_over === '')) {
            alert('Select a bet and enter how many units you\'d like to wager.');
            return;
        }

        props.dispatch({ type: 'POST_BET', payload: bet });

        setBet({
            ...bet,
            wager: '',
            proposers_team_id: '',
            proposers_bet_is_over: '',
        })

        setOpen(false);
    };

    return (
        <FormControl margin="normal" component="fieldset">
            <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item>O/U</Grid>
                <Grid item>
                    <Switch
                        checked={modeSwitch.spread_mode}
                        onChange={handleSwitchClick}
                    />
                </Grid>
                <Grid item>Spread</Grid>
                <Grid item xs={12}>
                    {modeSwitch.spread_mode ?
                        <>
                            <RadioGroup row aria-label="position" name="position" onChange={(event) => handleInputChange('proposers_team_id', event)}>
                                <FormControlLabel
                                    value={game.away_team_id}
                                    control={<Radio />}
                                    label={game.away_team + ' ' + game.away_team_spread}
                                    labelPlacement="bottom"
                                    checked={bet.proposers_team_id === game.away_team_id}
                                    className={classes.formControlLabel}
                                />
                                <FormControlLabel
                                    value={game.home_team_id}
                                    control={<Radio />}
                                    label={game.home_team + ' ' + game.home_team_spread}
                                    labelPlacement="bottom"
                                    checked={bet.proposers_team_id === game.home_team_id}
                                    className={classes.formControlLabel}
                                />
                            </RadioGroup>
                            <Dialog open={open} onClose={handleCreateBet} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                <DialogTitle id="alert-dialog-title">Confirm Bet</DialogTitle>
                                <DialogContent>
                                    {bet.proposers_team_id === game.home_team_id ?
                                        <DialogContentText>Bet will be placed on {game.home_team} {game.home_team_spread} for {bet.wager} units.</DialogContentText>
                                        :
                                        <DialogContentText>Bet will be placed on {game.away_team} {game.away_team_spread} for {bet.wager} units.</DialogContentText>
                                    }
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={cancelBet}>Cancel</Button>
                                    <Button onClick={handleCreateBet}>Confirm</Button>
                                </DialogActions>
                            </Dialog>
                        </>
                        :
                        <>
                            <RadioGroup row aria-label="position" name="position" onChange={(event) => handleOverUnderChange(event)}>
                                <FormControlLabel
                                    value={true}
                                    control={<Radio />}
                                    label={'Over ' + game.over_under}
                                    labelPlacement="bottom"
                                    checked={bet.proposers_bet_is_over === "true"}
                                    className={classes.formControlLabel}
                                />
                                <FormControlLabel
                                    value={false}
                                    control={<Radio />}
                                    label={'Under ' + game.over_under}
                                    labelPlacement="bottom"
                                    checked={bet.proposers_bet_is_over === "false"}
                                    className={classes.formControlLabel}
                                />
                            </RadioGroup>
                            <Dialog open={open} onClose={handleCreateBet} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                                <DialogTitle id="alert-dialog-title">Confirm Bet</DialogTitle>
                                <DialogContent>
                                    {bet.proposers_bet_is_over === "true" ?
                                        <DialogContentText>Bet will be placed on <b>OVER</b> {game.over_under} for {bet.wager} units.</DialogContentText>
                                        :
                                        <DialogContentText>Bet will be placed on <b>UNDER</b> {game.over_under} for {bet.wager} units.</DialogContentText>}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={cancelBet}>Cancel</Button>
                                    <Button onClick={handleCreateBet}>Confirm</Button>
                                </DialogActions>
                            </Dialog>
                        </>

                    }
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        color="secondary"
                        type="number"
                        value={bet.wager}
                        placeholder="wager"
                        variant="outlined"
                        onChange={(event) => handleInputChange('wager', event)}
                        className={classes.unitsInput}
                    />
                    <Typography color="textPrimary" className={classes.text}>Units</Typography>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.createBetBtn}
                    onClick={handleClickOpen}
                >
                    Create Bet
      </Button>
            </Grid>

        </FormControl>
    );
}

export default connect(mapStoreToProps)(withRouter(CreateBetForm));