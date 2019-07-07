import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import './index.css';

const routes = (
  <Router>
    <div>
      <Route path='/' exact component={Main} />
      <Route path='/login' component={Login} />
      <Route path='/chat/:id' component={Chat} />
    </div>
  </Router>
);

ReactDOM.render(routes, document.getElementById('root'));
