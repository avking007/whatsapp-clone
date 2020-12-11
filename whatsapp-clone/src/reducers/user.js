import {
  LOGOUT,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  USER_LOADED,
  LOGIN_FAIL,
  REGISTER_FAIL,
} from '../actions/types';

const initState = {
  user: null,
  isAuth: false,
  token: localStorage.getItem('token'),
  loading: true,
};

export default function user(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, isAuth: true, loading: false };
    case USER_LOADED:
      return { ...state, user: payload, isAuth: true, loading: false };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return { ...state, isAuth: false, loading: true };

    default:
      return state;
  }
}
