import React, { useEffect, useCallback, useState } from 'react';
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
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ApiClient from './ApiClient';
import 'moment/locale/ja';
import moment from 'moment';
import BillingFormDialogNew from './BillingFormDialogNew';
import BillingFormDialogEdit from './BillingFormDialogEdit';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from 'firebase/app';
import '@firebase/auth';

const styles = {
  card: {
    width: 512
  },
  add: {
    position: 'fixed',
    right: '32px',
    bottom: '32px'
  }
};

const Billing = () => {
  const [open, setOpen] = useState(false);
  const [currentBilling, setCurrentBilling] = useState(undefined);
  const [total, setTotal] = useState(999999);
  const [billings, setBillings] = useState([]);
  const [openBillingFormDialogNew, setOpenBillingFormDialogNew] = useState(false);
  const [openBillingFormDialogEdit, setOpenBillingFormDialogEdit] = useState(false);

  const refreshBillings = useCallback(async () => {
    const client = ApiClient.instance;
    client.token = await firebase.auth().currentUser.getIdToken();
    const response = await client.fetchBillings();
    if (response.ok) {
      const json = await response.json();
      setBillings(json);
    }
  }, []);

  const calcTotal = useCallback(async () => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    setTotal(billings.map(billing => billing.amount).reduce(reducer))
  }, [billings]);

  useEffect(() => {
    refreshBillings();
  }, []);

  // フック
  useEffect(() => {
    // 呼び出す関数
    if (0 < billings.length) {
      calcTotal();
    }
  }, [billings]);

  const formatDate = billing => {
    return moment(billing.date, 'YYYY-MM-DDThh:mm:ss.SSSZ').format('LL');
  };

  const handleCreateOpen = () => {
    setOpenBillingFormDialogNew(true)
  };

  const handleEditOpen = billing => {
    setCurrentBilling(billing);
    setOpenBillingFormDialogEdit(true)
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
    client.token = await firebase.auth().currentUser.getIdToken();
    const response = await client.deleteBilling(currentBilling.id);
    if (response.ok) {
      setOpen(false);

      const rejected = billings.filter(
        billing => billing.id !== currentBilling.id
      );
      setBillings(rejected);
    }
  };

  const handleBillingFormDialogNewClose = useCallback(() => {
    setOpenBillingFormDialogNew(false)
  }, [])

  const handleBillingFormDialogEditClose = useCallback(() => {
    setOpenBillingFormDialogEdit(false)
  }, [])

  const handleCreate = useCallback((billing) => {
    // ...配列の変数 で要素を展開する
    // billings.push(billing)を非破壊的にやっている
    setBillings([...billings, billing])
  }, [billings])

  const handleEdit = useCallback((billing) => {
    refreshBillings();
  }, [billings])

  return (
    <div className="App">
      <main>
        <BillingFormDialogNew
          open={openBillingFormDialogNew}
          onClose={handleBillingFormDialogNewClose}
          // 子に渡すプロパティ名がonCreate
          // 値がhandleCreate (key-value)
          onCreate={handleCreate}
        />

        <BillingFormDialogEdit
          open={openBillingFormDialogEdit}
          onClose={handleBillingFormDialogEditClose}
          onEdit={handleEdit}
          currentBilling={currentBilling}
        />

        <Card style={styles.card}>
          <CardContent>
            {billings.length < 1 ? (
              <div>なにもないよ！</div>
            ) : (
                <div>
                  <div>合計額: {total} 円</div>

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
                              - {billing.game.name}
                            </React.Fragment>
                          }
                          secondary={formatDate(billing)}
                        />

                        <ListItemSecondaryAction>
                          <IconButton
                            aria-label="Edit"
                            onClick={() => handleEditOpen(billing)}
                            onClose={() => setCurrentBilling(undefined)}
                          >
                            <EditIcon />
                          </IconButton>

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
                </div>
              )}
          </CardContent>
        </Card>

        <Fab
          size="medium"
          color="secondary"
          aria-label="Add"
          onClick={handleCreateOpen}
          onClose={() => setCurrentBilling(undefined)}
          style={styles.add}
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
