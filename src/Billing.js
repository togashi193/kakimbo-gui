import React, { useCallback, useState } from 'react';
import { useMappedState } from 'redux-react-hook';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ApiClient from './ApiClient';

const styles = {
  card: {
    width: 512,
    height: 512
  }
};

const Billing = () => {

  const mapState = useCallback(
    state => ({
      currentUser: state.app.currentUser
    }),
    []
  );
  const { currentUser } = useMappedState(mapState);

  const [date, setDate] = useState("2019-05-01")
  const [game, setGame] = useState(1)
  const [amount, setAmount] = useState(5400)
  const [note, setNote] = useState("ensta")

  const handleButtonClick = async () => {
    const params = { amount: amount, note: note, date: date, game: game }
    const client = ApiClient.instance;
    const response = await client.createBilling(params);
    if (response.ok) {
      const json = await response.json();
    }
  }

  const handleDateChange = event => {
    setDate(event.target.value);
  };

  const handleGameChange = event => {
    setGame(event.target.value);
  };

  const handleAmountChange = event => {
    setAmount(event.target.value);
  };

  const handleNoteChange = event => {
    setNote(event.target.value);
  };

  return (
    <div className="App">

      <header>{currentUser.displayName}</header>

      <main>
        <div>
          課金簿
        </div>

        <Card style={styles.card}>
          <CardContent>
            <div>
              <TextField
                fullWidth
                label="課金日"
                type="date"
                defaultValue="2019-05-01"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDateChange}
              />
            </div>

            <div>
              <InputLabel
                shrink
                style={{
                  margin: 'auto',
                  width: '50%'
                }}
              >ゲーム名</InputLabel>
              <Select
                fullWidth
                value={game}
                onChange={handleGameChange}
                inputProps={{
                  name: 'age',
                  id: 'age-simple',
                }}
              >
                <MenuItem value={1}>Ten</MenuItem>
                <MenuItem value={2}>Twenty</MenuItem>
                <MenuItem value={3}>Thirty</MenuItem>
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
            <Button variant="contained" color="primary" onClick={handleButtonClick}>
              送信
            </Button>
          </CardContent>
        </Card>


      </main>

    </div >
  );
}

export default Billing;
