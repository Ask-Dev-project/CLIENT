import logo from './logo.svg';
import './App.css';
import ChatRoom from './pages/ChatRoom'
import {
  Switch,
  Route
} from "react-router-dom";

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
        <div>
          <p>ini untuk postingan</p>
        </div>
      </Route>
    </Switch>
    
  );
}

export default App;
