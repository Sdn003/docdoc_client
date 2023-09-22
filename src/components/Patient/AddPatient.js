import React, { useEffect, useState } from 'react';
import './AddPatient.css'
import { useNavigate } from 'react-router-dom';
import Header from '../HomePage/Header';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
} from "@mui/material";
import { useFormik } from 'formik';
import axios from 'axios';
import Swal from 'sweetalert2';
import env from "react-dotenv";

function AddPatient() {
     const navigate = useNavigate();
     const [name, setName] = useState("");
     const [loader, setLoader] = useState();

     
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
       firstName : '' ,
       lastName : '' ,
       email : '' ,
       age : '' ,
       mobile : '' ,
       healthInsurance : '' ,
       ailments : '' ,
     };

     const onSubmit = async(formData, {resetForm}) => {
        try {
          setLoader(true)
          await axios.post(env.API_URL + "AddPatient", formData)
          .then(async(res) => {
            if (res.data.patientCreateSuccess === true){
              setLoader(false);
              Swal.fire({
                icon : "success",
                title: "Patient Added Successfully"
              })
              resetForm();
              navigate('/PatientList');
            }
            else if (res.data.patientCreateSuccess === false) {
              setLoader(false);
               Swal.fire({
                 icon: "info",
                 title: "Entered Patient Already Exists",
               });
            }
            else{
              setLoader(false);
              Swal.fire({
                icon: "info",
                title: res.data.message,
              });
            }

          })
        } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Internal Server Error",
            });
        }
     }

     const validate = (values) => {
       let errors = {};

       //Validating firstName
       if (!values.firstName) {
         errors.firstName = "Required";
       } else if (values.firstName.length < 3) {
         errors.firstName = "Firstname should be Minimum of 3 Characters";
       } else if (values.firstName.length > 34) {
         errors.firstName = "Firstname should be Maximum of 34 Characters";
       }

       //Validating lastName
       if (!values.lastName) {
         errors.lastName = "Required";
       } else if (values.lastName.length < 1) {
         errors.lastName = "Lastname should be Minimum of 1 Characters";
       } else if (values.lastName.length > 34) {
         errors.lastName = "Lastname should be Maximum of 34 Characters";
       }

       //Validating email
       if (!values.email) {
         errors.email = "Required";
       } else if (
         !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
       ) {
         errors.email = "Invalid email address";
       }

       //Validating age
       if (!values.age) {
         errors.age = "Required";
       } else if (!/^[0-9]*$/i.test(values.age)) {
         errors.age = "Only Numbers are Allowed";
       } else if (!/^(12[0-7]|1[01][0-9]|[1-9]?[0-9])$/i.test(values.age)) {
         errors.age = "Age Should be between 1 and 127 or Remove '0' at the Start";
       }

       //Validating mobile
       if (!values.mobile) {
         errors.mobile = "Required";
       } 
       else if (
         !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i.test(
           values.mobile
         )
       ) {
         errors.mobile = "Invalid Mobile Number";
       }

       //Validating ailments
       if (!values.ailments) {
         errors.ailments = "Required";
       }
       return errors;
     }

     const formik = useFormik({
      initialValues,
      onSubmit,
      validate
     })
 
  return (
    <>
      <Header altLetter={name[0]} moduleName=" | Add Patient" />
      <Box component="main" sx={{ p: 0.5 }}>
        <Toolbar />
      </Box>
      {loader ? (
        <>
          <div className="loader">
            <CircularProgress color="secondary" />
          </div>
        </>
      ) : (
        <>
          <div className="addContainer">
            <div className="addWrapper">
              <h3 className="addWrapper__h3">Add Patient</h3>
              <div className="addFormContainer">
                {/* Firstname  */}
                <TextField
                  required
                  name="firstName"
                  value={formik.values.firstName}
                  id="outlined-required"
                  label="Firstname"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.firstName}
                  </div>
                ) : null}

                {/* Lastname  */}
                <TextField
                  required
                  name="lastName"
                  value={formik.values.lastName}
                  id="outlined-required"
                  label="Lastname"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.lastName}
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
                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.email}
                  </div>
                ) : null}

                {/* Age */}
                <TextField
                  required
                  name="age"
                  value={formik.values.age}
                  id="outlined-required"
                  label="Age"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.age && formik.errors.age ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.age}
                  </div>
                ) : null}

                {/* Mobile  */}
                <TextField
                  required
                  name="mobile"
                  value={formik.values.mobile}
                  id="outlined-required"
                  label="Mobile"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.mobile && formik.errors.mobile ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.mobile}
                  </div>
                ) : null}

                {/* Health Insurance Dropdown  */}
                <FormControl className="textField">
                  <InputLabel id="demo-simple-select-helper-label">
                    Health Insurance
                  </InputLabel>
                  <Select
                    className="specialityType"
                    labelId="demo-simple-select-helper-label"
                    name="healthInsurance"
                    label="Health Insurance"
                    value={formik.values.healthInsurance}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  >
                    {["Yes", "No"].map((data, index) => {
                      return (
                        <MenuItem
                          value={data}
                          key={index}
                          className="specialityType"
                        >
                          {data}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                {/* Ailments  */}
                <TextField
                  required
                  name="ailments"
                  value={formik.values.ailments}
                  id="outlined-required"
                  label="Ailments"
                  className="textField"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
                {formik.touched.ailments && formik.errors.ailments ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.ailments}
                  </div>
                ) : null}

                {formik.errors.firstName ||
                formik.errors.lastName ||
                formik.errors.email ||
                formik.errors.mobile ||
                formik.errors.age ||
                formik.errors.ailments ? (
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
              <div className="addImageContainer"></div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddPatient