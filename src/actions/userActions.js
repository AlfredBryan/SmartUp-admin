import {
  ADD_USER_BEGIN,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
  USER_LOGIN_BEGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE
} from "./types";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BASE_URL;

export const addUserBegin = () => ({
  type: ADD_USER_BEGIN
});

export const addUserSuccess = data => ({
  type: ADD_USER_SUCCESS,
  payload: {
    email: data.email,
    password: data.password,
    status: data.status
  }
});

export const addUserFailure = error => ({
  type: ADD_USER_FAILURE,
  payload: { error }
});

export const userLoginBegin = () => ({
  type: USER_LOGIN_BEGIN
});

export const userLoginSuccess = data => ({
  type: USER_LOGIN_SUCCESS,
  payload: {
    email: data.email,
    password: data.password
  }
});

export const userLoginFailure = error => ({
  type: USER_LOGIN_FAILURE,
  payload: { error }
});

//User login function
export function userLogin({ email, password }) {
  return dispatch => {
    dispatch(userLoginBegin());
    axios
      .post(`${apiUrl}/session`, { email, password })
      .then(res => {
        if (res.statusText === "Created" && res.data.completed_at !== null) {
          localStorage.setItem("token", res.data.authentication_token);
          localStorage.setItem("user", JSON.stringify(res.data));
          this.props.history.replace("/profile");
        } else if (res.data.completed_at === null) {
          localStorage.setItem("token", res.data.authentication_token);
          localStorage.setItem("user", JSON.stringify(res.data));
          this.props.history.replace("/update_profile");
        } else {
          dispatch(userLoginFailure(res.data.message));
        }
        dispatch(userLoginSuccess(res.data));
      })
      .catch(error => {
        dispatch(userLoginFailure(error));
      });
  };
}

//User signUp function
export function signUp({ email, password, status }) {
  return dispatch => {
    dispatch(addUserBegin());
    axios
      .post(`${apiUrl}/registration`, { email, password, status })
      .then(res => {
        if (res.data.authentication_token === null) {
          dispatch(addUserFailure("There was a failure"));
        } else if (
          !res.data.authentication_token === null &&
          res.data.completed_at === null
        ) {
          this.props.history.replace("/profile");
        } else {
          localStorage.setItem("token", res.data.authentication_token);
          localStorage.setItem("user", JSON.stringify(res.data));
          this.props.history.replace("/update_profile");
        }
        localStorage.setItem("token", res.data.authentication_token);
        localStorage.setItem("user", JSON.stringify(res.data));
        dispatch(addUserSuccess(res.data));
      })
      .catch(error => {
        dispatch(addUserFailure(error));
      });
  };
}
