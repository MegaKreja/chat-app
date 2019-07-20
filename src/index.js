import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Main from './components/Main/Main';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import './index.css';

const routes = (
  <Router>
    <div>
      <Switch>
        <Route path='/' exact component={Main} />
        <Route path='/login' component={Login} />
        <Route path='/chat/:id' component={Chat} />
        <Route render={() => <Redirect to='/login' />} />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
