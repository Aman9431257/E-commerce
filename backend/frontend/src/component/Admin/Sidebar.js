import React from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <Link to="/admin/product/create">
        <p>
          <AddIcon /> New Product
        </p>
      </Link>
      <Link to="/admin/account">
        <p>
          <AccountBoxIcon /> Account
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;