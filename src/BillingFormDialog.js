import React, { useEffect, useCallback, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'moment/locale/ja';
import moment from 'moment';

import ApiClient from './ApiClient';
import firebase from 'firebase/app';
import '@firebase/auth';

const BillingFormDialog = props => {
  const { open, onClose, onCreate } = props;

  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [gameId, setGameId] = useState(1);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [games, setGames] = useState([]);

  const handleButtonClick = async () => {
    const params = { amount: amount, note: note, date: date, game: gameId };
    const client = ApiClient.instance;
    client.token = await firebase.auth().currentUser.getIdToken();
    const response = await client.createBilling(params);
    if (response.ok) {
      const json = await response.json();
      onCreate(json);
      onClose()
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

  const fetchGames = useCallback(async () => {
    const client = ApiClient.instance;
    client.token = await firebase.auth().currentUser.getIdToken();
    const response = await client.fetchGames();
    if (response.ok) {
      const json = await response.json();
      setGames(json);
    }
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const handleClose = event => {
    onClose()
  };

  return (
    <div>
      <Dialog
        open={open}
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
              defaultValue={moment().format('YYYY-MM-DD')}
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
                <MenuItem value={game.id} key={game.id}>
                  {game.name}
                </MenuItem>
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
