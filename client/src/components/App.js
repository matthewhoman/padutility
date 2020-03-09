import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ShowMonsterDetails from './puzzlesanddragons/ShowMonsterDetails';
import UnreleasedMonsters from './puzzlesanddragons/UnreleasedMonsters';
import MonsterBook from './puzzlesanddragons/MonsterBook';
//import Base from './common/Base';
import Profile from './profile/Profile';
import Contact from './contact/Contact';
import Projects from './projects/Projects';
import Itunes from './itunes/Itunes';
import Movies from './movies/Movies';
import Resume from './resume/Resume';
import News from './news/News';
import Game from './minesweeper/Game';

import './App.scss';
import 'font-awesome/css/font-awesome.min.css';

const App = () => {

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
              <Route exact={true} path='/game' component={Game}/>
              <Route exact={true} path='/news' component={News}/>
              <Route exact={true} path='/showMonsterDetails' component={ShowMonsterDetails}/>
              <Route exact={true} path='/unreleasedMonsters' component={UnreleasedMonsters}/>
              <Route exact={true} path='/monsterBook' component={MonsterBook}/>
              <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    );
};

export default App;