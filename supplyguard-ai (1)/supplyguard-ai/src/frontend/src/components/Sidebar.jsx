import { NavLink, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import WarningIcon from "@mui/icons-material/ReportProblemOutlined";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import AltRouteIcon from "@mui/icons-material/AltRouteOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import AcUnitIcon from "@mui/icons-material/AcUnitOutlined";
import SmartToyIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useAuth } from "../context/AuthContext.jsx";
import { useColorTheme } from "../context/ThemeContext.jsx";
import { tokens } from "../theme.js";

const DRAWER_WIDTH = 264;

const USER_NAV_SECTIONS = [
  {
    label: "Shipper Workspace",
    items: [
      { to: "/dashboard", label: "My Hub / Overview", icon: DashboardIcon },
      { to: "/shipments", label: "My Shipments", icon: InventoryIcon },
      { to: "/coldchain", label: "Cold-Chain Telemetry", icon: AcUnitIcon },
    ],
  },
  {
    label: "AI Intelligence",
    items: [
      { to: "/copilot", label: "Bob Cargo Assistant", icon: SmartToyIcon },
    ],
  },
  {
    label: "Shipper Details",
    items: [
      { to: "/profile", label: "My Profile & Settings", icon: PersonOutlineIcon },
    ],
  },
];

const ADMIN_NAV_SECTIONS = [
  {
    label: "Executive Center",
    items: [
      { to: "/dashboard", label: "Executive Dashboard", icon: DashboardIcon },
    ],
  },
  {
    label: "Global Operations",
    items: [
      { to: "/shipments", label: "All Network Shipments", icon: InventoryIcon },
      { to: "/disruptions", label: "Disruption Radar", icon: WarningIcon },
      { to: "/risk-analysis", label: "Lane Risk Analysis", icon: InsightsIcon },
      { to: "/rerouting", label: "AI Rerouting Engine", icon: AltRouteIcon },
    ],
  },
  {
    label: "Assets & IoT",
    items: [
      { to: "/fleet", label: "Fleet & Redeployment", icon: LocalShippingIcon },
      { to: "/coldchain", label: "Cold-Chain Fleet Telemetry", icon: AcUnitIcon },
    ],
  },
  {
    label: "AI Intelligence",
    items: [
      { to: "/copilot", label: "Bob AI Copilot", icon: SmartToyIcon },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/profile", label: "Admin Profile", icon: PersonOutlineIcon },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark } = useColorTheme();
  const isAdmin = user?.role === "admin";

  const visibleNav = isAdmin ? ADMIN_NAV_SECTIONS : USER_NAV_SECTIONS;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          background: isDark ? "linear-gradient(180deg, #090E17 0%, #0F172A 100%)" : "#FFFFFF",
          borderRight: isDark ? "1px solid rgba(148, 163, 184, 0.12)" : "1px solid #E2E8F0",
          color: isDark ? "#E2E8F0" : "#0A192F",
          boxShadow: isDark ? "18px 0 40px rgba(15, 23, 42, 0.25)" : "4px 0 24px rgba(0, 82, 255, 0.04)",
        },
      }}
    >
      {/* Brand Header - Clickable to return to Homepage */}
      <Box
        component={NavLink}
        to="/"
        sx={{
          px: 2.5,
          py: 2.75,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          textDecoration: "none",
          color: "inherit",
          borderBottom: isDark ? "1px solid rgba(148, 163, 184, 0.1)" : "1px solid #E2E8F0",
          transition: "background-color 150ms ease",
          "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC" },
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="SupplyGuard AI Logo"
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            objectFit: "contain",
            filter: "drop-shadow(0 4px 10px rgba(0, 82, 255, 0.25))",
            flexShrink: 0,
            transition: "transform 200ms ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        />
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography sx={{ color: isDark ? "#fff" : "#0A192F", fontWeight: 900, fontSize: "0.95rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            SupplyGuard <Box component="span" sx={{ color: "#0052FF" }}>AI</Box>
          </Typography>
          <Typography sx={{ color: isDark ? "#94A3B8" : "#64748B", fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.02em" }}>
            Global Fleet &amp; Freight Defense
          </Typography>
          <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
            <Chip
              icon={isAdmin ? <ShieldOutlinedIcon sx={{ fontSize: "11px !important", color: "#0052FF !important" }} /> : <PersonOutlineIcon sx={{ fontSize: "11px !important", color: "#0284C7 !important" }} />}
              label={isAdmin ? "System Admin" : "Shipper User"}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.02em",
                bgcolor: "#EFF6FF",
                color: "#0052FF",
                border: "1px solid rgba(0, 82, 255, 0.25)",
                px: 0.25,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation Sections */}
      <Box sx={{ px: 2, py: 2, overflowY: "auto", flexGrow: 1 }}>
        {visibleNav.map((section, si) => (
          <Box key={section.label} sx={{ mb: si === visibleNav.length - 1 ? 0 : 2.5 }}>
            <Typography
              sx={{
                px: 1.5,
                mb: 0.75,
                color: isDark ? "#64748B" : "#94A3B8",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {section.label}
            </Typography>
            <List sx={{ py: 0 }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || (item.to === "/dashboard" && (location.pathname === "/" || location.pathname === "/dashboard"));
                return (
                  <ListItemButton
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    end={item.to === "/dashboard"}
                    disableRipple
                    sx={{
                      borderRadius: 2,
                      mb: 0.35,
                      py: 0.9,
                      px: 1.5,
                      color: isActive ? (isDark ? "#fff" : "#0052FF") : (isDark ? "#94A3B8" : "#475569"),
                      bgcolor: isActive ? (isDark ? "rgba(0, 82, 255, 0.2)" : "#EFF6FF") : "transparent",
                      border: isActive ? `1px solid ${isDark ? "rgba(0, 82, 255, 0.4)" : "rgba(0, 82, 255, 0.25)"}` : "1px solid transparent",
                      boxShadow: isActive ? "0 4px 12px rgba(0, 82, 255, 0.15)" : "none",
                      transition: "all 160ms ease",
                      "&:hover": {
                        bgcolor: isActive ? (isDark ? "rgba(0, 82, 255, 0.25)" : "#E0E7FF") : (isDark ? "rgba(148, 163, 184, 0.08)" : "#F8FAFC"),
                        color: isDark ? "#fff" : "#0052FF",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
                      <Icon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: "0.84rem", fontWeight: isActive ? 700 : 500 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
