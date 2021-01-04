import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Billings from './Billings';
import AuthContext from './context/AuthContext';

const Routes = () => {
  const { currentUser } = useContext(AuthContext);

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
