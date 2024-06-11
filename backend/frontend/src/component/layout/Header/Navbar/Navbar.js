import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Modal } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from '@mui/icons-material/Search';

import "./Navbar.css"

function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [click, setClick] = useState(false);
  const [val, setVal] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClick = () => setClick(!click);
  const Close = () => setClick(false);
  const changeVal = (e) => setVal(e.target.value);
  const nav = () => {
    navigate("/products", {
      state: {
        keyword: val,
      },
    });
    handleClose();
  };
  return (
    <div>
     <div className={click ? "main-container" : ""}  onClick={Close} >
      <nav className="navbar" onClick={e => e.stopPropagation()}>
        <div className="nav-container">
          <NavLink to="/" className="nav-logo">
            <div>
              E-commerce
              <div />
            </div>
          </NavLink>
          
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                to="/"
                activeclassname="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/products"
                activeclassname="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                activeclassname="active"
                className="nav-links"
                onClick={click ? handleClick : null}
              >
                About
              </NavLink>
            </li>
          </ul>
          
          <div className="icons">
            <div onClick={handleOpen} className="i">
              <SearchIcon />
            </div>

            <Modal
              open={open}
              onClose={handleClose}
            >
              <div className="model">
                <input type="text" value={val} className="model-input" placeholder="search anything..." onChange={changeVal}/>
                <button to="/products" onClick={nav} className="model-button">
                  <SearchIcon sx={{ fontSize: "3.5vmax" }}/>
                </button>
              </div>
            </Modal>
            
            <NavLink
              to={isAuthenticated ? "/profile" : "/login"}
              className="i"
              onClick={click ? handleClick : null}
              >
              <AccountBoxIcon />
            </NavLink>
            <NavLink
              to="/cart"
              className="i"
              onClick={click ? handleClick : null}
              >
              <div className="cart">
                <p>{cartItems.length}</p>
                  <ShoppingCartIcon />
              </div>
            </NavLink>
            
            <div className="nav-icon" onClick={handleClick}>
              {click ? <CloseIcon /> : <MenuIcon />}
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
  );
}

export default Navbar;