import React from 'react';
import { Route, Switch } from 'react-router';
import Home from './core/Home';

const MainRouter = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
    </Switch>
  );
};

export default MainRouter;
