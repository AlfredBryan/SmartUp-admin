import axios from "axios";

import { LOGIN_BEGIN, LOGIN_SUCCESS, LOGIN_FAILURE } from "./types";

const Url = process.env.REACT_APP_BASE_URL;

export const userloginBegin = () => ({
  type: LOGIN_BEGIN
});

export const loginSuccess = data => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      email: data.email,
      password: data.password
    }
  };
};

export const loginFailure = error => ({
  type: LOGIN_FAILURE,
  payload: { error }
});

export function userLogin({ email, password }) {
  return dispatch => {
    dispatch(userloginBegin());

    axios
      .post(`${Url}/api/v1/session`, { email, password })
      .then(res => {
        if (res.status === 201) {
          console.log(res);
          dispatch(loginSuccess(res.data));
        }
      })
      .catch(error => {
        dispatch(loginFailure(error));
      });
  };
}
