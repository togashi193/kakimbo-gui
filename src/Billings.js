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
import fetchBillings from './actions/fetchBillings';
import deleteBilling from './actions/deleteBilling';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
      billings: state.app.billings
    }),
    []
  );
  const { billings } = useMappedState(mapState);

  const [open, setOpen] = useState(false);

  const [currentBilling, setCurrentBilling] = useState(undefined);

  const refreshBillings = useCallback(async () => {
    const client = ApiClient.instance;
    const response = await client.fetchBillings();
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      dispatch(fetchBillings(json));
    }
  });

  useEffect(() => {
    refreshBillings();
  }, []);

  const formatDate = billing => {
    return moment(billing.date, 'YYYY-MM-DDThh:mm:ss.SSSZ').format('LL');
  };

  const handleClickOpen = () => {
    dispatch(openBillingFormDialog());
  };

  const handleClickDeleteDialogOpen = billing => {
    setOpen(true);
    setCurrentBilling(billing);
  };

  const handleCloseDeleteDialog = () => {
    setOpen(false);
  };

  const handleDeleteButtonClick = async () => {
    const client = ApiClient.instance;
    const response = await client.deleteBilling(currentBilling.id);
    if (response.ok) {
      setOpen(false);
      dispatch(deleteBilling(currentBilling.id));
    }
  };

  return (
    <div className="App">
      <main>
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
                    <IconButton
                      aria-label="Delete"
                      onClick={() => handleClickDeleteDialogOpen(billing)}
                    >
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

        <Dialog
          open={open}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'確認'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              この履歴を本当に削除しますか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              キャンセル
            </Button>
            <Button onClick={handleDeleteButtonClick} color="primary">
              削除
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default Billing;
