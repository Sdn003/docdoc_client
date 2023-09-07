import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Avatar, Menu, MenuItem } from "@mui/material";
import stethescope from "../multimedia/stethescope.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

function Header(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    let userdata = localStorage.getItem("userdata");
    userdata = JSON.parse(userdata);
    setImageURL(userdata.imageURL);
  }, []);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate(); 
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <div>
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        {/* Sidebar Logo Name  */}
        <Typography variant="h6" sx={{ my: 2 }} className="logoNameSidebar">
          DocDoc
          <img src={stethescope} alt="stethescope" className="logoImage" />
        </Typography>

        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Home" onClick={() => navigate("/Home")} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="Menu" onClick={() => navigate("/Cards")} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* For Changing nav bar backgroundColor  */}
        <AppBar component="nav" style={{ backgroundColor: "#c01c7b" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {/* Responsible for the title  */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              className="logoName"
            >
              <span className="logoDocDoc" onClick={() => navigate("/Home")}>
                DocDoc
                <img
                  src={stethescope}
                  alt="stethescope"
                  className="logoImage"
                />
              </span>
              <span className="moduleName">{props.moduleName}</span>
            </Typography>

            {/* Avatar Menu Bar  */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate("/Profile", {state : { image: props.altLetter}})}>Profile</MenuItem>
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("authId");
                  Swal.fire({
                    icon: "success",
                    text: "User Logged Out Successfully",
                  });
                  navigate("/Login");
                }}
              >
                Logout
              </MenuItem>
            </Menu>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button
                className="nav_nav_btn"
                onClick={() => navigate("/Home")}
                sx={{ color: "#fff" }}
              >
                Home
              </Button>
              <Button
                className="nav_nav_btn"
                onClick={() => navigate("/Cards")}
                sx={{ color: "#fff" }}
              >
                Menu
              </Button>
            </Box>

            {/* Avatar Button */}
            <IconButton onClick={handleMenu} className="nav_nav_btn">
              {imageURL ? (
                <>
                  <Avatar
                    src={imageURL}
                    alt={props.altLetter}
                    className="avatar"
                  />
                </>
              ) : (
                <>
                  <Avatar src="/" alt={props.altLetter} className="avatar" />
                </>
              )}
            </IconButton>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
    </>
  );
}

export default Header;
