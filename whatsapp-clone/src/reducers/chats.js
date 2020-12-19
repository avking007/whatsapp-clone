import {
  CLEAR_ROOM,
  GROUP_DP_FAIL,
  GROUP_DP_UPLOAD,
  MEMBER_ADDED,
  MEMBER_ADD_FAIL,
  MESSAGE_FAIL,
  MESSAGE_SUCCESS,
  NEW_MESSAGE,
  ROOM_ERROR,
  ROOM_LOADED,
  NEW_MESSAGE_FAIL,
} from '../actions/types';

const initState = {
  room: null,
  loading: true,
  error: [],
  msg_model: null,
  messages: [],
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
        messages: [],
      };

    case ROOM_ERROR:
      return {
        ...state,
        loading: true,
        error: payload,
      };
    case ROOM_LOADED:
      return {
        ...state,
        room: payload.room,
        loading: false,
        msg_model: payload.msg_model,
        messages: payload.msg_model.msg_contents,
      };

    case NEW_MESSAGE:
    case MESSAGE_SUCCESS:
      let x = [...state.messages, payload];
      console.log(payload);
      return {
        ...state,
        messages: x,
      };
    case MESSAGE_FAIL:
      return {
        ...state,
        error: payload,
      };

    case MEMBER_ADDED:
      let temp = state.room;
      temp.members.push(payload);
      return { ...state, room: x };

    case GROUP_DP_FAIL:
    case GROUP_DP_UPLOAD:
    case MEMBER_ADD_FAIL:
    case NEW_MESSAGE_FAIL:
    default:
      return state;
  }
}
