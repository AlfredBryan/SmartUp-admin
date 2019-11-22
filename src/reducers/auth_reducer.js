import { LOGIN_SUCCESS, LOGIN_FAILURE } from "../actions/types";

const initialState = {
  email: "",
  password: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { token: action.payload };
    case LOGIN_FAILURE:
      return { token: null };
    default:
      return state;
  }
}
