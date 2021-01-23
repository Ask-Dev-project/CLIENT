import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'
import Home from './components/Home'
import Room from './components/Room'
import Chat from './components/Chat'

function App() {
  return(
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route path="/chat">
        <Chat/>
      </Route>
      <Route path="/room/:id">
        <Room/>
      </Route>
    </Switch>
  </BrowserRouter>
  )
}

export default App;
