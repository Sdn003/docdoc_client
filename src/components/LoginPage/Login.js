import React, { useEffect, useState } from "react";
import axios from 'axios'
import "./Login.css";
import { useNavigate } from "react-router-dom";
import {  Button, CircularProgress, TextField } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Person2Rounded } from "@mui/icons-material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import env from "react-dotenv";

function Login() {
const navigate = useNavigate();
const [loader, setLoader] = useState();

const initialValues = {
  email: "",
  password: "",
};

useEffect(() => {
  
},[])

const validate = (values) => {
  let errors = {};

  //Validating Email
  if (!values.email) {
    errors.email = "Required, Demo email : demouser@email.com";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  //Validating PassWord
   if (!values.password) {
     errors.password = "Required, Demo Password: 'Demo@123' ";
   } else if (
     !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/i.test(
       values.password
     )
   ) {
     errors.password =
       "Password must Contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character";
   }

   
  return errors;
};

  const onSubmit = async (formData, { resetForm }) => {
    try {
      setLoader(true);
      await axios
        .post(env.API_URL + "Login", formData)
        .then(async (res) => {
          if (res.data.successLogin === true) {
            let token = await res.data.token;
            localStorage.setItem("authId", token);
            let userdata = await res.data.loggedInUserDetails;
            localStorage.setItem("userdata", JSON.stringify(userdata));
            setLoader(false);
            Swal.fire({
              icon: "success",
              title: res.data.message,
            });
            navigate("/Home");
          } else if (res.data.successLogin === false) {
            Swal.fire({
              icon: "info",
              title: res.data.message,
            });
          }
          else if(res.data.userExist === false){
            resetForm();
            Swal.fire({
              icon: "info",
              title: res.data.message,
              text: "Entered Email does not Exist"
            });
          }
        })
        .catch((err) => 
         Swal.fire({
              icon: "info",
              title: "Error",
            })
            )

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Internal Server Error",
      });
      // console.log("Submit action interrupted due to the Error " + error);
    }
  };

 
const formik = useFormik({
  initialValues,
  onSubmit ,
  validate
})



  return (
    <>
      {loader ? (
        <>
          <div className="loader">
            <CircularProgress color="secondary" />
          </div>
        </>
      ) : (
        <>
          <div className="loginForm">
            <div className="loginForm__wrapper">
              <div className="loginHeader">
                <Person2Rounded />
                <h3>Login</h3>
              </div>
              <div className="loginInput">
                <TextField
                  required
                  name="email"
                  value={formik.values.email}
                  id="outlined-required"
                  label="E-Mail"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />

                {formik.errors.email ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.email}
                  </div>
                ) : null}

                <TextField
                  id="outlined-password-input"
                  required
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  autoComplete="current-password"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.errors.password ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.password}
                  </div>
                ) : (
                  <></>
                )}

                {formik.errors.password || formik.errors.email ? (
                  <>
                    <Button
                      variant="contained"
                      className="disabledBtn"
                      startIcon={<LoginIcon />}
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      className="textField"
                      startIcon={<LoginIcon />}
                      onClick={formik.handleSubmit}
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>

              {/* line separator */}
              <div className="separator"></div>

              {/* Sign up and Forget password  */}
              <div className="navBtn">
                <Button
                  variant="contained"
                  className="textField"
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate("/Signup")}
                  style={{ backgroundColor: "crimson" }}
                >
                  Signup
                </Button>
                <Button
                  variant="contained"
                  className="textField"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate("/ForgetPassword")}
                  style={{ backgroundColor: "blueviolet" }}
                >
                  Forget Password
                </Button>
              </div>
            </div>
          </div>
        </>)}
    </>
  );

}
export default Login;
