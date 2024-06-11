import React, { Fragment, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import { Backdrop } from "@mui/material";

import DashboardIcon from "@mui/icons-material/DashboardCustomize";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch } from "react-redux";

import "./UserOptions.css";

const UserOptions = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const options = [
    { icon: <AccountBoxIcon />, name: "Profile", func: profile },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }
  function profile() {
    navigate("/profile");
  }
  function logoutUser() {
    dispatch(logout());
    navigate("/");
    alert.success("Logout Successfully");
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        sx={{ position: 'fixed', top: 80, right: 4, '& .MuiFab-primary': { background: "transparent", boxShadow: "none", '&:hover': { background: "transparent", boxShadow: "none" } } }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url}
            alt="Profile"
          />
        }
      >
      
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;