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
  _v: 0,
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
        _v: 0,
      };

    case ROOM_ERROR:
      return {
        ...state,
        loading: true,
        error: payload,
      };
    case ROOM_LOADED:
      let { _id, room, __v } = payload.msg_model;

      return {
        ...state,
        room: payload.room,
        loading: false,
        msg_model: { _id, room, __v },
        messages: payload.msg_model.msg_contents,
        _v: __v,
      };

    case NEW_MESSAGE:
    case MESSAGE_SUCCESS:
      let x = [...state.messages, payload];
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
    case GROUP_DP_UPLOAD:
      let dp = state._v;
      dp += 1;
      return {
        ...state,
        _v: dp,
      };

    case GROUP_DP_FAIL:
    case MEMBER_ADD_FAIL:
    case NEW_MESSAGE_FAIL:
    default:
      return state;
  }
}
