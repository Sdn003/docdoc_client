import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../HomePage/Header";
import { useNavigate } from "react-router-dom";
import { Box, Toolbar, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import env from "react-dotenv";
import axios from "axios";
import { Delete, Edit } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton } from "@mui/material";

function AppointmentList() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loader, setLoader] = useState();
  let [data, setData] = useState([]);

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

  //Getting Appointment in the list
  const getData = async () => {
    try {
      setLoader(true);
      await axios.get(env.API_URL + "Appointment").then(async (res) => {
        if (res.data.successFetch === true) {
          let appointmentData = await res.data.appointmentData;
          setData(appointmentData);
          setLoader(false);
        }
      }).catch((err) => {
        setLoader(false);
        Swal.fire({
          icon:"error",
          title:"Error Occurred"
        })
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "OOPS! Internal Server Error",
        text: "Reloading the Web Page",
      });
    }
  };

  //Deleting a Appointment
  const deleteHandler = async (id) => {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
             setLoader(true);
            await axios
              .delete(env.API_URL + "DeleteAppointment/" + id)
              .then((res) => {
                if (res.data.successDelete === true) {
                  setLoader(false);
                  swalWithBootstrapButtons.fire({
                    icon: "success",
                    title: res.data.message,
                  });
                  getData();
                } else {
                  setLoader(false);
                  Swal.fire({
                    icon: "info",
                    title: res.data.message,
                  });
                }
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire("Cancelled");
          }
        });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Internal Server Error",
      });
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "patientName", headerName: "Patient Name", flex: 1 },
    {
      field: "email",
      headerName: "Patient E-Mail",
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Patient Mobile",
      flex: 1,
    },
    {
      field: "doctorName",
      headerName: "Doctor Name",
      flex: 1,
    },
    {
      field: "specializedIn",
      headerName: "Medication Type",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => {
        let {
          patientName,
          email,
          mobile,
          doctorName,
          specializedIn,
          date,
          time,
        } = params.row;
        let id = params.row._id;
        return (
          <>
            {/* Edit Button  */}
            <Tooltip title="Edit" arrow>
              <IconButton
                className="iconBtn__list"
                onClick={() => {
                  navigate("/EditAppointment/" + id, {
                    state: {
                      patientName,
                      email,
                      mobile,
                      doctorName,
                      specializedIn,
                      date,
                      time,
                    },
                  });
                }}
              >
                <Edit className="iconBtn__list" />
              </IconButton>
            </Tooltip>

            {/* Delete Button  */}
            <Tooltip title="Delete" arrow>
              <IconButton
                className="iconBtn__list"
                onClick={() => {
                  deleteHandler(id);
                }}
              >
                <Delete className="iconBtn__list" />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Header altLetter={name[0]} moduleName=" | Appointment List" />
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
        
          <div className="tableContainer">
            <h3 className="addWrapper__h3">Appointment List</h3>
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                className="dataGrid"
                rows={data}
                getRowId={(row) => row._id}
                columns={columns}
                sortingOrder={["desc", "asc"]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 50,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 50]}
                disableColumnMenu
              />
            </Box>
          </div>
        </>
      )}
    </>
  );
}

export default AppointmentList;
