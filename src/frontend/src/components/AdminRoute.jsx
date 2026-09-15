import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Box, Card, Typography, Button } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AppLayout from "./AppLayout.jsx";
import { tokens } from "../theme.js";
import { useNavigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <AppLayout title="Admin Operational Module" subtitle="Restricted to Enterprise Logistics Administrators">
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            maxWidth: 580,
            mx: "auto",
            mt: 6,
            border: `1px solid ${tokens.border}`,
            boxShadow: "0 20px 40px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: tokens.amberSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2.5,
            }}
          >
            <ShieldOutlinedIcon sx={{ fontSize: 32, color: tokens.amber }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Admin Operations Only
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.6 }}>
            This operations module (Fleet Redeployment, Global Disruption Radar, and Network AI Rerouting) is reserved for system administrators.
            Your shipper workspace provides personalized shipment tracking, cargo manifests, and cold-chain telemetry.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/dashboard")}
              sx={{ background: tokens.gradientPrimary, px: 3, fontWeight: 800 }}
            >
              Return to My Workspace
            </Button>
          </Box>
        </Card>
      </AppLayout>
    );
  }

  return children;
}
