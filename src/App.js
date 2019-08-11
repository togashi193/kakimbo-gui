import React, { useEffect, useCallback } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import Routes from './Routes';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import firebase from 'firebase/app';
import '@firebase/auth';
import getUser from './actions/getUser';
import signOut from './actions/signOut';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
  right: {
    marginLeft: 'auto'
  },
  forLogin: {
    display: 'flex',
    alignItems: 'center'
  }
};

const history = createBrowserHistory();

const App = () => {
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      currentUser: state.app.currentUser,
      initializing: state.app.initializing
    }),
    []
  );
  const { currentUser, initializing } = useMappedState(mapState);

  const initUser = useCallback(async () => {
    firebase.auth().onAuthStateChanged(async user => {
      // ログイン検知
      if (user) {
        dispatch(getUser(user));
      } else {
        dispatch(signOut());
      }
    });
  });

  useEffect(() => {
    initUser();
  }, []);

  const handleSignOutClick = useCallback(async () => {
    await firebase.auth().signOut();
    dispatch(signOut());
    history.push('/login');
  });

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">課金簿</Typography>
          <div style={styles.right}>
            {currentUser && (
              <div style={styles.forLogin}>
                <div>ようこそ{currentUser.displayName}さん</div>
                <Button color="inherit" onClick={handleSignOutClick}>
                  ログアウト
                </Button>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {!initializing && (
        <Router history={history}>
          <Routes />
        </Router>
      )}
    </div>
  );
};

export default App;
