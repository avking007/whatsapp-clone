import axios from 'axios';
import setAuthToken from '../utils/setAuth';
import {
  AUTH_ERROR,
  CLEAR_ROOM,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  USER_LOADED,
} from './types';
// load user &set token

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/user/auth');
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// register user
export const google_succ = (tokenId, img) => async (dispatch) => {
  try {
    const data = JSON.stringify({ tokenId, img });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/user/googlelogin', data, config);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (error) {
    dispatch({ type: LOGIN_FAIL });
  }
};
export const google_fail = () => async (dispatch) => {
  dispatch({ type: LOGIN_FAIL });
};

// logout user
export const logout = () => async (dispatch) => {
  dispatch({ type: CLEAR_ROOM });
  dispatch({ type: LOGOUT });
};
