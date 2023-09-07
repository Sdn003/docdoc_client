import React, { Fragment, useEffect, useState } from "react";
import "./AddDoctor.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import image_url from "../../components/multimedia/Add/AddDoc.jpg";
import Header from "../HomePage/Header";
import env from "react-dotenv";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";

function EditDoctor() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const params = useParams();
   const location = useLocation();
   const {
     firstName,
     lastName,
     email,
     age,
     regNo,
     mobile,
     yearsOfExp,
     specializedIn,
     consultationFee,
   } = location.state;
     const [specialityType, setSpecialityType] = useState([]);
    
  useEffect(() => {
    getData();
    let userdata = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata);
    setName(userdata.name);
    if (!localStorage.getItem("authId")) {
      navigate("/Login");
    } else if (localStorage.getItem("authId") === "undefined") {
      navigate("/Login");
    }
  }, []);

  //Initializing Values for Formik
  const initialValues = {
    firstName,
    lastName,
    email,
    age,
    regNo,
    mobile,
    yearsOfExp,
    specializedIn,
    consultationFee,
  };

  //Getting Speciality Data
  const getData = async () => {
    try {
      await axios.get(env.API_URL + "Speciality").then((res) => {
        setSpecialityType(res.data.doc);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Internal Server Error",
      });
    }
  };


  //Submitting the form
  const onSubmit = async (formData, { resetForm }) => {
      try {
        await axios
          .put(env.API_URL + "EditDoctor/" + params.id, formData)
          .then(async (res) => {
            if (res.data.doctorEditSuccess === true) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
              });
              navigate("/DoctorList");
              resetForm();
            } else {
              Swal.fire({
                icon: "info",
                title: res.data.message,
                text:res.data.error
              });
            }
          });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Internal Server Error",
          text: "Redirecting to the Doctor List",
        });
        setTimeout(() => {
          navigate("/DoctorList");
        }, 2500);
      }
  };

  //Validate Function for Formik
  const validate = (values) => {
    let errors = {};

    //Validating firstName
    if (!values.firstName) {
      errors.firstName = "Required";
    } else if (values.firstName.length < 3) {
      errors.firstName = "Firstname should be Minimum 3 of Characters";
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
    } else if (
      !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i.test(
        values.mobile
      )
    ) {
      errors.mobile = "Invalid Mobile Number";
    }

    //Validating regNo
    if (!values.regNo) {
      errors.regNo = "Required";
    } else if (!/^[0-9]*$/i.test(values.regNo)) {
      errors.regNo = "Only Numbers are Allowed";
    }

    //Validating yearsOfExp
    if (!values.yearsOfExp) {
      errors.yearsOfExp = "Required";
    } else if (!/^[0-9]*$/i.test(values.yearsOfExp)) {
      errors.yearsOfExp = "Only Numbers are Allowed";
    } else if (
      !/^(2?[1-9]|[1-9][0-9]|[1][1-9][1-9]|40)$/i.test(values.yearsOfExp)
    ) {
      errors.yearsOfExp = "Experience Should be between 2 and 40";
    }

    //Validating specializedIn
    if (!values.specializedIn) {
      errors.specializedIn = "Required";
    }

    // Validating consultationFee
    if (!values.consultationFee) {
      errors.consultationFee = "Required";
    } else if (!/^[0-9]*$/i.test(values.regNo)) {
      errors.consultationFee = "Only Numbers are Allowed";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  return (
    <>
      <Header altLetter={name[0]} moduleName=" | Edit Doctor" />
      <Box component="main" sx={{ p: 0.5 }}>
        <Toolbar />
      </Box>
      <div className="addContainer">
        <div className="addWrapper">
          <h3 className="addWrapper__h3">Edit Doctor</h3>
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
            {formik.errors.firstName ? (
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
            {formik.errors.lastName ? (
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
            {formik.errors.email ? (
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
            {formik.errors.age ? (
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
            {formik.errors.mobile ? (
              <div style={{ color: "crimson" }}>{formik.errors.mobile}</div>
            ) : null}
            {/* Reg No */}
            <TextField
              required
              name="regNo"
              value={formik.values.regNo}
              id="outlined-required"
              label="Registration Number"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.regNo ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.regNo}
              </div>
            ) : null}

            {/* Year of Experience  */}
            <TextField
              required
              name="yearsOfExp"
              value={formik.values.yearsOfExp}
              id="outlined-required"
              label="Experience in Years"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.yearsOfExp ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.yearsOfExp}
              </div>
            ) : null}

            {/* Specialized In  */}
            <FormControl className="textField">
              <InputLabel id="demo-simple-select-helper-label" required>
                Specialized In
              </InputLabel>
              <Select
                className="specialityType"
                name="specializedIn"
                labelId="demo-simple-select-helper-label"
                value={formik.values.specializedIn}
                label="Specialized In"
                onChange={formik.handleChange}
              >
                {specialityType.map((data, index) => {
                  return (
                    <MenuItem
                      value={data.specialityType}
                      key={index}
                      className="specialityType"
                    >
                      {data.specialityType}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {formik.errors.specializedIn ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.specializedIn}
              </div>
            ) : null}

            {/* Consultation Fee */}
            <TextField
              required
              name="consultationFee"
              value={formik.values.consultationFee}
              id="outlined-required"
              label="Consultation Fee"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.errors.consultationFee ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.consultationFee}
              </div>
            ) : null}

            {/* Disabling Submit Button  */}
            {formik.errors.firstName ||
            formik.errors.lastName ||
            formik.errors.email ||
            formik.errors.mobile ||
            formik.errors.age ||
            formik.errors.regNo ||
            formik.errors.yearsOfExp ||
            formik.errors.specializedIn ||
            formik.errors.consultationFee ? (
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

export default EditDoctor;

