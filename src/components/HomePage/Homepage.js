import React, {  useEffect, useState } from "react";
import './Homepage.css'
import { useNavigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Header from "./Header";
import Swal from "sweetalert2";

function Homepage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    let userdata = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata)
    setName(userdata.name);
    if (!localStorage.getItem("authId")) {
      navigate("/Login");
    } else if (localStorage.getItem("authId") === "undefined") {
      navigate("/Login");
    }
  },[])


  const logout = () => {
    try {
      localStorage.removeItem("authId");
      localStorage.removeItem("userdata");
      navigate('/Login')
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Internal Server Error",
      });
    }
     
  }
  
  return (
    <>
      <Header altLetter={name[0]} />
      <Box component="main" sx={{ p: 0.5 }}>
        <Toolbar />
      </Box>
      <div className="homePageWrapper">
        <div className="homePageContainer">
          <div className="homePageHeader">
            <h3>
              Hello <span className="userName">{name}</span>, Welcome
            </h3>
            <DoubleArrowIcon
              className="arrowDownBtn"
              onClick={() => navigate('/Cards')}
            />
          </div>
        </div>
      </div>
      <button onClick={logout} id="button">
        Logout
      </button>
    </>
  );
}

export default Homepage;
