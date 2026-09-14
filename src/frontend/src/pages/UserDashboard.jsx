import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AcUnitIcon from "@mui/icons-material/AcUnitOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import AppLayout from "../components/AppLayout.jsx";
import AddShipmentModal from "../components/AddShipmentModal.jsx";
import ShipmentDetailsModal from "../components/ShipmentDetailsModal.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function StatCard({ label, value, sub, icon: Icon, accent, bgAccent }) {
  return (
    <Card
      sx={{
        p: 2.5,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${tokens.border}`,
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
        transition: "all 200ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 15px 30px -5px rgba(15, 23, 42, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 90,
          height: 90,
          borderRadius: "0 0 0 100%",
          bgcolor: bgAccent || "rgba(79, 70, 229, 0.04)",
          pointerEvents: "none",
        }}
      />
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Typography variant="caption" sx={{ textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary", fontWeight: 700 }}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: bgAccent || "rgba(79, 70, 229, 0.08)",
          }}
        >
          <Icon sx={{ fontSize: 20, color: accent || tokens.indigo }} />
        </Box>
      </Box>
      <Typography variant="h4" sx={{ mt: 1.5, fontWeight: 800, letterSpacing: "-0.02em" }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>
          {sub}
        </Typography>
      )}
    </Card>
  );
}

export default function UserDashboard() {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [disruptions, setDisruptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const loadUserData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [summaryRes, shipmentsRes, disruptionsRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getShipments(),
        api.getDisruptions(),
      ]);
      setData(summaryRes);
      setShipments(shipmentsRes);
      setDisruptions(disruptionsRes);
    } catch (err) {
      if (!silent) setError(err.message || "Failed to load user portal data");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    const interval = setInterval(() => {
      loadUserData(true);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleShipmentCreated = (newShipment) => {
    setShipments((prev) => [newShipment, ...prev]);
    loadUserData();
  };

  const handleShipmentDeleted = async (shipmentId) => {
    try {
      await api.deleteShipment(shipmentId);
      setSelectedShipment(null);
      setShipments((prev) => prev.filter((s) => s.shipmentId !== shipmentId));
      loadUserData();
    } catch (err) {
      alert("Failed to delete shipment: " + err.message);
    }
  };

  // Filter disruptions that directly intersect with this user's shipments
  const userRelevantDisruptions = (disruptions || []).filter((d) =>
    shipments.some(
      (s) =>
        s.origin === d.region ||
        s.destination === d.region ||
        s.currentLocation === d.region ||
        (Array.isArray(s.routeRegions) && s.routeRegions.includes(d.region))
    )
  );

  const totalValue = shipments.reduce((sum, s) => sum + (Number(s.cargoValueUsd) || 0), 0);
  const inTransitCount = shipments.filter((s) => s.status === "In Transit").length;
  const deliveredCount = shipments.filter((s) => s.status === "Delivered").length;
  const delayedCount = shipments.filter((s) => s.status === "Delayed").length;

  return (
    <AppLayout
      title="My Shipper Workspace"
      subtitle="Personal shipment tracking, manifest management, and active corridor intelligence"
    >
      {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

      {/* 1. Shipper Profile Banner & Quick Actions */}
      <Card
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          background: "linear-gradient(135deg, #0B1220 0%, #172554 100%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.18)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(ellipse at top right, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 58,
                height: 58,
                bgcolor: "linear-gradient(135deg, #4F46E5 0%, #14B8A6 100%)",
                fontSize: "1.25rem",
                fontWeight: 800,
                border: "2px solid rgba(255,255,255,0.2)",
                boxShadow: "0 8px 20px rgba(79,70,229,0.35)",
              }}
            >
              {(user?.name || "U")[0].toUpperCase()}
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff" }}>
                  {user?.name || "Verified Shipper"}
                </Typography>
                <Chip
                  icon={<ShieldOutlinedIcon sx={{ fontSize: 14, color: "#10B981 !important" }} />}
                  label="Shipper Account"
                  size="small"
                  sx={{
                    bgcolor: "rgba(16, 185, 129, 0.15)",
                    color: "#A7F3D0",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.25 }}>
                {user?.email} · Operational Hub: <strong>{user?.region || "US-West"}</strong>
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
            <Button
              variant="contained"
              onClick={async () => {
                await switchRole("admin");
                navigate("/dashboard");
              }}
              startIcon={<ShieldOutlinedIcon />}
              sx={{
                bgcolor: "#0052FF",
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.82rem",
                boxShadow: "0 4px 14px rgba(0, 82, 255, 0.4)",
                "&:hover": { bgcolor: "#0043D1" },
              }}
            >
              Switch to Admin Deck
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/copilot")}
              startIcon={<SmartToyOutlinedIcon />}
              sx={{
                color: "#E2E8F0",
                borderColor: "rgba(226, 232, 240, 0.25)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              Ask Bob AI
            </Button>
            <Button
              variant="contained"
              onClick={() => setAddModalOpen(true)}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                background: tokens.gradientPrimary,
                px: 2.5,
                py: 1,
                fontWeight: 700,
                boxShadow: "0 8px 24px rgba(79, 70, 229, 0.4)",
                "&:hover": { background: tokens.indigoDark },
              }}
            >
              Add Shipment
            </Button>
          </Stack>
        </Box>
      </Card>

      {/* 2. Personal Shipment KPIs */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="My Total Shipments"
            value={shipments.length}
            sub="Registered manifests"
            icon={LocalShippingIcon}
            accent={tokens.indigo}
            bgAccent="rgba(79, 70, 229, 0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="In-Transit Cargo"
            value={inTransitCount}
            sub="Actively moving"
            icon={LocalShippingIcon}
            accent={tokens.cyan}
            bgAccent="rgba(20, 184, 166, 0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Successfully Delivered"
            value={deliveredCount}
            sub="On-schedule arrivals"
            icon={CheckCircleOutlineIcon}
            accent={tokens.emerald}
            bgAccent="rgba(16, 185, 129, 0.08)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Total Cargo Value"
            value={`$${(totalValue / 1_000_000).toFixed(2)}M`}
            sub="Declared manifest value"
            icon={AttachMoneyIcon}
            accent={tokens.purple}
            bgAccent="rgba(139, 92, 246, 0.08)"
          />
        </Grid>
      </Grid>

      {/* 3. Disruption Alerts Relevant to User's Cargo */}
      {userRelevantDisruptions.length > 0 ? (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3, borderRadius: 2.5, border: "1px solid rgba(245, 158, 11, 0.3)" }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Attention: {userRelevantDisruptions.length} Active Disruption(s) Impacting Your Transit Corridors
          </Typography>
          <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {userRelevantDisruptions.map((d) => (
              <Chip
                key={d.disruptionId}
                label={`${d.region}: ${d.description} (${d.severity})`}
                size="small"
                color="warning"
                variant="outlined"
              />
            ))}
          </Box>
        </Alert>
      ) : (
        <Card sx={{ p: 2, mb: 3, bgcolor: tokens.emeraldSoft, border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircleOutlineIcon sx={{ color: tokens.emerald }} />
            <Typography variant="body2" sx={{ color: "#065F46", fontWeight: 600 }}>
              All your transit corridors are currently running clear. No active port strikes or severe weather impacting your shipments.
            </Typography>
          </Box>
        </Card>
      )}

      {/* 4. My Shipments Table & Management */}
      <Card sx={{ overflow: "hidden", border: `1px solid ${tokens.border}`, mb: 3 }}>
        <Box sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${tokens.border}` }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              My Active Shipments
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Only shipments registered by your account ({user?.email}) are listed below
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{ background: tokens.gradientPrimary }}
          >
            Add Shipment
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : shipments.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
            <LocalShippingIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No shipments created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 400, mx: "auto" }}>
              You don't have any shipments registered yet. Click the button below to add your first cargo manifest.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{ background: tokens.gradientPrimary }}
            >
              Create My First Shipment
            </Button>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Shipment ID</TableCell>
                  <TableCell>Corridor Route</TableCell>
                  <TableCell>Mode / Carrier</TableCell>
                  <TableCell>Cargo Type</TableCell>
                  <TableCell align="right">Value (USD)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>ETA</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shipments.map((s) => {
                  const statusCol =
                    s.status === "Delivered" ? "success" : s.status === "Delayed" ? "error" : "primary";
                  return (
                    <TableRow key={s.shipmentId} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color: tokens.indigo }}
                        >
                          {s.shipmentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.origin}</Typography>
                          <Box component="span" sx={{ color: "text.secondary", mx: 0.5 }}>→</Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.destination}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                          {s.mode} · {s.carrier}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Typography variant="body2">{s.cargoType}</Typography>
                          {s.isColdChain && (
                            <Chip icon={<AcUnitIcon sx={{ fontSize: 13 }} />} label="Cold" size="small" sx={{ height: 20, bgcolor: tokens.cyanSoft, color: "#0F766E", fontSize: "0.68rem" }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          ${(Number(s.cargoValueUsd) || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={s.status || "In Transit"} size="small" color={statusCol} sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {s.eta ? new Date(s.eta).toLocaleDateString() : "TBD"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => setSelectedShipment(s)}
                          sx={{ py: 0.25, fontSize: "0.75rem" }}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Card>

      {/* Add Shipment Modal */}
      <AddShipmentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreated={handleShipmentCreated}
      />

      {/* Shipment Details Modal */}
      <ShipmentDetailsModal
        shipment={selectedShipment}
        open={Boolean(selectedShipment)}
        onClose={() => setSelectedShipment(null)}
        onDelete={handleShipmentDeleted}
        disruptions={disruptions}
      />
    </AppLayout>
  );
}
