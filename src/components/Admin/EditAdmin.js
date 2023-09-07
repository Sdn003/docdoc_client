import React, {  useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import image_url from "../../components/multimedia/Add/admin.jpg";
import Header from "../HomePage/Header";
import env from "react-dotenv";
import { Box, Button, TextField, Toolbar } from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";

function EditAdmin() {
  const navigate = useNavigate();
  const [ nme, setName] = useState("");
    const params = useParams();
const location = useLocation();
const { name,  email, password, imageURL } = location.state;

  useEffect(() => {
    let userdata = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata);
    setName(userdata.name);
    if (!localStorage.getItem("authId")) {
      navigate("/Login");
    } else if (localStorage.getItem("authId") === "undefined") {
      navigate("/Login");
    }
  }, []);

  const initialValues = {
    name,
    email,
    password,
    imageURL,
  };

  const onSubmit = async (formData, { resetForm }) => {
    try {
      await axios.put(env.API_URL + "EditAdmin/" + params.id , formData).then(async (res) => {
        if (res.data.AdminEditSuccess === true) {
          Swal.fire({
            icon: "success",
            title: res.data.message,
          });
          resetForm();
        } else  {
          Swal.fire({
            icon: "info",
            title: res.data.message,
            text: `${res.data.error.keyValue.email} - already exists for another Admin`
          });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Internal Server Error",
      });
      setTimeout(() => {
        navigate("/AdminList");
      }, 2500);
    }
  };

  const validate = (values) => {
    let errors = {};

    //Validating name
    if (!values.name) {
      errors.name = "Required";
    } else if (values.name.length < 3) {
      errors.name = "Name should be Minimum of 3 Characters";
    } else if (values.name.length > 34) {
      errors.name = "Name should be Maximum of 34 Characters";
    }

    //Validating email
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    //Validating password
    if (!values.password) {
      errors.password = "Required";
    } else if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/i.test(
        values.password
      )
    ) {
      errors.password =
        "Password must Contain atleast 1 uppercase, 1 lowercase, 1 number and 1 special character";
      
    }

    //Validating Image URL

    return errors;
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  return (
    <>
      <Header altLetter={nme[0]} moduleName=" | Edit Admin" />
      <Box component="main" sx={{ p: 0.5 }}>
        <Toolbar />
      </Box>
      <div className="addContainer">
        <div className="addWrapper">
          <h3 className="addWrapper__h3">Edit Admin</h3>
          <div className="addFormContainer">
            {/* Name  */}
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
            {formik.errors.name ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.name}
              </div>
            ) : null}

            {/* Email  */}
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

            {/* Password  */}
            <TextField
              required
              value={formik.values.password}
              name="password"
              id="outlined-required"
              label="Password"
              type="password"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.password ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.password}
              </div>
            ) : null}

            {/* Image URL */}
            <TextField
              name="imageURL"
              value={formik.values.imageURL}
              id="outlined-required"
              label="Image URL"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.imageURL ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.imageURL}
              </div>
            ) : null}

            {/* Disabling Submit Button  */}
            {formik.errors.name || formik.errors.email ? (
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
          <div
            className="addImageContainer"
            style={{
              backgroundImage: "url(" + image_url + ")",
            }}
          ></div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default EditAdmin;
