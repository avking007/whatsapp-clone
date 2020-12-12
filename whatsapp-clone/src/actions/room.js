import axios from 'axios';
import {
  CLEAR_ROOM,
  MESSAGE_FAIL,
  MESSAGE_SUCCESS,
  ROOM_ERROR,
  ROOM_LOADED,
} from './types';
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
export const sendMessage = (message, Mess_model_Id) => async (dispatch) => {
  try {
    const body = JSON.stringify({
      name: message.user,
      message: message.message,
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.put(`/room/${Mess_model_Id}/message`, body, config);
    dispatch({ type: MESSAGE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: MESSAGE_FAIL });
    alert(error);
  }
};

// add member in group
