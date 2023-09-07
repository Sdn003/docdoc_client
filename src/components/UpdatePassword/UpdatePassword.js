import React, { useEffect } from "react";
import "./UpdatePassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Button, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import env from "react-dotenv";

function UpdatePassword() {

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authId")) {
      navigate("/Login");
    } else if (localStorage.getItem("authId") === "undefined") {
      navigate("/Login");
    }
  },[])

  const initialValues = {
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };


  const onSubmit = async (formData, {resetForm}) => {
    try {
      await axios
        .post(env.API_URL + "UpdatePassword", formData)
        .then((res) => {
          if (res.data.successUpdate === true) {
            Swal.fire({
              icon: "success",
              title: "Password Updated Successfully",
            });
            resetForm();
            navigate('/Home')
          } else {
            Swal.fire({
              icon: "info",
              title: "Please Check your credentials",
            });
          }
        })
        .catch((err) =>
          Swal.fire({
            icon: "error",
            title: "Internal Server Error",
          })
        );
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
    //Validating Email
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    //Validating oldPassword
    if (!values.oldPassword) {
      errors.oldPassword = "Required";
    } else if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/i.test(
        values.oldPassword
      )
    ) {
      errors.oldPassword =
        "Password must Contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character";
      
    }

    //Validating newPassword
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

    //Validating confirmPassword
    if (!values.confirmPassword) {
      errors.confirmPassword = "Required";
    } else if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/i.test(
        values.confirmPassword
      )
    ) {
      errors.confirmPassword =
        "Password must Contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character";
      
    }

    return errors;
  }

  const formik = useFormik({
    initialValues, onSubmit, validate
  });


  return (
    <>
      <div className="loginForm">
        <div className="loginForm__wrapper">
          <div className="loginHeader">
            <LockResetIcon />
            <h3>Update Password</h3>
          </div>

          {/* Email  */}
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

            {/* Old Password  */}
            <TextField
              required
              value={formik.values.oldPassword}
              name="oldPassword"
              id="outlined-required"
              label="Old Password"
              type="password"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.oldPassword ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.oldPassword}
              </div>
            ) : null}

            {/* New Password  */}
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

            {/* confirm password  */}
            <TextField
              id="outlined-password-input"
              required
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              autoComplete="current-password"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.confirmPassword ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
            {formik.errors.confirmPassword ||
            formik.errors.oldPassword ||
            formik.errors.newPassword ||
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
          <div className="navBtn"></div>
        </div>
      </div>
    </>
  );
}

export default UpdatePassword;
