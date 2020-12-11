import { combineReducers } from 'redux';
import chats from './chats';
import users from './user';

export default combineReducers({
  chats,
  users,
});
