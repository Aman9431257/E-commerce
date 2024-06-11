import axios from "axios";
const baseUrl = window.location.origin;

function getToken() {
  let token;
  document.cookie.split(";").forEach((e) => {
  const array = e.split("=");
  if (array[0] === "token")
    token = array[1];
  });

  return token;
}

// Get All Products
export const getProduct =
  (keyword = "", currentPage = 1, price = [0, 2500], category, ratings = 0, sort) => async (dispatch) => {
  try {
    dispatch({ type: "ALL_PRODUCT_REQUEST" });

    let link = `${baseUrl}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&sort=${sort}`;

    if (category) {
      link = `${baseUrl}/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}&sort=${sort}`;
    }

    const { data } = await axios.get(link);
    
    dispatch({
      type: "ALL_PRODUCT_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "ALL_PRODUCT_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Get Featured Products
export const getFeatured = () => async (dispatch) => {
  try {
    dispatch({ type: "FEATURED_PRODUCT_REQUEST" });

    const { data } = await axios.get(`${baseUrl}/api/v1/featured`);

    dispatch({
      type: "FEATURED_PRODUCT_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "FEATURED_PRODUCT_FAIL",
      payload: error.response.data.message,
    });
  }
}

// Get Similar Products
export const similarProduct = (category, currentPage = 1, id = "") => async (dispatch) => {
  try {
    dispatch({ type: "SIMILAR_PRODUCT_REQUEST" });
  
    const { data } = await axios.get(`${baseUrl}/api/v1/similar?page=${currentPage}&category=${category}&id=${id}`);

    dispatch({
      type: "SIMILAR_PRODUCT_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "SIMILAR_PRODUCT_FAIL",
      payload: error.response.data.message,
    });
  }
}

// Get Random Products
export const getRandom = () => async (dispatch) => {
  try {
    dispatch({ type: "RANDOM_PRODUCT_REQUEST" });

    const { data } = await axios.get(`${baseUrl}/api/v1/random`);

    dispatch({
      type: "RANDOM_PRODUCT_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "RANDOM_PRODUCT_FAIL",
      payload: error.response.data.message,
    });
  }
}

// Get All Products For Admin
export const getAdminProduct = () => async (dispatch) => {
  try {
    dispatch({ type: "ADMIN_PRODUCT_REQUEST" });

    const token = getToken();

    const config = { headers: { token } };

    const { data } = await axios.get(`${baseUrl}/api/v1/admin/products`, config);

    dispatch({
      type: "ADMIN_PRODUCT_SUCCESS",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "ADMIN_PRODUCT_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Create Product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "NEW_PRODUCT_REQUEST" });

    const token = getToken();

    const config = {
      headers: { "Content-Type": "application/json", token },
    }

    const { data } = await axios.post(
      `${baseUrl}/api/v1/admin/product/create`,
      productData,
      config
    );

    dispatch({
      type: "NEW_PRODUCT_SUCCESS",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "NEW_PRODUCT_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Get Product Details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: "PRODUCT_DETAILS_REQUEST" });

    const { data } = await axios.get(`${baseUrl}/api/v1/product/${id}`);

    dispatch({
      type: "PRODUCT_DETAILS_SUCCESS",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "PRODUCT_DETAILS_FAIL",
      payload: error.response.data.message,
    });
  }
};

// NEW REVIEW
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: "NEW_REVIEW_REQUEST" });

    const token = getToken();

    const config = {
      headers: { "Content-Type": "application/json", token },
    };

    const { data } = await axios.put(`${baseUrl}/api/v1/review`, reviewData, config);

    dispatch({
      type: "NEW_REVIEW_SUCCESS",
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: "NEW_REVIEW_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Get All Reviews of a Product
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: "ALL_REVIEW_REQUEST" });

    const { data } = await axios.get(`${baseUrl}api/v1/reviews?productId=${id}`);

    dispatch({
      type: "ALL_REVIEW_SUCCESS",
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: "ALL_REVIEW_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "CLEAR_ERRORS" });
};