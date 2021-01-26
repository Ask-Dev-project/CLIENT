import React from 'react'
import {
  Switch,
  Route
} from 'react-router-dom'
import './App.css';
import Room from './components/Room'
import { Home } from './pages'

function App() {
  return(
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/room/:id">
        <Room/>
      </Route>
    </Switch>
  )
}

export default App;
