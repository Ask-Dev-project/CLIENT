import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'
import './App.css';
import Home from './components/Home'
import Room from './components/Room'
import Chat from './components/Chat'
import {Forum, ChatRoom, ProfilePage} from './pages'

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

function App2() {
  return (
    <Switch>
      <Route exact path='/'>
        <div className="App">
          <p>home</p>
        </div>
      </Route>
      <Route path='/chat'>
        <ChatRoom />
      </Route>
      <Route path='/post/:id'>
        <Forum />
      </Route>
      <Route path='/profile'>
        <ProfilePage />
      </Route>
    </Switch>
    
  );

}

export default App;
