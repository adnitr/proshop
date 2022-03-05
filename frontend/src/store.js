import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer, productReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
} from './reducers/userReducer';

const reducer = combineReducers({
  productList: productListReducer,
  productSingle: productReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
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
