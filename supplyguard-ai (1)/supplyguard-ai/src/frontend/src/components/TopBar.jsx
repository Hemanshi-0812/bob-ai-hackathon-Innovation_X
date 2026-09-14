import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Tooltip, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { useAuth } from "../context/AuthContext.jsx";
import { DRAWER_WIDTH } from "./Sidebar.jsx";
import { tokens } from "../theme.js";

function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TopBar({ title, subtitle }) {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
        bgcolor: "rgba(248,250,252,0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${tokens.border}`,
        color: tokens.text,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "72px !important", px: { xs: 2, md: 4 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ lineHeight: 1.25 }} noWrap>{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
          {user && (
            <>
              <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1.25 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: tokens.indigoSoft,
                    color: tokens.indigo,
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                  }}
                >
                  {initials(user.name || user.email || "U")}
                </Avatar>
                <Box sx={{ lineHeight: 1.2 }}>
                  <Typography sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>{user.name}</Typography>
                  <Typography sx={{ fontSize: "0.6875rem", color: "text.secondary" }}>{user.email}</Typography>
                </Box>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" }, my: 1.5 }} />
            </>
          )}
          <Tooltip title="Log out">
            <IconButton
              onClick={logout}
              size="small"
              sx={{ border: `1px solid ${tokens.border}`, "&:hover": { bgcolor: tokens.redSoft, borderColor: "#FECACA" } }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
