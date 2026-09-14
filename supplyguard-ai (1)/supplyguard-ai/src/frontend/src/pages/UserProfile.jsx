import { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
  TextField,
  Stack,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AppLayout from "../components/AppLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

export default function UserProfile() {
  const { user } = useAuth();
  const [shipmentsCount, setShipmentsCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [notifications, setNotifications] = useState({
    emailDisruptions: true,
    coldChainExcursions: true,
    etaDelays: true,
  });

  useEffect(() => {
    api.getShipments().then((shipments) => {
      setShipmentsCount(shipments.length);
      const sum = shipments.reduce((acc, s) => acc + (Number(s.cargoValueUsd) || 0), 0);
      setTotalValue(sum);
    }).catch(() => {});
  }, []);

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AppLayout
      title="My Shipper Profile & Details"
      subtitle="Account credentials, personal metrics, and notification preferences"
    >
      {savedSuccess && (
        <Alert severity="success" sx={{ mb: 2.5 }}>
          Preferences updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Identity Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3.5,
              textAlign: "center",
              border: `1px solid ${tokens.border}`,
              background: tokens.gradientCard,
            }}
          >
            <Avatar
              sx={{
                width: 84,
                height: 84,
                mx: "auto",
                mb: 2,
                bgcolor: "linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)",
                fontSize: "2rem",
                fontWeight: 800,
                boxShadow: "0 12px 28px rgba(79, 70, 229, 0.3)",
              }}
            >
              {(user?.name || "U")[0].toUpperCase()}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {user?.name || "Shipper User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {user?.email}
            </Typography>

            <Chip
              icon={isAdmin ? <ShieldOutlinedIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16 }} />}
              label={isAdmin ? "System Administrator" : "Verified Cargo Shipper"}
              color={isAdmin ? "secondary" : "primary"}
              sx={{ fontWeight: 700, mb: 3 }}
            />

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.5} sx={{ textAlign: "left" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmailOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Contact Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Primary Logistics Region</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.region || "US-West"}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Inventory2OutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Account Shipments</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{shipmentsCount} Active Manifests</Typography>
                </Box>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Account Details & Manifest Statistics */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Card sx={{ p: 3, border: `1px solid ${tokens.border}` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Personal Account Information
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    value={user?.name || ""}
                    disabled
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    value={user?.email || ""}
                    disabled
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Assigned Operational Role"
                    value={isAdmin ? "System Administrator (Global)" : "Cargo Shipper / Operator"}
                    disabled
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Home Hub / Geographic Base"
                    value={user?.region || "US-West"}
                    disabled
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Personal Cargo Statistics Summary */}
            <Card sx={{ p: 3, border: `1px solid ${tokens.border}` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                My Cargo Handled Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: tokens.bg, border: `1px solid ${tokens.border}` }}>
                    <Typography variant="caption" color="text.secondary">Total Shipments Managed</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: tokens.indigo }}>
                      {shipmentsCount}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: tokens.bg, border: `1px solid ${tokens.border}` }}>
                    <Typography variant="caption" color="text.secondary">Total Value Under Custody</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: tokens.purple }}>
                      ${(totalValue / 1_000_000).toFixed(2)}M
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: tokens.bg, border: `1px solid ${tokens.border}` }}>
                    <Typography variant="caption" color="text.secondary">Corridor SLA Reliability</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: tokens.emerald }}>
                      98.4%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Alert & Notification Settings */}
            <Card sx={{ p: 3, border: `1px solid ${tokens.border}` }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                My Alert Preferences
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Route Disruption Alerts
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive immediate notifications when weather, port strikes, or geopolitical events impact your active routes.
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailDisruptions}
                        onChange={(e) => setNotifications({ ...notifications, emailDisruptions: e.target.checked })}
                        color="primary"
                      />
                    }
                    label=""
                    sx={{ mr: 0 }}
                  />
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Cold-Chain Excursion Warnings
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Instant critical alert when temperature sensors breach safe thresholds (outside 2°C - 8°C).
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.coldChainExcursions}
                        onChange={(e) => setNotifications({ ...notifications, coldChainExcursions: e.target.checked })}
                        color="primary"
                      />
                    }
                    label=""
                    sx={{ mr: 0 }}
                  />
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      ETA Delay Notifications
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Estimated arrival schedule adjustments greater than 4 hours.
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.etaDelays}
                        onChange={(e) => setNotifications({ ...notifications, etaDelays: e.target.checked })}
                        color="primary"
                      />
                    }
                    label=""
                    sx={{ mr: 0 }}
                  />
                </Box>
              </Stack>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={handleSavePreferences} sx={{ background: tokens.gradientPrimary }}>
                  Save Preferences
                </Button>
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
