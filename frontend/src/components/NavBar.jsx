import {
  Box,
  Typography,
  Button,
  Avatar,
  Stack
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import {
  useAuth
} from "../context/AuthContext";

function Navbar() {

  const { logout } = useAuth();

  return (

    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: "260px", // Same as sidebar width
        right: 0,
        height: "60px",

        bgcolor: "#ffffff",

        borderBottom: "1px solid #e5e7eb",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        px: 3,

        zIndex: 1200,

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.05)"
      }}
    >

      {/* Left Section */}

      <Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: "#1e293b",
            lineHeight: 1.2
          }}
        >
          AI Disaster Management
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#64748b"
          }}
        >
          Real-Time Monitoring & Response Platform
        </Typography>

      </Box>

      {/* Right Section */}

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >

        <Box
          sx={{
            cursor: "pointer",
            color: "#64748b"
          }}
        >
          <NotificationsNoneIcon />
        </Box>

        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#2563eb"
          }}
        >
          A
        </Avatar>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            borderRadius: 2,
            textTransform: "none"
          }}
        >
          Logout
        </Button>

      </Stack>

    </Box>

  );
}

export default Navbar;