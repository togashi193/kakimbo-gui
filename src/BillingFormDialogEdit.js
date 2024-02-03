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
//import firebase from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getApp } from 'firebase/app';
import '@firebase/auth';

const BillingFormDialogEdit = props => {
  const { open, onClose, onEdit, currentBilling } = props;
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [gameId, setGameId] = useState(1);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [games, setGames] = useState([]);

  const handleButtonClick = async () => {
    const params = { amount: amount, note: note, date: date, game: gameId };
    const client = ApiClient.instance;
    client.token = await getAuth(getApp()).currentUser.getIdToken();
    const response = await client.updateBilling(currentBilling.id, params);
    if (response.ok) {
      const json = await response.json();
      onEdit(json);
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
    client.token = await getAuth(getApp()).currentUser.getIdToken();
    const response = await client.fetchGames();
    if (response.ok) {
      const json = await response.json();
      setGames(json);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    if (currentBilling) {
      setGameId(currentBilling.game.id)
    }
  }, [currentBilling]);

  const handleClose = event => {
    onClose()
  };

  const formatDate = date => {
    return moment(date, 'YYYY-MM-DDThh:mm:ss.SSSZ').format('LL');
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
              //defaultValue={moment().format('YYYY-MM-DD')}
              defaultValue={currentBilling ? formatDate(currentBilling.date) : moment().format('YYYY-MM-DD')}
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
              defaultValue={currentBilling && currentBilling.amount}
            />
          </div>

          <div>
            <TextField
              fullWidth
              label="備考"
              margin="normal"
              onChange={handleNoteChange}
              defaultValue={currentBilling && currentBilling.note}
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

export default BillingFormDialogEdit;
