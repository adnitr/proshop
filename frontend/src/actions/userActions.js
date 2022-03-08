import axios from 'axios';
import {
  ORDER_LIST_MY_RESET,
  ORDER_LIST_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants';
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
  USER_UPDATE_PROFILE_RESET,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_RESET,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_RESET,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_RESET,
  USER_LOGOUT,
  USER_DETAILS_RESET,
} from '../constants/userConstants';
import {
  PRODUCT_DELETE_RESET,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_RESET,
  PRODUCT_CREATE_REVIEW_RESET,
} from '../constants/productConstants';

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

export const userListAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/users`, config);
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: USER_LIST_FAIL,
      payload: errMsg,
    });
  }
};

export const userDeleteAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.delete(`/api/users/${id}`, config);
    dispatch({ type: USER_DELETE_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: USER_DELETE_FAIL,
      payload: errMsg,
    });
  }
};
export const userUpdateAction = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(`/api/users/${user._id}`, user, config);
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: errMsg,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: ORDER_LIST_RESET });
  dispatch({ type: ORDER_DELIVER_RESET });
  dispatch({ type: USER_UPDATE_PROFILE_RESET });
  dispatch({ type: USER_LIST_RESET });
  dispatch({ type: USER_DELETE_RESET });
  dispatch({ type: USER_UPDATE_RESET });
  dispatch({ type: PRODUCT_DELETE_RESET });
  dispatch({ type: PRODUCT_CREATE_RESET });
  dispatch({ type: PRODUCT_UPDATE_RESET });
  dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
};
