import React, { useEffect, useCallback, useState } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Link } from 'react-router-dom';
import ApiClient from './ApiClient';
import closeBillingFormDialog from './actions/closeBillingFormDialog';

const BillingFormDialog = () => {
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      billingFormDialogOpen: state.app.billingFormDialogOpen
    }),
    []
  );

  const { billingFormDialogOpen } = useMappedState(mapState);

  const [date, setDate] = useState('2019-05-01');
  const [gameId, setGameId] = useState(1);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [games, setGames] = useState([]);

  const handleButtonClick = async () => {
    const params = { amount: amount, note: note, date: date, game: gameId };
    const client = ApiClient.instance;
    const response = await client.createBilling(params);
    if (response.ok) {
      const json = await response.json();
      dispatch(closeBillingFormDialog());
    }
  };

  const handleDateChange = event => {
    setDate(event.target.value);
  };

  const handleGameChange = event => {
    setGameId(event.target.value);
  };

  const handleAmountChange = event => {
    setAmount(event.target.value);
  };

  const handleNoteChange = event => {
    setNote(event.target.value);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = useCallback(async () => {
    const client = ApiClient.instance;
    const response = await client.fetchGames();
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setGames(json);
    }
  });

  const handleClose = event => {
    dispatch(closeBillingFormDialog());
  };

  return (
    <div>
      <Dialog
        open={billingFormDialogOpen}
        onClose={handleClose}
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">課金簿</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              fullWidth
              label="課金日"
              type="date"
              defaultValue="2019-05-01"
              InputLabelProps={{
                shrink: true
              }}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <InputLabel shrink>ゲーム名</InputLabel>
            <Select
              fullWidth
              value={gameId}
              onChange={handleGameChange}
              inputProps={{
                name: 'age',
                id: 'age-simple'
              }}
            >
              {games.map(game => (
                <MenuItem value={game.id}>{game.name}</MenuItem>
              ))}
            </Select>
          </div>

          <div>
            <TextField
              fullWidth
              label="課金額"
              margin="normal"
              onChange={handleAmountChange}
            />
          </div>

          <div>
            <TextField
              fullWidth
              label="備考"
              margin="normal"
              onChange={handleNoteChange}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            送信
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BillingFormDialog;
