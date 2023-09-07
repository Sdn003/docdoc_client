import React, { Fragment, useEffect, useState } from 'react';
import './Card.css'
import { useNavigate } from 'react-router-dom';
import admin from '../multimedia/cardImages/addAdmin.png';
import doctor from "../multimedia/cardImages/addDoc.png";
import patient from '../multimedia/cardImages/patientAdd.jpg';
import docList from '../multimedia/cardImages/doctorList.jpg'
import patientList from '../multimedia/cardImages/patientLists.jpg'
import appointment from '../multimedia/cardImages/createAppointment.jpg'
import appointmentList from '../multimedia/cardImages/appointmentlist.jpg'
import adminList from '../multimedia/cardImages/adminList.jpg'
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Box, Toolbar } from '@mui/material';
import Header from '../HomePage/Header';

function Card() {

    let cardData = [
      {
        description: "add doctor",
        image: doctor,
        route: "AddDoctor",
      },
      {
        description: "add patient",
        image: patient,
        route: "AddPatient",
      },
      {
        description: "doctor list",
        image: docList,
        route: "DoctorList",
      },
      {
        description: "patient list",
        image: patientList,
        route: "PatientList",
      },
      {
        description: "schedule appointment",
        image: appointment,
        route: "ScheduleAppointment",
      },
      {
        description: "Appointment List",
        image: appointmentList,
        route: "AppointmentList",
      },
      {
        description: "add admin",
        image: admin,
        route: "AddAdmin",
      },
      {
        description: "admin list",
        image: adminList,
        route: "AdminList",
      },
    ];
    const navigate = useNavigate();
   const [name, setName] = useState("");

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

  return (
    <>
      <Header altLetter={name[0]} />
      <Box component="main" sx={{ p: 0.5 }}>
        <Toolbar />
      </Box>

      <div className="cardWrapper">
        {cardData.map((cardData, index) => {
          return (
            <Fragment key={index}>
              <div
                className="cardContainer"
                style={{ backgroundImage: "url(" + cardData.image + ")" }}
                onClick={() => navigate(`/${cardData.route}`)}
              >
                {" "}
                <LocalHospitalIcon />
                &nbsp;
                {cardData.description}
              </div>
            </Fragment>
          );
        })}
      </div>
    </>
  );
    
}

export default Card