import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from './Login'
import Billing from './Billing'

const Routes = () => {

  return (
    <Switch>
      <Route exact path="/" component={Billing} />
      <Route exact path="/login" component={Login} />
      <Redirect from="*" to="/" />
    </Switch>
  );

}

export default Routes;
