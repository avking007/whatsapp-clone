import axios from 'axios';
import { CLEAR_ROOM, ROOM_ERROR, ROOM_LOADED } from './types';
// open a group
export const open_room = (room_id) => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_ROOM });
    const res = await axios.get(`/room/${room_id}`);
    dispatch({ type: ROOM_LOADED, payload: res.data });
  } catch (error) {
    dispatch({ type: ROOM_ERROR });
  }
};
// add message in group

// add member in group
