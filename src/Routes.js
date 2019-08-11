import React, { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Billings from './Billings';

const Routes = () => {
  const mapState = useCallback(
    state => ({
      currentUser: state.app.currentUser
    }),
    []
  );
  const { currentUser } = useMappedState(mapState);

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (currentUser ? <Billings /> : <Redirect to="/login" />)}
      />
      <Route exact path="/login" component={Login} />
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Routes;
