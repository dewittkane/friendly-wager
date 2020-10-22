import React, { useState } from "react";
import { connect } from 'react-redux';
import { Button, TextField, Typography, Switch, Grid } from '@material-ui/core';
import mapStoreToProps from '../../redux/mapStoreToProps';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles({
    createBetBtn: {
        width: '60%',
        marginLeft: '20%',
        marginRight: '20%',
    },
    formControlLabel: {
        color: 'white',
    },
    text: {
        margin: '1em',
    },
});

function CreateBetForm(props) {

    const classes = useStyles();
    const game = props.store.games.filter(game => game.id === Number(props.match.params.id))[0];
    const user = props.store.user;

    // state hook to package up bet
    const [bet, setBet] = useState({
        proposers_id: user.id,
        wager: '',
        game_id: game.id,
        proposers_team_id: '',
        proposers_bet_is_over: '',
    });

    //handles the toggle switch
    const [ modeSwitch, toggleSwitch ] = useState({
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
            if (event.target.value == ''){
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
        console.log('NEW BET IS:', bet);
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
    };

    return (
        <FormControl component="fieldset">
            <Grid container spacing={1} justify="center" alignItems="center">
                <Grid item>O/U {game.over_under}</Grid>
                <Grid item>
                    <Switch
                        checked={modeSwitch.spread_mode}
                        onChange={handleSwitchClick}
                        color="default"
                    />
                </Grid>
                <Grid item>Spread {game.home_team_spread < 0 ? game.home_team_abbr + ' ' + game.home_team_spread : game.away_team_abbr + ' ' + game.away_team_spread}</Grid>
            </Grid>
            {modeSwitch.spread_mode ? 
                <RadioGroup row aria-label="position" name="position" onChange={(event) => handleInputChange('proposers_team_id', event)}>
                    <FormControlLabel
                        value={game.away_team_id}
                        control={<Radio color="primary" />}
                        label={game.away_team + ' ' + game.away_team_spread}
                        labelPlacement="top"
                        checked={bet.proposers_team_id === game.away_team_id}
                        className={classes.formControlLabel}
                    />
                    <FormControlLabel
                        value={game.home_team_id}
                        control={<Radio color="primary" />}
                        label={game.home_team + ' ' + game.home_team_spread}
                        labelPlacement="top"
                        checked={bet.proposers_team_id === game.home_team_id}
                        className={classes.formControlLabel}
                    />               
                </RadioGroup>
            :
                <RadioGroup row aria-label="position" name="position" onChange={(event) => handleOverUnderChange( event )}>
                    <FormControlLabel
                        value={true}
                        control={<Radio color="primary" />}
                        label={'Over ' + game.over_under}
                        labelPlacement="top"
                        checked={bet.proposers_bet_is_over === "true"}
                        className={classes.formControlLabel}
                    />
                    <FormControlLabel
                        value={false}
                        control={<Radio color="primary" />}
                        label={'Under ' + game.over_under}
                        labelPlacement="top"
                        checked={bet.proposers_bet_is_over === "false"}
                        className={classes.formControlLabel}
                    />
                </RadioGroup>
            }
            <TextField 
                type="number" 
                value={bet.wager} 
                placeholder="Enter your wager" 
                variant="outlined" 
                onChange={(event) => handleInputChange('wager', event)}
            />
            <Typography color="textPrimary" className={classes.text}>Units</Typography>

            <Button
                variant="contained"
                color="primary"
                className={classes.createBetBtn}
                onClick={handleCreateBet}
            >
                Create Bet
      </Button>
        </FormControl>
    );
}

export default connect(mapStoreToProps)(withRouter(CreateBetForm));