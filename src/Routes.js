import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Billing from './Billing';
import Billings from './Billings';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Billings} />
      <Route exact path="/billing" component={Billing} />
      <Route exact path="/login" component={Login} />
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Routes;
