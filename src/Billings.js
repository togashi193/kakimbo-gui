import React, { useEffect, useCallback, useState } from 'react';
import { useMappedState } from 'redux-react-hook';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ApiClient from './ApiClient';
import 'moment/locale/ja';
import moment from 'moment';

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

  const [date, setDate] = useState('2019-05-01');
  const [gameId, setGameId] = useState(1);
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [games, setGames] = useState([]);

  const [billings, setBillings] = useState([]);

  const handleButtonClick = async () => {
    const params = { amount: amount, note: note, date: date, game: gameId };
    const client = ApiClient.instance;
    const response = await client.createBilling(params);
    if (response.ok) {
      const json = await response.json();
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
    fetchBillings();
  }, []);

  const fetchGames = useCallback(async () => {
    const client = ApiClient.instance;
    const response = await client.fetchGames();
    if (response.ok) {
      const json = await response.json();
      setGames(json);
    }
  });

  const fetchBillings = useCallback(async () => {
    const client = ApiClient.instance;
    const response = await client.fetchBillings();
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setBillings(json);
    }
  });

  const formatDate = billing => {
    return moment(billing.date, 'YYYY-MM-DDThh:mm:ss.SSSZ').format('LL');
  };

  return (
    <div className="App">
      <header>{currentUser.displayName}</header>

      <main>
        <div>課金簿</div>

        <Card style={styles.card}>
          <CardContent>
            <List>
              {billings.map(billing => (
                <ListItem key={billing.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography>{billing.amount} 円</Typography>-{' '}
                        {billing.game_name}
                      </React.Fragment>
                    }
                    secondary={formatDate(billing)}
                  />

                  <ListItemSecondaryAction>
                    <IconButton aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Fab size="medium" color="secondary" aria-label="Add">
          <AddIcon />
        </Fab>
      </main>
    </div>
  );
};

export default Billing;
