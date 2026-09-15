import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useAuth } from "../context/AuthContext.jsx";
import { useColorTheme } from "../context/ThemeContext.jsx";
import { DRAWER_WIDTH } from "./Sidebar.jsx";
import { tokens } from "../theme.js";
import { useNavigate } from "react-router-dom";

function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TopBar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useColorTheme();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
        bgcolor: tokens.topbarBg,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${tokens.border}`,
        color: tokens.text,
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "74px !important", px: { xs: 2, md: 3.5 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.02em" }} noWrap>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block", mt: 0.35 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0 }}>
          {user && (
            <>

              <Box
                onClick={() => navigate("/profile")}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 1.25,
                  background: "rgba(79,70,229,0.04)",
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 2,
                  px: 1.25,
                  py: 0.6,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": { bgcolor: "rgba(79,70,229,0.08)", borderColor: tokens.indigo },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: tokens.gradientPrimary,
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                  }}
                >
                  {initials(user.name || user.email || "U")}
                </Avatar>
                <Box sx={{ lineHeight: 1.2 }}>
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 700 }}>{user.name}</Typography>
                  <Typography sx={{ fontSize: "0.65rem", color: "text.secondary" }}>{user.email}</Typography>
                </Box>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" }, my: 1.5 }} />
            </>
          )}

          {/* Homepage Button */}
          <Tooltip title="Go to Public Homepage">
            <IconButton
              onClick={() => navigate("/")}
              size="small"
              sx={{
                border: `1px solid ${tokens.border}`,
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
                color: "#0052FF",
                transition: "all 160ms ease",
                "&:hover": {
                  bgcolor: "#EFF6FF",
                  borderColor: "#0052FF",
                },
              }}
            >
              <HomeOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Theme Toggle Button */}
          <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{
                border: `1px solid ${tokens.border}`,
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
                color: isDark ? "#FDE047" : tokens.indigo,
                transition: "all 160ms ease",
                "&:hover": {
                  bgcolor: isDark ? "rgba(253, 224, 71, 0.15)" : tokens.indigoSoft,
                  borderColor: isDark ? "#FDE047" : tokens.indigo,
                },
              }}
            >
              {isDark ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Log out */}
          <Tooltip title="Log out">
            <IconButton
              onClick={logout}
              size="small"
              sx={{
                border: `1px solid ${tokens.border}`,
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)",
                color: tokens.text,
                "&:hover": { bgcolor: tokens.redSoft, borderColor: "rgba(239, 68, 68, 0.4)", color: tokens.red },
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
