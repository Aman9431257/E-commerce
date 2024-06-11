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

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${baseUrl}/api/v1/login`,
      { email, password },
      config
    );

    var date = new Date();
    date.setDate(date.getDate() + 5);
    
    document.cookie = `token=${data.token};expires=${date}`

    dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
  } catch (error) {
    dispatch({
      type: "LOGIN_FAIL",
      payload: error.response.data.message
    });
  }
};

// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "REGISTER_USER_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };

    const { data } = await axios.post(`${baseUrl}/api/v1/signup`, userData, config);

    var date = new Date();
    date.setDate(date.getDate() + 5);
    
    document.cookie = `token=${data.token};expires=${date}`

    dispatch({ type: "REGISTER_USER_SUCCESS", payload: data.user });
  } catch (error) {
    dispatch({
      type: "REGISTER_USER_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LOAD_USER_REQUEST" });

    const token = getToken();

    const config = { headers: { token } };

    const { data } = await axios.get(`${baseUrl}/api/v1/me`, config)

    dispatch({ type: "LOAD_USER_SUCCESS", payload: data.user });
  } catch (error) {
    dispatch({
      type: "LOAD_USER_FAIL",
      payload: error.response.data.message
    });
  }
};

// Logout User
export const logout = () => async (dispatch) => {
  try {
    await axios.get(`${baseUrl}/api/v1/logout`);
    localStorage.clear();
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    dispatch({ type: "LOGOUT_SUCCESS" });
    
  } catch (error) {
    dispatch({ type: "LOGOUT_FAIL", payload: error.response.data.message });
  }
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_PROFILE_REQUEST" });

    const token = getToken();

    const config = { headers: { "Content-Type": "multipart/form-data", token } };

    const { data } = await axios.put(`${baseUrl}/api/v1/profile/update`, userData, config);

    dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: data.success });
  } catch (error) {
    dispatch({
      type: "UPDATE_PROFILE_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_PASSWORD_REQUEST" });

    const token = getToken();

    const config = {
      headers: { "Content-Type": "application/json", token },
    };

    const { data } = await axios.put(`${baseUrl}/api/v1/password/update`,
      passwords,
      config
    );

    dispatch({ type: "UPDATE_PASSWORD_SUCCESS", payload: data.success });
  } catch (error) {
    dispatch({
      type: "UPDATE_PASSWORD_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: "FORGOT_PASSWORD_REQUEST" });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(`${baseUrl}/api/v1/password/forgot`, email, config);

    dispatch({ type: "FORGOT_PASSWORD_SUCCESS", payload: data.message });
  } catch (error) {
    dispatch({
      type: "FORGOT_PASSWORD_FAIL",
      payload: error.response.data.message,
    });
  }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: "RESET_PASSWORD_REQUEST" });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `${baseUrl}/api/v1/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: data.success });
  } catch (error) {
    dispatch({
      type: "RESET_PASSWORD_FAIL",
      payload: error.response.data.message,
    });
  }
};

// get All Users
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: "ALL_USERS_REQUEST" });

    const token = getToken();

    const config = { headers: { token } };
    
    const { data } = await axios.get(`${baseUrl}/api/v1/admin/users`, config);
    
    dispatch({ type: "ALL_USERS_SUCCESS", payload: data.users });
  } catch (error) {
    dispatch({ type: "ALL_USERS_FAIL", payload: error.response.data.message });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "CLEAR_ERRORS" });
};