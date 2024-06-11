import React, { useEffect } from "react";
import "./aboutSection.css";
import { clearErrors, getAcc } from "../../../actions/accAction";
import { Typography, Avatar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import Aman from "../../../images/Aman.jpg";
import Rohan from "../../../images/Rohan.jpg";

const About = () => {
  const dispatch = useDispatch();
  const { acc, error } = useSelector((state) => state.acc);

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }

    getAcc();
  }, [dispatch, error])
  
  return (
    <div className="aboutSection">
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={acc ? Rohan : Aman}
              alt="Founder"
            />
            <Typography>{acc ? "Rohan" : "Aman"}</Typography>
            <a href={acc ? "https://www.fiverr.com/rohan943?up_rollout=true" : "https://www.fiverr.com/deadman954?up_rollout=true"} color="primary">
              Visit Fiverr
            </a>
            <span>
              This is a Sample E-Commerce Wesbite made by me using MERN Stack. I am a professional MERN Stack Developer.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;