import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";
import { tokens } from "../theme.js";

export default function AppLayout({ title, subtitle, actions, children }) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: tokens.bodyGradient,
        color: tokens.text,
      }}
    >
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minHeight: "100vh", minWidth: 0 }}>
        <TopBar title={title} subtitle={subtitle} />
        <Toolbar sx={{ minHeight: "78px !important" }} />
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 2.5, md: 3.5 },
            maxWidth: 1600,
            mx: "auto",
          }}
        >
          {actions && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>{actions}</Box>
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
}
