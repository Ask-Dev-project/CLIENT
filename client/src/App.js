// import logo from './logo.svg';
import './App.css';
import {
  Switch,
  Route
} from "react-router-dom";
import {Forum, ChatRoom, ProfilePage} from './pages'

function App() {
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
