import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);
      if (existItem) {
        return {
          cartItems: state.cartItems.map((x) =>
            x.product === item.product ? item : x
          ),
        };
      } else {
        return {
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_REMOVE_ITEM:
      const itemId = action.payload;
      return { cartItems: state.cartItems.filter((x) => x.product !== itemId) };
    default:
      return state;
  }
};
