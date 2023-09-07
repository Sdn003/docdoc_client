import axios from 'axios';
import './CreateAppointment.css'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import env from 'react-dotenv';
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import Header from '../HomePage/Header';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Toolbar } from '@mui/material';
import image_url from "../../components/multimedia/Add/admin.jpg";

function CreateAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  let [doctor, setDoctor] = useState([]);

  const [specialityType, setSpecialityType] = useState([]);

  //Verifying the Session
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

    let { firstName, lastName, email, mobile } = location.state;

    //Getting the Speciality Types
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

    //Getting the Doctors list
    const getDoctor = async (param) => {
      try {
        let speciality = param;
        await axios
          .get(env.API_URL + "Doctor/" + speciality)
          .then(async (res) => {
            if (res.data.doctor) {
              setDoctor(res.data.doctor);
            } else {
              setDoctor(res.data.doctor);
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
        });
      }
    };

    //Initializing Values for Formik
    const initialValues = {
      patientName: firstName + " " + lastName,
      email,
      mobile,
      date: "",
      time: "",
      doctorName: "",
      specializedIn: "",
    };
    const onSubmit = async (formData, { resetForm }) => {
      try {
        await axios
          .post(env.API_URL + "CreateAppointment", formData)
          .then(async (res) => {
            if (res.data.successCreate === true) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
              });
              resetForm();
              navigate("/AppointmentList");
            } else {
              Swal.fire({
                icon: "info",
                title: res.data.message,
              });
            }
          });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Internal Server Error",
        });
      }
    };
    //Validate Function for Formik
    const validate = (values) => {
      let errors = {};
      //Validating patientName
      if (!values.patientName) {
        errors.patientName = "Required";
      } else if (values.patientName.length < 3) {
        errors.patientName = "Patient Name should be Minimum 3 of Characters";
      }

      //Validating email
      if (!values.email) {
        errors.email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
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

      //Validating doctorName
      if (!values.doctorName) {
        errors.doctorName = "Required";
      }

      //Validating specializedIn
      if (!values.specializedIn) {
        errors.specializedIn =
          "Required, Eg : Try Choosing 'Family Physician' as Speciality ";
      } else if (values.specializedIn) {
        getDoctor(values.specializedIn);
      }

      //Validating date
      if (!values.date) {
        errors.date = "Required";
      }

      //Validating time
      if (!values.time) {
        errors.time = "Required";
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
      <Header altLetter={name[0]} moduleName=" | Schedule Appointment" />
      <Box component="main" sx={{ p: 0.5 }}>
        <Toolbar />
      </Box>
      <div className="addContainer">
        <div className="addWrapper">
          <h3 className="addWrapper__h3">Schedule Appointment</h3>
          <div className="addFormContainer">
            {/* Patient Name  */}
            <TextField
              required
              name="patientName"
              value={formik.values.patientName}
              id="outlined-required"
              label="Patient Name"
              className="textField"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              disabled
            />
            {formik.errors.patientName ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.patientName}
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
              disabled
            />
            {formik.errors.email ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.email}
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
              disabled
            />
            {formik.errors.mobile ? (
              <div style={{ color: "crimson" }}>{formik.errors.mobile}</div>
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

            {/* docTorName  */}
            <FormControl className="textField">
              <InputLabel id="demo-simple-select-helper-label" required>
                Choose Doctor
              </InputLabel>
              <Select
                className="specialityType"
                name="doctorName"
                labelId="demo-simple-select-helper-label"
                value={formik.values.doctorName}
                label="Doctor Name"
                onChange={formik.handleChange}
              >
                {doctor.map((data, index) => {
                  return (
                    <MenuItem
                      value={data.firstName + " " + data.lastName}
                      key={index}
                      className="specialityType"
                    >
                      {data.firstName + " " + data.lastName}
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

            {/* Date Picker  */}
            <div className="form-group my-3">
              <label htmlFor="time">Choose a time:</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                style={{ fontSize: "20px", backgroundColor: "whitesmoke" }}
                value={formik.values.date}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.date ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.date}
              </div>
            ) : null}

            {/* Time Picker  */}
            <div className="form-group my-3">
              <label htmlFor="time">Choose a time:</label>
              <input
                type="time"
                id="time"
                name="time"
                className="form-control"
                style={{ fontSize: "20px", backgroundColor: "whitesmoke" }}
                value={formik.values.time}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.time ? (
              <div style={{ color: "crimson" }} className="validatorText">
                {formik.errors.time}
              </div>
            ) : null}

            {/* Disabling Submit Button  */}
            {formik.errors.firstName ||
            formik.errors.lastName ||
            formik.errors.email ||
            formik.errors.mobile ||
            formik.errors.doctorName ||
            formik.errors.date ||
            formik.errors.time ||
            formik.errors.specializedIn ? (
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

export default CreateAppointment