import React, { useState } from "react";
import { connect } from 'react-redux';
import { Button, TextField, Typography } from '@material-ui/core';
import mapStoreToProps from '../../redux/mapStoreToProps';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from '@material-ui/core/styles';

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
    const gameDetails = props.store.gameDetails;
    const user = props.store.user;

    // state hook to package up bet
    const [bet, setBet] = useState({
        proposers_id: user.id,
        wager: '',
        game_id: gameDetails.id,
        proposers_team_id: '',
    });

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

    //sending packaged bet to saga
    //then emptying radio button and input
    const handleCreateBet = () => {
        console.log('NEW BET IS:', bet);
        if (bet.wager === '' || bet.proposers_team_id === '') {
            alert('Select a team and enter how many units you\'d like to wager.');
            return;
        }

        props.dispatch({ type: 'POST_BET', payload: bet });
        
        setBet({
            ...bet,
            wager: '',
            proposers_team_id: '',
        })
    };

    //test

    return (
        <FormControl component="fieldset">
            <RadioGroup row aria-label="position" name="position" onChange={(event) => handleInputChange('proposers_team_id', event)}>
                <FormControlLabel
                    value={gameDetails.away_team_id}
                    control={<Radio color="primary" />}
                    label={gameDetails.away_team + ' ' + gameDetails.away_team_spread}
                    labelPlacement="top"
                    checked={bet.proposers_team_id === gameDetails.away_team_id}
                    className={classes.formControlLabel}
                />
                <FormControlLabel
                    value={gameDetails.home_team_id}
                    control={<Radio color="primary" />}
                    label={gameDetails.home_team + ' ' + gameDetails.home_team_spread}
                    labelPlacement="top"
                    checked={bet.proposers_team_id === gameDetails.home_team_id}
                    className={classes.formControlLabel}
                />
            </RadioGroup>
            <TextField type="number" value={bet.wager} placeholder="Enter number of units" variant="outlined" onChange={(event) => handleInputChange('wager', event)}/>
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

export default connect(mapStoreToProps)(CreateBetForm);