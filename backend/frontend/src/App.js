import "./App.css";
import { useEffect } from "react";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import NewProduct from "./component/Admin/NewProduct";
import Account from "./component/Admin/Account";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Cart from "./component/Cart/Cart";
import About from "./component/layout/About/About";
import Dashboard from "./component/Admin/Dashboard.js";

import { HelmetProvider } from 'react-helmet-async';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  
  return (
    <Router>
      <HelmetProvider>
        <Header />

        {isAuthenticated && <UserOptions user={user} />}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />
        
          <Route path="/product/:id" element={<ProductDetails />} />
        
          <Route path="/products" element={<Products />} />

          <Route path="/login" element={<LoginSignUp />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/password/forgot" element={<ForgotPassword />} />

          <Route path="/password/reset/:token" element={<ResetPassword />} />

          {isAuthenticated && <Route path="/password/update" element={<UpdatePassword />} />}

          {isAuthenticated && <Route path="/profile" element={<Profile />} />}

          {isAuthenticated && <Route path="/profile/update" element={<UpdateProfile />}/>}

          {(isAuthenticated && user.role === "admin") && <Route path="/admin/dashboard" element={<Dashboard />} />}

          {(isAuthenticated && user.role === "admin") && <Route path="/admin/product/create" element={<NewProduct />} />}

          {(isAuthenticated && user.role === "admin") && <Route path="/admin/account" element={<Account />} />}
        </Routes>

        <Footer />
      </HelmetProvider>
    </Router>
  );
}

export default App;
