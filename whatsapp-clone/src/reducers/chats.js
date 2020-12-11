import { CLEAR_ROOM, ROOM_ERROR, ROOM_LOADED } from '../actions/types';

const initState = {
  room: null,
  loading: true,
  error: [],
  messages: [],
  msg_model: null,
};
export default function chats(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_ROOM:
      return {
        ...state,
        loading: true,
        room: null,
        messages: [],
        msg_model: null,
        error: [],
      };

    case ROOM_ERROR:
      return {
        ...state,
        loading: true,
        error: payload,
        messages: [],
        msg_model: null,
      };
    case ROOM_LOADED:
      return {
        ...state,
        room: payload.room,
        messages: payload.msg_model.msg_contents,
        loading: false,
        msg_model: payload.msg_model,
      };
    default:
      return state;
  }
}
