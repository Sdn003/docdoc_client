import React, {  useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../HomePage/Header";
import './Profile.css';
import profile_bg from '../../components/multimedia/cardImages/profileBackground.jpg'
import { Box, Button, Toolbar } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const location = useLocation();
  const { image } = location.state;

  useEffect(() => {
    let userdata = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata);
    setName(userdata.name);
    setEmail(userdata.email);
    if (!localStorage.getItem("authId")) {
      navigate("/Login");
    } else if (localStorage.getItem("authId") === "undefined") {
      navigate("/Login");
    }
  }, []);




  return (
    <>
      <Header altLetter={name[0]} moduleName=" | My Profile" />
      <Box component="main" sx={{ p: 0.5 }}>
        <Toolbar />
      </Box>
      <div className="profileContainer">
        <div
          className="contentWrapper"
          style={{ backgroundImage: "url(" + profile_bg + ")" }}
        >
          <div className="imgContent">{image}</div>
          <div className="textContent">
            <h3>{name}</h3>
            <p>{email}</p>
            <Button
              variant="contained"
              className="textField"
              startIcon={<LockResetIcon />}
              style={{ width: "70%" }}
              onClick={() => {
                navigate("/UpdatePassword");
              }}
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>

      <div className="signature">
        Created with&nbsp;
        <FavoriteIcon style={{ color: "crimson", fontSize: "medium" }} />
        &nbsp;by&nbsp;<span className="sdn">Sudharsan S</span>
      </div>
    </>
  );
}

export default Profile;
