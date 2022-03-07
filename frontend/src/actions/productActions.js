import axios from 'axios';

import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_FAIL,
  PRODUCT_SUCCESS,
  PRODUCT_REQUEST,
} from '../constants/productConstants';

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get('/api/products');
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: errMsg,
    });
  }
};

export const listProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_REQUEST });
    const { data } = await axios.get('/api/products/' + id);
    dispatch({ type: PRODUCT_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({
      type: PRODUCT_FAIL,
      payload: errMsg,
    });
  }
};

export const deleteProductAction = (id) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/products/${id}`, config);
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: errMsg });
  }
};

export const createProductAction = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`/api/products`, {}, config);
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({ type: PRODUCT_CREATE_FAIL, payload: errMsg });
  }
};

export const updateProductAction = (product) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    dispatch({ type: PRODUCT_UPDATE_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    dispatch({ type: PRODUCT_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({ type: PRODUCT_UPDATE_FAIL, payload: errMsg });
  }
};
