import {
  ADD_USER_BEGIN,
  ADD_USER_FAILURE,
  ADD_USER_SUCCESS,
  USER_LOGIN_BEGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE
} from "../actions/types";

const initialState = {
  first_name: "",
  surname: "",
  address: "",
  state: "",
  image: "",
  date_of_birth: "",
  sex: "",
  level: "",
  loading: false,
  error: null
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case ADD_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_USER_SUCCESS: {
      return {
        ...state,
        email: action.payload.email,
        password: action.payload.password,
        status: action.payload.status,
        loading: false,
        error: null
      };
    }

    case ADD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case USER_LOGIN_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        email: action.payload.email,
        password: action.payload.password,
        loading: false,
        error: null
      };

    case USER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}
