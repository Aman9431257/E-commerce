import React, { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import "./Footer.css";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [inp, setInp] = useState("");

  const handleInp = (e) => {
    setInp(e.target.value);
  };
  const nav = () => {
    navigate("/products", {
      state: {
        keyword: inp,
      },
    });
    setInp("");
  };
  return (
    <footer id="footer">
      <div className="f-1">
        <div className="div h">
          <div />
          E-commerce
        </div>
        <div>This is a Sample E-Commerce Wesbite made by me using MERN Stack. I am a professional MERN Stack Developer.</div>
      </div>
      <div className="f-2">
        <div className="h">Shop</div>
        
        <Link to="/products">
          Products
        </Link>
        <Link to={isAuthenticated ? "/profile" : "/login"}>
          My Account
        </Link>
        <Link to="/products">
          Shop
        </Link>
      </div>
      <div className="f-3">
        <div className="h">Support</div>

        <Link to="about">
          About
        </Link>
        <a href="https://www.fiverr.com/deadman954?up_rollout=true">
          Contact
        </a>
      </div>
      <div className="f-4">
        <div className="h">Search</div>

        <div>Search any product or category you like...</div>
        <div className="look">
          <input type="text" className="searchTerm" value={inp} placeholder="search..." id="inp" onChange={handleInp}/>
          <button onClick={nav} className="searchButton">
            <SearchIcon sx={{ fontSize: "1.6vh" }} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;