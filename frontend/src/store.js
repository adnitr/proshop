import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  createProductReducer,
  deleteProductReducer,
  productListReducer,
  productReducer,
  updateProductReducer,
  reviewProductReducer,
  topProductReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './reducers/userReducer';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer,
} from './reducers/orderReducers';

const reducer = combineReducers({
  productList: productListReducer,
  productSingle: productReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  deleteProduct: deleteProductReducer,
  createProduct: createProductReducer,
  updateProduct: updateProductReducer,
  orderDeliver: orderDeliverReducer,
  reviewProduct: reviewProductReducer,
  topProduct: topProductReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? localStorage.getItem('cartItems')
  : '[]';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? localStorage.getItem('userInfo')
  : 'null';

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? localStorage.getItem('shippingAddress')
  : '{}';

const initialState = {
  cart: {
    cartItems: JSON.parse(cartItemsFromStorage),
    shippingAddress: JSON.parse(shippingAddressFromStorage),
  },
  userLogin: { userInfo: JSON.parse(userInfoFromStorage) },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
