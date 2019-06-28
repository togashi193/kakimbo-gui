import React, { useEffect, useCallback, useState } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
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
import BillingFormDialog from './BillingFormDialog';
import openBillingFormDialog from './actions/openBillingFormDialog';

const styles = {
  card: {
    width: 512,
    height: 512
  }
};

const Billing = () => {
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      currentUser: state.app.currentUser
    }),
    []
  );
  const { currentUser } = useMappedState(mapState);

  const [billings, setBillings] = useState([]);

  const fetchBillings = useCallback(async () => {
    const client = ApiClient.instance;
    const response = await client.fetchBillings();
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setBillings(json);
    }
  });

  useEffect(() => {
    fetchBillings();
  }, []);

  const formatDate = billing => {
    return moment(billing.date, 'YYYY-MM-DDThh:mm:ss.SSSZ').format('LL');
  };

  const handleClickOpen = () => {
    dispatch(openBillingFormDialog());
  };

  return (
    <div className="App">
      <header>ようこそ{currentUser.displayName}さん</header>

      <main>
        <div>課金簿</div>

        <BillingFormDialog />

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
                        <Typography>
                          {billing.amount} 円 ({billing.note})
                        </Typography>
                        - {billing.game_name}
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

        <Fab
          size="medium"
          color="secondary"
          aria-label="Add"
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      </main>
    </div>
  );
};

export default Billing;
