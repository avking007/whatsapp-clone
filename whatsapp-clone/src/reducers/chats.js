import { CLEAR_ROOM, ROOM_ERROR, ROOM_LOADED } from '../actions/types';

const initState = {
  room: null,
  loading: true,
  error: [],
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
        msg_model: null,
        error: [],
      };

    case ROOM_ERROR:
      return {
        ...state,
        loading: true,
        error: payload,
        msg_model: null,
      };
    case ROOM_LOADED:
      return {
        ...state,
        room: payload.room,
        loading: false,
        msg_model: payload.msg_model,
      };
    default:
      return state;
  }
}
