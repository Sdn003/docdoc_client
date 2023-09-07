import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../HomePage/Header";
import { useNavigate } from "react-router-dom";
import { Box, Toolbar, Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import env from "react-dotenv";
import axios from "axios";
import { Delete } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton, Button } from "@mui/material";

function AdminList() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loader, setLoader] = useState();
  let [data, setData] = useState([]);

  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 500);
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

  //Getting Admin in the list
  const getData = async () => {
    try {
      await axios.get(env.API_URL + "AllAdmins").then(async (res) => {
        if (res.data.successFetch === true) {
          let adminData = await res.data.adminData;
          setData(adminData);
        }
      });
    } catch (error) {
      
      Swal.fire({
        icon: "error",
        title: "OOPS! Internal Server Error",
        text: "Reloading the Web Page",
      });
    }
  };

  //Deleting a Admin
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
            await axios
              .delete(env.API_URL + "DeleteAdmin/" + id)
              .then((res) => {
                if (res.data.successDelete === true) {
                  swalWithBootstrapButtons.fire({
                    icon: "success",
                    title: res.data.message,
                  });
                  getData();
                } else {
                  Swal.fire({
                    icon: "info",
                    title: res.data.message,
                  });
                }
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire("Cancelled", "error");
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
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "email",
      headerName: "E-Mail",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        // let { name, adminId, email, mobile, imageURL } = params.row;
        let id = params.row._id;
        return (
          <>
            {/* Edit Button  */}
            {/* <Tooltip title="Edit" arrow>
              <IconButton
                className="iconBtn__list"
                onClick={() => {
                  navigate("/EditAdmin/" + id, {
                    state: {
                      name,
                      email,
                      imageURL,
                    },
                  });
                }}
              >
                <Edit className="iconBtn__list" />
              </IconButton>
            </Tooltip> */}

            {/* Delete Button  */}
            <Tooltip title="Edit" arrow>
              <IconButton
                className="iconBtn__list"
                onClick={() => {
                  deleteHandler(id);
                }}
              >
                <Button
                  startIcon={<Delete />}
                  className="textField"
                  color="error"
                  variant="contained"
                  // style={{ backgroundColor: " #ff4d4d", color: "white" }}
                >
                  Delete
                </Button>
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <>
      {loader ? (
        <>
          <div className="loader">
            <CircularProgress color="secondary" />
          </div>
        </>
      ) : (
        <>
          <Header altLetter={name[0]} moduleName=" | Admin List" />
          <Box component="main" sx={{ p: 0.5 }}>
            <Toolbar />
          </Box>
          <div className="tableContainer">
            <h3 className="addWrapper__h3">Admin List</h3>
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

export default AdminList;
