import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
} from '../constants/orderConstants';
import axios from 'axios';

export const createOrderAction = (order) => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    dispatch({ type: ORDER_CREATE_REQUEST });
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post('/api/orders', order, config);
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({ type: ORDER_CREATE_FAIL, payload: errMsg });
  }
};

export const getOrderDetailsAction =
  (orderId) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      dispatch({ type: ORDER_DETAILS_REQUEST });
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${orderId}`, config);
      dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (err) {
      let errMsg;
      try {
        errMsg = err.response.data.message;
      } catch (error) {
        errMsg = err.message;
      }
      dispatch({ type: ORDER_DETAILS_FAIL, payload: errMsg });
    }
  };

export const payOrderAction =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();
      dispatch({ type: ORDER_PAY_REQUEST });
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );
      dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
    } catch (err) {
      let errMsg;
      try {
        errMsg = err.response.data.message;
      } catch (error) {
        errMsg = err.message;
      }
      dispatch({ type: ORDER_PAY_FAIL, payload: errMsg });
    }
  };

export const orderListMyAction = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    dispatch({ type: ORDER_LIST_MY_REQUEST });
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/orders/myorder`, config);
    dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data });
  } catch (err) {
    let errMsg;
    try {
      errMsg = err.response.data.message;
    } catch (error) {
      errMsg = err.message;
    }
    dispatch({ type: ORDER_LIST_MY_FAIL, payload: errMsg });
  }
};
