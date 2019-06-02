import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'redux-react-hook';
import Routes from './Routes';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import firebase from 'firebase';
import getUser from './actions/getUser';

const history = createBrowserHistory();

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    initUser();
  }, []);

  const initUser = useCallback(async () => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        dispatch(getUser(user));
      }
    });
  });

  return (
    <Router history={history}>
      <Routes />
    </Router>
  );
};

export default App;
