function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const productsReducer = (state = { products: [], productsCount: 10 }, action) => {
  switch (action.type) {
    case "ALL_PRODUCT_REQUEST":
    case "ADMIN_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
        products: state.products,
      };
    case "ALL_PRODUCT_SUCCESS":
      const { page } = action.payload;
      return {
        ...state,
        loading: false,
        products: page <= 1 ? action.payload.products : [...state.products, ...action.payload.products],
        productsCount: action.payload.productsCount,
        resultPerPage: action.payload.resultPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    case "ADMIN_PRODUCT_SUCCESS":
      return {
        loading: false,
        products: action.payload,
      };
    case "ALL_PRODUCT_FAIL":
    case "ADMIN_PRODUCT_FAIL":
      return {
        loading: false,
        error: action.payload,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const featuredProduct = (state = { products: [] }, action) => {
  switch (action.type) {
    case "FEATURED_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
        products: state.products,
      };
    case "FEATURED_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.products,
      };
    case "FEATURED_PRODUCT_FAIL":
      return {
        loading: false,
        error: action.payload,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const similarProduct = (state = { products: [] }, action) => {
  switch (action.type) {
    case "SIMILAR_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
        products: state.products,
      };
    case "SIMILAR_PRODUCT_SUCCESS":
     shuffle(action.payload.products);
      const { currentPage } = action.payload;
      return {
        ...state,
        loading: false,
        products: currentPage <= 1 ? action.payload.products : [...state.products, ...action.payload.products],
        productsCount: action.payload.productsCount,
        page: currentPage,
      };
    case "SIMILAR_PRODUCT_FAIL":
      return {
        loading: false,
        error: action.payload,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const randomProduct = (state = { products: [] }, action) => {
  switch (action.type) {
    case "RANDOM_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
        products: state.products,
      };
    case "RANDOM_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: [...state.products, ...action.payload.products],
      };
    case "RANDOM_PRODUCT_FAIL":
      return {
        loading: false,
        error: action.payload,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export const newProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case "NEW_PRODUCT_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "NEW_PRODUCT_SUCCESS":
      return {
        loading: false,
        success: action.payload.success,
        product: action.payload.product,
      };
    case "NEW_PRODUCT_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "NEW_PRODUCT_RESET":
      return {
        ...state,
        success: false,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case "PRODUCT_DETAILS_REQUEST":
      return {
        loading: true,
        ...state,
      };
    case "PRODUCT_DETAILS_SUCCESS":
      return {
        loading: false,
        product: action.payload,
      };
    case "PRODUCT_DETAILS_FAIL":
      return {
        loading: false,
        error: action.payload,
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const newReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case "NEW_REVIEW_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "NEW_REVIEW_SUCCESS":
      return {
        loading: false,
        success: action.payload,
      };
    case "NEW_REVIEW_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "NEW_REVIEW_RESET":
      return {
        ...state,
        success: false,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const productReviewsReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case "ALL_REVIEW_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "ALL_REVIEW_SUCCESS":
      return {
        loading: false,
        reviews: action.payload,
      };
    case "ALL_REVIEW_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case "DELETE_REVIEW_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "DELETE_REVIEW_SUCCESS":
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case "DELETE_REVIEW_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "DELETE_REVIEW_RESET":
      return {
        ...state,
        isDeleted: false,
      };
    case "CLEAR_ERRORS":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};