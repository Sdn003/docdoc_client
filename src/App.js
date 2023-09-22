import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import Login from './components/LoginPage/Login';
import Homepage from './components/HomePage/Homepage';
import Signup from './components/SignupPage/Signup';
import Forgetpassword from './components/ForgetPassword/Forgetpassword';
import LoginSignUpPage from './components/LoginPage/LoginSignUpPage';
import UpdatePassword from './components/UpdatePassword/UpdatePassword';
import Card from './components/Cards.js/Card';
import AddDoctor from './components/Doctor/AddDoctor';
import AddPatient from "./components/Patient/AddPatient";
import DoctorList from './components/DoctorList/DoctorList';
import PatientList from './components/PatientList/PatientList'
import CreateAppointment from './components/Appointment/CreateAppointment'
import AddAdmin from './components/Admin/AddAdmin';
import EditPatient from './components/Patient/EditPatient';
import ErrorBoundary from './ErrorBoundary';
import ScheduleAppointment from './components/Appointment/ScheduleAppointment';
import EditDoctor from './components/Doctor/EditDoctor';
import AppointmentList from './components/AppointmentList/AppointmentList';
import EditAppointment from './components/Appointment/EditAppointment';
import AdminList from './components/Admin/AdminList';
import EditAdmin from './components/Admin/EditAdmin';
import Profile from './components/HomePage/Profile';
import { useEffect, useState } from 'react';
import FavoriteIcon from "@mui/icons-material/Favorite";


function App() {
 
  // const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

   useEffect(() => {
     if (localStorage.getItem("authId")){
      setLoggedIn(true);
     }
   }, []);



  return (
    <>
      <Router>
        <Routes>
          {loggedIn ? (
            <>
              <Route path="/" element={<Homepage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LoginSignUpPage />} />
            </>
          )}
          <Route path="/Home" element={<Homepage />} />
          <Route path="/LoginSignUpPage" element={<LoginSignUpPage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Cards" element={<Card />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/ForgetPassword" element={<Forgetpassword />} />
          <Route path="/UpdatePassword" element={<UpdatePassword />} />
          <Route
            path="/AddDoctor"
            element={
              <ErrorBoundary>
                <AddDoctor />
              </ErrorBoundary>
            }
          />
          <Route
            path="/AddPatient"
            element={
              <ErrorBoundary>
                <AddPatient />
              </ErrorBoundary>
            }
          />
          <Route
            path="/DoctorList"
            element={
              <ErrorBoundary>
                <DoctorList />
              </ErrorBoundary>
            }
          />
          <Route
            path="/PatientList"
            element={
              <ErrorBoundary>
                <PatientList />
              </ErrorBoundary>
            }
          />
          <Route
            path="/CreateAppointment"
            element={
              <ErrorBoundary>
                <CreateAppointment />
              </ErrorBoundary>
            }
          />
          <Route
            path="/ScheduleAppointment"
            element={
              <ErrorBoundary>
                <ScheduleAppointment />
              </ErrorBoundary>
            }
          />
          <Route
            path="/AddAdmin"
            element={
              <ErrorBoundary>
                <AddAdmin />
              </ErrorBoundary>
            }
          />
          <Route
            path="/EditPatient/:id"
            element={
              <ErrorBoundary>
                <EditPatient />
              </ErrorBoundary>
            }
          />
          <Route
            path="/EditDoctor/:id"
            element={
              <ErrorBoundary>
                <EditDoctor />
              </ErrorBoundary>
            }
          />
          <Route
            path="/AppointmentList"
            element={
              <ErrorBoundary>
                <AppointmentList />
              </ErrorBoundary>
            }
          />
          <Route
            path="/EditAppointment/:id"
            element={
              <ErrorBoundary>
                <EditAppointment />
              </ErrorBoundary>
            }
          />
          <Route
            path="/AdminList"
            element={
              <ErrorBoundary>
                <AdminList />
              </ErrorBoundary>
            }
          />
          <Route
            path="/EditAdmin/:id"
            element={
              <ErrorBoundary>
                <EditAdmin />
              </ErrorBoundary>
            }
          />
          <Route
            path="/Profile"
            element={
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            }
          />
        </Routes>
      </Router>
      <div className="signature">
        Created with&nbsp;
        <FavoriteIcon style={{ color: "crimson", fontSize: "medium" }} />
        &nbsp;by&nbsp;<span className="sdn">Sudharsan S</span>
      </div>
    </>
  );
}

export default App;
