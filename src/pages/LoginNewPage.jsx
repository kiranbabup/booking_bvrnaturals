// LoginPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import companyLogo from "/bvrLogo.png";
import sendOtpimg from "/imgs/Loginicon.png";
import "../App.css";
import LsService, { storageKey } from "../services/localstorage";
import { layoutDarkGreenColor } from "../assets/contents";
import SnackbarCompo from "../components/SnackbarCompo";

const LoginNewPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackMode, setSnackMode] = useState("");

  const navigate = useNavigate();

  const user = LsService.getItem(storageKey);

  useEffect(() => {
    // console.log(user);
    if (user) {
      if (user.role === "bvr_super_admin") {
        navigate("/admin-dashboard");
      }
    } else {
      return;
    }
  }, [user, navigate]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const closeSnack = () => setSnackOpen(false);

  const handleLogin = () => {
    if (loginId === "BVRAdmin001" && password === "BVR001@Admin") {
      LsService.setItem(storageKey, {
        username: "BVR Admin",
        role: "bvr_super_admin",
      });
      setSnackMsg("Successfuly Logged In!");
      setSnackMode("success");
      setSnackOpen(true);
      navigate("/admin-dashboard");
    } else {
      setSnackMsg("Invalid Login ID or Password.");
      setSnackMode("error");
      setSnackOpen(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Box
        component="img"
        alt="Company Logo"
        src={companyLogo}
        sx={{
          width: "65px",
          cursor: "pointer",
          display: { md: "none", xs: "block" },
          pl: 2,
          paddingTop: "10px",
          position: "fixed",
          top: 0,
          left: 0,
        }}
        onClick={() => navigate("/")}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "start",
          height: "100vh",
          width: "100vw",
          backgroundColor: "#0f0f10",
        }}
      >
        {/* left */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box
              component="img"
              alt="Company Logo"
              src={companyLogo}
              sx={{
                width: "250px",
                // ml: 2,
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            />
          </Box>
        </Box>
        {/* right */}
        <Box
          sx={{
            width: { md: "50%" },
            p: { xs: 2, md: 0 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: { md: "#577fd8d9" },
            height: "100%",
          }}
        >
          <Box
            sx={{
              width: { md: "50%" },
              p: 2,
              bgcolor: "white",
              boxShadow: 2,
              borderRadius: "10px",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                alt="otp page"
                src={sendOtpimg}
                sx={{
                  //   width: "130px",
                  width: { xs: "100px", md: "130px" },
                  height: { xs: "110px", md: "140px" },
                  cursor: "pointer",
                }}
              />
            </Box>
            <Typography
              gutterBottom
              sx={{
                fontSize: { xs: "1.4rem", md: "2.5rem" },
                fontWeight: "bold",
                textAlign: "center",
                color: { md: layoutDarkGreenColor },
              }}
            >
              Login Now !
            </Typography>

            <TextField
              label="Login ID"
              variant="outlined"
              fullWidth
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 30,
                style: { textAlign: "center", fontWeight: "bold" },
                // sx: { color: { md: "white" } },
              }}
            />

            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 15,
                style: { textAlign: "center", fontWeight: "bold" },
                // sx: { color: { md: "white" } },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />

            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              type="submit"
              color="primary"
              fullWidth
              onClick={() => handleLogin()}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Box>
      <SnackbarCompo
        successSnackbarOpen={snackOpen}
        handleSnackbarClose={closeSnack}
        snackbarContent={snackMsg}
        snackbarMode={snackMode}
      />
    </Box>
  );
};

export default LoginNewPage;
