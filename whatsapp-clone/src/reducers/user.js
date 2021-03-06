import {
  LOGOUT,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  USER_LOADED,
  LOGIN_FAIL,
  ROOM_CREATED,
  ROOM_CREATE_FAIL,
  IMAGE_UPLOAD_FAIL,
  IMAGE_UPLOADED,
  GROUP_DELETED,
  GROUP_DELETED_FAIL,
} from '../actions/types';

const initState = {
  user: null,
  isAuth: false,
  token: localStorage.getItem('token'),
  loading: true,
  image: '',
  _v: 0,
  error: [],
};

export default function user(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuth: true, loading: false, error: [] };
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuth: true,
        loading: false,
        image: `uploads/users/${payload._id}.jpeg`,
        error: [],
      };
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
        image: '',
        error: [],
      };
    case GROUP_DELETED:
    case ROOM_CREATED:
      return { ...state, user: payload };

    case IMAGE_UPLOADED:
      let temp = state._v;
      temp += 1;
      return { ...state, image: payload.path, _v: temp };

    case ROOM_CREATE_FAIL:
      return { ...state, error: payload };
    case IMAGE_UPLOAD_FAIL:
      return state;

    case GROUP_DELETED_FAIL:
    default:
      return state;
  }
}
