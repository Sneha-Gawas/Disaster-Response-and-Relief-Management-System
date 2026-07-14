import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import {
  Link,
  useLocation
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />
    },
    ...(isAdmin
      ? [
          {
            text: "Hotspots",
            path: "/hotspots",
            icon: <WarningAmberIcon />
          },
          {
            text: "Anomalies",
            path: "/anomalies",
            icon: <AnalyticsIcon />
          },
          {
            text: "Resources",
            path: "/resources",
            icon: <InventoryIcon />
          },
          {
            text: "Funds",
            path: "/funds",
            icon: <AccountBalanceWalletIcon />
          },
]
      : []),
    {
      text: "Profile",
      path: "/profile",
      icon: <PersonIcon />
    },
    {
      text: "Volunteers",
      path: "/volunteers",
      icon: <GroupsIcon />
    },
    {
      text: "Organizations",
      path: "/organizations",
      icon: <BusinessIcon />
    },
    {
      text: "Operations",
      path: "/operations",
      icon: <AssignmentTurnedInIcon />
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          background: "linear-gradient(180deg,#0f172a,#1e293b)",
          color: "#fff",
          borderRight: "none"
        }
      }}
    >
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Disaster AI
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Management System
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.15)" }} />

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,
              "&.Mui-selected": {
                backgroundColor: "#2563eb",
                color: "#fff"
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#1d4ed8"
              },
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)"
              }
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.15)" }} />

        <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
          Disaster Response Platform
        </Typography>

        <Typography variant="caption" display="block" align="center" sx={{ opacity: 0.5 }}>
          AI + ML + Analytics
        </Typography>
      </Box>
    </Drawer>
  );
}

export default Sidebar;