import { combineReducers } from 'redux';
import chats from './chats';
import user from './user';

export default combineReducers({
  chats,
  user,
});
