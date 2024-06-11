import axios from "axios";
const baseUrl = window.location.origin;

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`${baseUrl}/api/v1/product/${id}`);

  dispatch({
    type: "ADD_TO_CART",
    payload: {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images,
      stock: data.product.Stock,
      quantity,
    },
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: "REMOVE_CART_ITEM",
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: "SAVE_SHIPPING_INFO",
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};