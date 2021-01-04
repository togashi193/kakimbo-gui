import React, { useEffect, useCallback, useState } from 'react';
import Routes from './Routes';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import firebase from 'firebase/app';
import '@firebase/auth';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AuthContext from './context/AuthContext';

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
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const initUser = useCallback(async () => {
    firebase.auth().onAuthStateChanged(async user => {
      // ログイン検知
      if (user) {
        setCurrentUser(user);
      } else {
        // ログアウトした時
        setCurrentUser(undefined);
      }
      setLoading(false);
    });
  });

  useEffect(() => {
    initUser();
  }, []);

  const handleSignOutClick = useCallback(async () => {
    await firebase.auth().signOut();
    setCurrentUser(undefined);
    history.push('/login');
  });

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser
      }}
    >
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
      {
        !loading && (
          <Router history={history}>
            <Routes />
          </Router>
        )
      }
    </AuthContext.Provider>
  );
};

export default App;
