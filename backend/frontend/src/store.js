import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import {
  newProductReducer,
  newReviewReducer,
  productDetailsReducer,
  productReviewsReducer,
  productsReducer,
  reviewReducer,
  similarProduct,
  featuredProduct,
  randomProduct
} from "./reducers/productReducer";

import {
  forgotPasswordReducer,
  profileReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/userReducer";

import { getAcc } from "./reducers/accReducer";
import { cartReducer } from "./reducers/cartReducer";

const reducer = combineReducers({
  acc: getAcc,
  products: productsReducer,
  similar: similarProduct,
  featured: featuredProduct,
  random: randomProduct,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  userDetails: userDetailsReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(thunk)
);

export default store;