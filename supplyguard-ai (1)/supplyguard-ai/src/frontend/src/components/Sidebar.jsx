import { NavLink, useLocation } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import WarningIcon from "@mui/icons-material/ReportProblemOutlined";
import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import AltRouteIcon from "@mui/icons-material/AltRouteOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import AcUnitIcon from "@mui/icons-material/AcUnitOutlined";
import SmartToyIcon from "@mui/icons-material/SmartToyOutlined";
import { tokens } from "../theme.js";

const DRAWER_WIDTH = 264;

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ to: "/", label: "Executive Dashboard", icon: DashboardIcon }],
  },
  {
    label: "Operations",
    items: [
      { to: "/shipments", label: "Shipments", icon: InventoryIcon },
      { to: "/disruptions", label: "Disruption Map", icon: WarningIcon },
      { to: "/risk-analysis", label: "Risk Analysis", icon: InsightsIcon },
      { to: "/rerouting", label: "AI Rerouting", icon: AltRouteIcon },
    ],
  },
  {
    label: "Assets",
    items: [
      { to: "/fleet", label: "Fleet & Redeployment", icon: LocalShippingIcon },
      { to: "/coldchain", label: "Cold-Chain Monitoring", icon: AcUnitIcon },
    ],
  },
  {
    label: "Intelligence",
    items: [{ to: "/copilot", label: "Bob AI Copilot", icon: SmartToyIcon }],
  },
];

export default function Sidebar() {
  const location = useLocation();

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
          bgcolor: tokens.navy,
          borderRight: "none",
          color: "#E2E8F0",
        },
      }}
    >
      <Box sx={{ px: 3, py: 3, display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: tokens.indigo,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShieldOutlinedIcon sx={{ fontSize: 19, color: "#fff" }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9375rem", lineHeight: 1.2 }}>
            SupplyGuard AI
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: "0.6875rem", lineHeight: 1.3 }}>
            Command Center
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box sx={{ px: 2, py: 2, overflowY: "auto", flexGrow: 1 }}>
        {NAV_SECTIONS.map((section, si) => (
          <Box key={section.label} sx={{ mb: si === NAV_SECTIONS.length - 1 ? 0 : 2.5 }}>
            <Typography
              sx={{
                px: 1.5,
                mb: 0.75,
                color: "#64748B",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {section.label}
            </Typography>
            <List sx={{ py: 0 }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
                return (
                  <ListItemButton
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    end={item.to === "/"}
                    disableRipple
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.25,
                      py: 0.875,
                      px: 1.5,
                      color: isActive ? "#fff" : "#CBD5E1",
                      bgcolor: isActive ? "rgba(79,70,229,0.9)" : "transparent",
                      transition: "background-color 120ms ease, color 120ms ease",
                      "&:hover": {
                        bgcolor: isActive ? "rgba(79,70,229,0.95)" : "rgba(255,255,255,0.06)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
                      <Icon sx={{ fontSize: 19 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: "0.8375rem", fontWeight: isActive ? 600 : 500 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <Box sx={{ px: 3, py: 2 }}>
        <Typography sx={{ color: "#475569", fontSize: "0.6875rem" }}>
          Industry Problem Statement L2 · IBM Bob
        </Typography>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
