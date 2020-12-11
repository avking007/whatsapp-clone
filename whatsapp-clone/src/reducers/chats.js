import {
  CLEAR_ALL_ROOMS,
  CLEAR_ROOM,
  ROOMS_LOADED,
  ROOM_ERROR,
} from '../actions/types';

const initState = {
  rooms: [],
  room: null,
  loading: true,
  error: {},
};
export default function chats(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case ROOMS_LOADED:
      return { ...state, loading: false, rooms: payload };

    case CLEAR_ROOM:
      return { ...state, loading: true, room: null };

    case CLEAR_ALL_ROOMS:
      return { ...state, loading: true, rooms: [] };

    case ROOM_ERROR:
      return { ...state, loading: false, error: payload };

    default:
      return state;
  }
}
