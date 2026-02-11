import { Box, IconButton, Tooltip, Typography } from "@mui/material"
import OutputIcon from '@mui/icons-material/Output';
import { useNavigate } from "react-router-dom";
import { storageKey } from "../services/localstorage";

const LogoutButtonComp = () => {
    const navigate = useNavigate();

    const onLogoutClick = () => {
        localStorage.removeItem(storageKey);
        navigate('/bvr-login');
    };

    return (
        <Box>
            <IconButton onClick={() => onLogoutClick()} sx={{
                "&:hover": {
                    color: "gray",
                },
            }}>
                <Typography sx={{
                    fontWeight: "bold",

                }}>Logout</Typography>
                <Tooltip title="Logout" placement="bottom" arrow>
                    <OutputIcon fontSize="large" />
                </Tooltip>
            </IconButton>
        </Box>
    )
}
export default LogoutButtonComp;