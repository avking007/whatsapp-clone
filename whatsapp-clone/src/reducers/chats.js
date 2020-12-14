import {
  CLEAR_ROOM,
  MEMBER_ADDED,
  MEMBER_ADD_FAIL,
  MESSAGE_FAIL,
  MESSAGE_SUCCESS,
  ROOM_ERROR,
  ROOM_LOADED,
} from '../actions/types';

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
    case MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        msg_model: payload.messageModel,
      };
    case MESSAGE_FAIL:
      return {
        ...state,
        error: payload,
      };

    case MEMBER_ADDED:
      let x = state.room;
      x.members.push(payload);
      return { ...state, room: x };

    case MEMBER_ADD_FAIL:
    default:
      return state;
  }
}
