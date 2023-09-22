import './Signup.css';
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, CircularProgress, TextField } from '@mui/material';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import env from "react-dotenv";


function Signup() {
    const navigate = useNavigate();
    const [loader, setLoader] = useState();

    const initialValues = {
      name : '',
      email : '',
      password : ''
    }

      const onSubmit = async (formData, {resetForm}) => {
        try {
          setLoader(true);
          await axios
            .post(env.API_URL + "Signup", formData)
            .then(async (res) => {
              let token = await res.data.token;
              localStorage.setItem("authId", token);
              let userdata = await res.data.signedInUserdata;
              localStorage.setItem("userdata", JSON.stringify(userdata));
              if (res.data.successSignup === true) {
                setLoader(false);
                Swal.fire({
                  icon: "success",
                  title: res.data.message,
                });
                navigate("/Home");
              } else if (res.data.userExist === true) {
                Swal.fire({
                  icon: "info",
                  title: "Email Already Exists",
                  text: "Please Login to Continue",
                });
                resetForm();
                navigate("/Login");
              }
            })
            .catch((err) =>  
              Swal.fire({
                  icon: "error",
                  title: "Internal Server Error",
                    }));
        } catch (error) {
           Swal.fire({
             icon: "error",
             title: "Internal Server Error",
             text: error
           });
        }
      };

      const validate = (values) => {
        let errors = {};

        //Validating Name
        if (!values.name) {
          errors.name = "Required";
        } else if (values.name.length > 34) {
          errors.name = "Maximum Character allowed is 34";
        }

        //Validating Email
        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }

        //Validating PassWord
        if (!values.password) {
          errors.password = "Required";
        } else if (
          !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/i.test(
            values.password
          )
        ) {
          errors.password =
            "Password must Contain atleast 1 alphabet, 1 number and 1 special character";
        }

        return errors;
      }


    const formik = useFormik({
      initialValues,
      onSubmit,
      validate,
    });



  
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
                <PersonAddIcon />
                <h3>Signup</h3>
              </div>
              <div className="loginInput">
                <TextField
                  required
                  name="name"
                  value={formik.values.name}
                  id="outlined-required"
                  label="Name"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.name}
                  </div>
                ) : null}
                <TextField
                  required
                  value={formik.values.email}
                  name="email"
                  id="outlined-required"
                  label="E-Mail"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.email}
                  </div>
                ) : null}
                <TextField
                  id="outlined-password-input"
                  required
                  label="Password"
                  type="password"
                  name="password"
                  value={formik.values.password}
                  autoComplete="current-password"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.password}
                  </div>
                ) : null}

                {formik.errors.password ||
                formik.errors.password ||
                formik.errors.email ? (
                  <>
                    <Button variant="contained" className="disabledBtn">
                      Submit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      className="textField"
                      onClick={formik.handleSubmit}
                    >
                      Submit
                    </Button>
                  </>
                )}
              </div>
              <div className="separator"></div>
              <div className="navBtn">
                <p>
                  Already have an account?&nbsp;
                  <Link to="/Login">
                    <span className="linkText">LogIn</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Signup