import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { storageKey } from "../../services/localstorage";
import SnackbarCompo from "../../components/SnackbarCompo";
import LogoutButtonComp from "../../components/LogoutButtonComp.jsx";
import companyLogo from "/bvrLogo.png";
import AdminBillingPage from "./AdminBillingPage.jsx";

const AdminDashboard = () => {
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackMode, setSnackMode] = useState("success");

  const navigate = useNavigate();

  const closeSnack = () => setSnackOpen(false);

  const user = localStorage.getItem(storageKey);

  useEffect(() => {
    if (!user) {
      LsService.removeItem(storageKey);
      navigate("/bvr-login");
    }
  }, [user, navigate]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f0f10", color: "#fff", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          component="img"
          alt="Company Logo"
          src={companyLogo}
          sx={{
            width: "50px",
          }}
        />
        <Box sx={{ backgroundColor: "white", borderRadius: "20px" }}>
          <LogoutButtonComp />
        </Box>
      </Box>
      <Box py={1}>
        <h3 style={{ textAlign: "center", marginBottom:"5px" }}>Welcome to Admin Dashboard</h3>
        {/* table here */}
        <AdminBillingPage />
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

export default AdminDashboard;
