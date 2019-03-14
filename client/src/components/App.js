import React, { Component } from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import './App.scss';
import 'font-awesome/css/font-awesome.min.css';

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          true ?
            <Component {...props} /> :
            <Redirect to='/signin' />
        )} 
      />
    )
  }
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    const NoMatch = ({ location }) => (
      <div>
        <h3>No match for <code>{location.pathname}</code></h3>
      </div>
    )

    return (
      <BrowserRouter>        
        <div className="Height100">
          <Switch>
              {/* <Route exact={true} path='/signin' component={SignIn}/>
              <Route exact={true} path='/signup' component={SignUp}/>
              <ProtectedRoute exact={true} path='/profile' component={Profile} /> */}
              <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
