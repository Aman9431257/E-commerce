import axios from "axios";
import Aman from "../images/Aman.jpg";
import Rohan from "../images/Rohan.jpg";
const baseUrl = window.location.origin;

export const getAcc = () => async (dispatch) => {
  try {
    dispatch({ type: "ACC_REQUEST" });

    const { data } = await axios.get(`${baseUrl}/api/v1/acc`);

    data.acc.account
      ? document.documentElement.style.setProperty(
          "--background",
          `url(${window.location.protocol}//${window.location.hostname}${Rohan})`,
        )
      : document.documentElement.style.setProperty(
          "--background",
          `url(${window.location.protocol}//${window.location.hostname}${Aman})`,
        );

    dispatch(getAcc());
    dispatch({
      type: "ACC_SUCCESS",
      payload: data.acc,
    });
  } catch (error) {
    dispatch({
      type: "ACC_FAIL",
      payload: error.response,
    });
  }
};

export const setAcc = () => async (dispatch) => {
  try {
    dispatch({ type: "ACC_SET_REQUEST" });

    const { data } = await axios.put(`${baseUrl}/api/v1/acc`);

    data.account
      ? document.documentElement.style.setProperty(
          "--background",
          `url(${window.location.protocol}//${window.location.hostname}${Rohan})`,
        )
      : document.documentElement.style.setProperty(
          "--background",
          `url(${window.location.protocol}//${window.location.hostname}${Aman})`,
        );

    dispatch({
      type: "ACC_SET_SUCCESS",
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: "ACC_SET_FAIL",
      payload: error.response,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "CLEAR_ERRORS" });
};
