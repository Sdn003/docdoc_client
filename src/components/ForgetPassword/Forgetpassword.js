import React from 'react';
import './Forgetpassword.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import Swal from 'sweetalert2';
import env from "react-dotenv";

function Forgetpassword() {

  const navigate = useNavigate();

  const initialValues = {
    email : '',
    newPassword : '',
  };

  const onSubmit = async (formData, {resetForm}) => {
    try {
      await axios
        .post(env.API_URL + "ForgetPassword", formData)
        .then((res) => {
          if (res.data.successUpdate === true) {
            Swal.fire({
              icon: "success",
              title: "Password Changed Successfully",
              text: "Please Login to Continue",
            });
            resetForm();
            navigate('/Login')
          } else if (res.data.userExist === false) {
             Swal.fire({
               icon: "info",
               title: "Email Does not Exist",
               text: "Please Enter the Correct Email",
             });
          }
        })
        .catch((err) => Swal.fire({
        icon: "error",
        title: "Internal Server Error",
      }));
    } catch (error) {
       Swal.fire({
         icon: "error",
         title: "Internal Server Error",
       });
    }
  };

  const validate = (values) => {
    let errors = {};
    //Validating Email
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    //Validating PassWord
        if (!values.newPassword) {
          errors.newPassword = "Required";
        } else if (
          !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/i.test(
            values.newPassword
          )
        ) {
          errors.newPassword =
            "Password must Contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character";

        }
    return errors;
  }

  const formik = useFormik({
    initialValues,onSubmit, validate
  })

  

  return (
    <>
      <div className="loginForm">
        <div className="loginForm__wrapper">
          <div className="loginHeader">
            <LockResetIcon />
            <h3>Forget Password</h3>
          </div>
          <div className="loginInput">
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
            {formik.errors.email ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.email}
              </div>
            ) : null}
            <TextField
              id="outlined-password-input"
              required
              label="New Password"
              type="password"
              name="newPassword"
              value={formik.values.newPassword}
              autoComplete="current-password"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.newPassword ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.newPassword}
              </div>
            ) : null}

            {formik.errors.newPassword || formik.errors.email ? (
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
          <div className="navBtn"></div>
        </div>
      </div>
    </>
  );
}

export default Forgetpassword