import {
  LOGOUT,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  USER_LOADED,
  LOGIN_FAIL,
  ROOM_CREATED,
  ROOM_CREATE_FAIL,
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
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuth: true, loading: false };
    case USER_LOADED:
      return { ...state, user: payload, isAuth: true, loading: false };
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuth: false,
        loading: true,
        token: null,
      };
    case ROOM_CREATED:
      return { ...state, user: payload };
    case ROOM_CREATE_FAIL:
      return state;
    default:
      return state;
  }
}
