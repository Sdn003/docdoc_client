import React from 'react';
import image1 from "../multimedia/doctor.avif"
import './LoginSignUpPage.css'
import { Button } from '@mui/material';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from 'react-router-dom';

function LoginSignUpPage() {
    const navigate = useNavigate();
  return (
    <>
      <div className="landingPage">
        <div className="landingPage__container">
          <div className="imgContainer">
            <img src={image1} alt="SignupPic" />
          </div>
          <div className="landingPage__btnContainer">
            <Button
              variant="contained"
              className="btn1"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/Login")}
            >
              Login
            </Button>
            <Button
              variant="contained"
              className="btn2"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate("/Signup")}
            >
              Signup
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginSignUpPage;