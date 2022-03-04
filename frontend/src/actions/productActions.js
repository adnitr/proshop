import axios from 'axios';

import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
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
