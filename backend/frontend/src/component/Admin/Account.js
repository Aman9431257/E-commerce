import React, { Fragment, useState, useEffect } from "react";
import { clearErrors, getAcc, setAcc } from "../../actions/accAction";
import { useSelector, useDispatch } from "react-redux";
import "./Account.css";

import MetaData from "../layout/MetaData";
import SideBar from "./Sidebar";

const Account = () => {
  const dispatch = useDispatch();
  const { acc, error } = useSelector((state) => state.acc);

  const [val, setVal] = useState(acc);

  const handleChange = () => {
    setVal(!val);
    dispatch(setAcc());
  };

  useEffect(() => {  
    if (error) {
      dispatch(clearErrors());
    }
    
    dispatch(getAcc());
  }, [dispatch, error]);
  
  return (
    <Fragment>
      <MetaData title="Account" />
      
      <div className="dashboard">
        <SideBar />

        <div className="acc-con">
           <div className="acc-head">Account</div>
          <div className="toggle-switch" id="acc-con">
            <input type="checkbox" name="checkbox" id="toggle" className="toggle" onChange={() => handleChange()} checked={acc || false}/>
<label htmlFor="toggle" className="switch" id="acc-btn"></label>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Account;