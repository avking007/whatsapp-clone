import { CLEAR_ROOM, ROOM_ERROR } from '../actions/types';

const initState = {
  room: null,
  loading: true,
  error: {},
};
export default function chats(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case CLEAR_ROOM:
      return { ...state, loading: true, room: null };

    case ROOM_ERROR:
      return { ...state, loading: false, error: payload };

    default:
      return state;
  }
}
