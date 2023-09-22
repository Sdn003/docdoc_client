import axios from "axios";
import "./CreateAppointment.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import env from "react-dotenv";
import {  useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../HomePage/Header";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
} from "@mui/material";
import image_url from "../../components/multimedia/cardImages/createAppointment.jpg";

function ScheduleAppointment() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loader, setLoader] = useState();
  let [doctor, setDoctor] = useState([]);
  let [patient, setPatient] = useState([]);
  let [filteredPatient, setFilteredPatient] = useState([]);
  const [specialityType, setSpecialityType] = useState([]);

  //Verifying the Session
  useEffect(() => {
    getSpecialityData();
    getAllPatient();
    let userdata = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata);
    setName(userdata.name);
    if (!localStorage.getItem("authId")) {
      navigate("/Login");
    } else if (localStorage.getItem("authId") === "undefined") {
      navigate("/Login");
    }
  }, []);


  //Getting All Patients
  const getAllPatient = async() => {
      try {
        setLoader(true);
        await axios.get(env.API_URL + "AllPatients").then(async (res) => {
          if (res.data.patientDataFetched === true) {
            let patientData = await res.data.patientData;
            setPatient(patientData);
            setLoader(false);
          }
        }).catch(err => {
          setLoader(false);
          Swal.fire({
            icon: "error",
            title: "Error Occurred",
          });
        })
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "OOPS! Internal Server Error",
        });
      }
  
  }

  //Getting One Patient Based on Email
  const getPatient = async(param) => {
    try {
      setLoader(true);
        let email = param;
        await axios
          .get(env.API_URL + "Patient/" + email)
          .then(async (res) => {
            let patientData = await res.data.patientData;
            if (patientData) {
              setFilteredPatient(patientData);
              setLoader(false);
            } else {
              setFilteredPatient(patientData);
              setLoader(false);
            }
          })
          .catch((err) =>{
            setLoader(false);
            Swal.fire({
              icon: "error",
              title: "Internal Server Error",
            })
    })
        
  }
    catch (error) {
        Swal.fire({
          icon: "error",
          title: "OOPS! Internal Server Error",
          text: error
        });
    }
  }

  //Getting the Speciality Types
  const getSpecialityData = async () => {
    try {
      setLoader(true);
      await axios.get(env.API_URL + "Speciality").then((res) => {
        setSpecialityType(res.data.doc);
        setLoader(false);
      });
    } catch (error) {
      setLoader(false);
      Swal.fire({
        icon: "error",
        title: "OOPS! Internal Server Error",
      });
    }
  };

  //Getting the Doctors list
  const getDoctor = async (param) => {
    try {
      setLoader(true);
      let speciality = param;
      await axios
        .get(env.API_URL + "Doctor/" + speciality)
        .then(async (res) => {
          if (res.data.doctor) {
            setDoctor(res.data.doctor);
            setLoader(false);
          } else {
            setDoctor(res.data.doctor);
            setLoader(false);
          }
        })
        .catch((err) => {
          setLoader(false);
          Swal.fire({
            icon: "error",
            title: "Internal Server Error",
          })
    });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Internal Server Error",
      });
    }
  };

  //Initializing Values for Formik
  const initialValues = {
    patientName: '',
    email : '',
    mobile : '',
    date: "",
    time: "",
    doctorName: "",
    specializedIn: "",
  };
  const onSubmit = async (formData, { resetForm }) => {
    try {
      setLoader(true);
      await axios
        .post(env.API_URL + "CreateAppointment", formData)
        .then(async (res) => {
          if (res.data.successCreate === true) {
            setLoader(false);
            Swal.fire({
              icon: "success",
              title: res.data.message,
            });
            navigate("/AppointmentList");
          } else {
            setLoader(false);
            Swal.fire({
              icon: "info",
              title: res.data.message,
            });
          }
        }).catch((err) => {
          setLoader(false);
          Swal.fire({
            icon: "error",
            title: "Internal Server Error",
          })
        })
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

    //Validating email
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    } else if (values.email) {
      getPatient(values.email);
    }
    //Validating patientName
    if (!values.patientName) {
      errors.patientName = "Required";
    } else if (values.patientName.length < 3) {
      errors.patientName = "Patient Name should be Minimum 3 of Characters";
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
              <h3 className="addWrapper__h3">Schedule Appointment</h3>
              <div className="addFormContainer">
                {/* E-Mail */}
                <FormControl className="textField">
                  <InputLabel id="demo-simple-select-helper-label" required>
                    E-Mail
                  </InputLabel>
                  <Select
                    className="emailEditAppointment"
                    name="email"
                    labelId="demo-simple-select-helper-label"
                    value={formik.values.email}
                    label="E-Mail"
                    onChange={formik.handleChange}
                  >
                    {patient.map((data, index) => {
                      return (
                        <MenuItem
                          value={data.email}
                          key={index}
                          className="emailEditAppointment"
                        >
                          {data.email}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.email}
                  </div>
                ) : null}

                {/* Patient Name  */}
                <FormControl className="textField">
                  <InputLabel id="demo-simple-select-helper-label" required>
                    Patient Name
                  </InputLabel>
                  <Select
                    className="specialityType"
                    name="patientName"
                    labelId="demo-simple-select-helper-label"
                    value={formik.values.patientName}
                    label="Patient Name"
                    onChange={formik.handleChange}
                  >
                    {filteredPatient.map((data, index) => {
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
                {formik.touched.patientName && formik.errors.patientName ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.patientName}
                  </div>
                ) : null}

                {/* Mobile  */}
                <FormControl className="textField">
                  <InputLabel id="demo-simple-select-helper-label" required>
                    Mobile
                  </InputLabel>
                  <Select
                    className="specialityType"
                    name="mobile"
                    labelId="demo-simple-select-helper-label"
                    value={formik.values.mobile}
                    label="Mobile"
                    onChange={formik.handleChange}
                  >
                    {filteredPatient.map((data, index) => {
                      return (
                        <MenuItem
                          value={data.mobile}
                          key={index}
                          className="specialityType"
                        >
                          {data.mobile}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {formik.touched.mobile && formik.errors.mobile ? (
                  <div style={{ color: "crimson" }}>{formik.errors.mobile}</div>
                ) : null}

                {/* Medication Type  */}
                <FormControl className="textField">
                  <InputLabel id="demo-simple-select-helper-label" required>
                    Medication Type
                  </InputLabel>
                  <Select
                    className="specialityType"
                    name="specializedIn"
                    labelId="demo-simple-select-helper-label"
                    value={formik.values.specializedIn}
                    label="Medication Type "
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
                {formik.touched.specializedIn && formik.errors.specializedIn ? (
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
                {formik.touched.doctorName && formik.errors.doctorName ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.doctorName}
                  </div>
                ) : null}

                {/* Date Picker  */}
                <div className="form-group my-3">
                  <label htmlFor="date">Choose a Date</label>
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
                {formik.touched.date && formik.errors.date ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.date}
                  </div>
                ) : null}

                {/* Time Picker  */}
                <div className="form-group my-3">
                  <label htmlFor="time">Choose a time</label>
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
                {formik.touched.time && formik.errors.time ? (
                  <div style={{ color: "crimson" }} className="validatorText">
                    {formik.errors.time}
                  </div>
                ) : null}

                {/* Disabling Submit Button  */}
                {formik.errors.patientName ||
                formik.errors.doctorName ||
                formik.errors.email ||
                formik.errors.mobile ||
                formik.errors.specializedIn ||
                formik.errors.date ||
                formik.errors.time ? (
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
        </>
      )}
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default ScheduleAppointment;
