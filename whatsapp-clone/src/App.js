import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Landing from './components/layout/Landing';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuth';
import Login from './components/auth/Login';
import UserSetting from './components/layout/UserSetting';
import RoomSetting from './components/layout/RoomSetting';
import CreateRoom from './components/layout/CreateRoom';
// import Pusher from 'pusher-js';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  // const [messages, setmessages] = useState([]);

  // useEffect(() => {
  //   const pusher = new Pusher('59140e79370d6491a60f', {
  //     cluster: 'ap2',
  //   });

  //   const channel = pusher.subscribe('messages');
  //   channel.bind('updated', function (newMessage) {
  //     alert(JSON.stringify(newMessage));
  //     setmessages(...messages, newMessage);
  //   });
  // }, [messages]);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/:uid/setting' component={UserSetting} />
          <Route exact path='/:gid/room_setting' component={RoomSetting} />
          <Route exact path='/create_room' component={CreateRoom} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
