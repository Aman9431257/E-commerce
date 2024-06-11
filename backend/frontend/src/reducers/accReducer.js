export const getAcc = (state = { acc: "" }, action) => {
  switch (action.type) {
    case "ACC_REQUEST":
      return {
        acc: action.payload,
      };
    case "ACC_SUCCESS":
      return {
        ...state,
        acc: action.payload.account,
      };
    case "ACC_FAIL":
      return {
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

export const setAcc = (state = { acc: "" }, action) => {
  switch (action.type) {
    case "ACC_SET_REQUEST":
      return {
        acc: action.payload,
      };
    case "ACC_SET_SUCCESS":
      return {
        acc: action.payload.account,
      };
    case "ACC_SET_FAIL":
      return {
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