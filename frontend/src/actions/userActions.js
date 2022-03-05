import axios from 'axios';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_LOGOUT,
} from '../constants/userConstants';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: errMsg,
    });
  }
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    );
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: errMsg,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/users/${id}`, config);
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: errMsg,
    });
  }
};

export const userUpdateProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`/api/users/profile`, user, config);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: { ...data, token: userInfo.token },
    });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    localStorage.setItem(
      'userInfo',
      JSON.stringify({ ...data, token: userInfo.token })
    );
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: errMsg,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
};
