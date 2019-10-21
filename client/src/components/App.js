import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ShowMonsterDetails from './ShowMonsterDetails';
import UnreleasedMonsters from './UnreleasedMonsters';
import MonsterBook from './MonsterBook';
import Profile from './Profile';
import Contact from './Contact';
import Projects from './Projects';
import Itunes from './Itunes';
import Movies from './Movies';
import Resume from './Resume';

import './App.scss';
import 'font-awesome/css/font-awesome.min.css';

// class ProtectedRoute extends Component {
//   render() {
//     const { component: Component, ...props } = this.props

//     return (
//       <Route 
//         {...props} 
//         render={props => (
//           true ?
//             <Component {...props} /> :
//             <Redirect to='/signin' />
//         )} 
//       />
//     )
//   }
// }

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
              <Route exact={true} path='/' component={Profile}/>
              <Route exact={true} path='/profile' component={Profile}/>
              <Route exact={true} path='/resume' component={Resume}/>
              <Route exact={true} path='/contact' component={Contact}/>
              <Route exact={true} path='/projects' component={Projects}/>
              <Route exact={true} path='/itunes' component={Itunes}/>
              <Route exact={true} path='/movies' component={Movies}/>
              <Route exact={true} path='/showMonsterDetails' component={ShowMonsterDetails}/>
              <Route exact={true} path='/unreleasedMonsters' component={UnreleasedMonsters}/>
              <Route exact={true} path='/monsterBook' component={MonsterBook}/>
              <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
