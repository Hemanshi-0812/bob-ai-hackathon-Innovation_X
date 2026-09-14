import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Stack,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import AcUnitIcon from "@mui/icons-material/AcUnitOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { tokens } from "../theme.js";

export default function ShipmentDetailsModal({ shipment, open, onClose, onDelete, disruptions = [] }) {
  if (!shipment) return null;

  // Check if any active disruption affects this shipment
  const relevantDisruption = (disruptions || []).find(
    (d) =>
      d.region === shipment.origin ||
      d.region === shipment.destination ||
      d.region === shipment.currentLocation ||
      (Array.isArray(shipment.routeRegions) && shipment.routeRegions.includes(d.region))
  );

  const statusColor =
    shipment.status === "Delivered"
      ? "success"
      : shipment.status === "Delayed"
      ? "error"
      : "primary";

  const deadlineMs = shipment.deadlineAt ? new Date(shipment.deadlineAt).getTime() : null;
  const etaMs = shipment.eta ? new Date(shipment.eta).getTime() : null;
  const slackHours = deadlineMs && etaMs && !isNaN(deadlineMs) && !isNaN(etaMs)
    ? Math.round((deadlineMs - etaMs) / (1000 * 60 * 60))
    : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          p: 0,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          border: `1px solid ${tokens.border}`,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${tokens.border}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              bgcolor: tokens.indigoSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalShippingIcon sx={{ color: tokens.indigo, fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"JetBrains Mono", monospace' }}>
              {shipment.shipmentId}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Carrier: {shipment.carrier || "DHL"} · Mode: {shipment.mode || "truck"}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 2.5,
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#F1F5F9" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#CBD5E1", borderRadius: "3px" },
        }}
      >
        {/* Status and Priority badges */}
        <Stack direction="row" spacing={1} sx={{ mb: 2.5 }}>
          <Chip label={shipment.status || "In Transit"} color={statusColor} size="small" sx={{ fontWeight: 700 }} />
          {shipment.priority && (
            <Chip label={`${shipment.priority} Priority`} variant="outlined" size="small" />
          )}
          {shipment.isColdChain && (
            <Chip
              icon={<AcUnitIcon sx={{ fontSize: 14 }} />}
              label="Cold Chain Monitored"
              color="info"
              size="small"
              sx={{ bgcolor: tokens.cyanSoft, color: "#0F766E", fontWeight: 700 }}
            />
          )}
        </Stack>

        {/* Route Visualizer */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            bgcolor: tokens.bg,
            border: `1px solid ${tokens.border}`,
            mb: 2.5,
          }}
        >
          <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary", letterSpacing: "0.06em" }}>
            Transit Corridor
          </Typography>
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            {/* Origin Node */}
            <Box sx={{ textAlign: "center", zIndex: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#fff", border: `2px solid ${tokens.indigo}`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 0.5 }}>
                <PlaceIcon sx={{ fontSize: 18, color: tokens.indigo }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{shipment.origin}</Typography>
              <Typography variant="caption" color="text.secondary">Origin</Typography>
            </Box>

            {/* Connecting line with transit pulse */}
            <Box sx={{ flex: 1, height: 4, bgcolor: tokens.borderStrong, mx: 2, position: "relative", borderRadius: 2 }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: shipment.status === "Delivered" ? "100%" : "60%",
                  height: "100%",
                  background: tokens.gradientPrimary,
                  borderRadius: 2,
                }}
              />
            </Box>

            {/* Destination Node */}
            <Box sx={{ textAlign: "center", zIndex: 1 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: shipment.status === "Delivered" ? tokens.emeraldSoft : "#fff", border: `2px solid ${shipment.status === "Delivered" ? tokens.emerald : tokens.textMuted}`, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 0.5 }}>
                {shipment.status === "Delivered" ? (
                  <CheckCircleIcon sx={{ fontSize: 18, color: tokens.emerald }} />
                ) : (
                  <PlaceIcon sx={{ fontSize: 18, color: tokens.textMuted }} />
                )}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{shipment.destination}</Typography>
              <Typography variant="caption" color="text.secondary">Destination</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px dashed ${tokens.borderStrong}`, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Current Waypoint: <strong>{shipment.currentLocation || shipment.origin}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hours in transit: <strong>{shipment.hoursElapsed || 0}h</strong>
            </Typography>
          </Box>
        </Box>

        {/* Disruption Alert if affected */}
        {relevantDisruption && (
          <Alert
            severity="warning"
            icon={<WarningAmberIcon />}
            sx={{ mb: 2.5, borderRadius: 2 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Active Corridor Disruption: {relevantDisruption.type.replace("_", " ").toUpperCase()} ({relevantDisruption.region})
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              {relevantDisruption.description} · Severity: <strong>{relevantDisruption.severity}</strong>
            </Typography>
          </Alert>
        )}

        {/* SLA & Transit Timeline Specs */}
        <Box
          sx={{
            p: 2,
            mb: 2.5,
            borderRadius: 2.5,
            bgcolor: "rgba(79, 70, 229, 0.04)",
            border: `1px solid rgba(79, 70, 229, 0.15)`,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: tokens.indigo, letterSpacing: "0.06em" }}>
              SLA Delivery & Deadline Metrics
            </Typography>
            {slackHours !== null && (
              <Chip
                size="small"
                label={
                  slackHours < 0
                    ? `SLA Breach: -${Math.abs(slackHours)}h`
                    : slackHours <= 12
                    ? `Tight Buffer: +${slackHours}h slack`
                    : `Safe Buffer: +${slackHours}h slack`
                }
                sx={{
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  bgcolor:
                    slackHours < 0
                      ? "rgba(239, 68, 68, 0.15)"
                      : slackHours <= 12
                      ? "rgba(245, 158, 11, 0.15)"
                      : "rgba(16, 185, 129, 0.15)",
                  color:
                    slackHours < 0 ? "#DC2626" : slackHours <= 12 ? "#D97706" : "#059669",
                  border: `1px solid ${
                    slackHours < 0
                      ? "rgba(239, 68, 68, 0.3)"
                      : slackHours <= 12
                      ? "rgba(245, 158, 11, 0.3)"
                      : "rgba(16, 185, 129, 0.3)"
                  }`,
                }}
              />
            )}
          </Box>
          <Grid container spacing={1.5}>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary">Contract Deadline</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25, fontSize: "0.82rem" }}>
                {shipment.deadlineAt ? new Date(shipment.deadlineAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary">Estimated ETA</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25, fontSize: "0.82rem" }}>
                {shipment.eta ? new Date(shipment.eta).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" color="text.secondary">Transit Elapsed</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.25, fontSize: "0.82rem", color: tokens.indigo }}>
                {shipment.hoursElapsed || 0} hours
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Cargo Specification Grid */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: "#fff", border: `1px solid ${tokens.border}` }}>
              <Typography variant="caption" color="text.secondary">Cargo Classification</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>{shipment.cargoType}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: "#fff", border: `1px solid ${tokens.border}` }}>
              <Typography variant="caption" color="text.secondary">Declared Value</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5, color: tokens.indigo }}>
                ${(shipment.cargoValueUsd || 0).toLocaleString()} USD
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: "#fff", border: `1px solid ${tokens.border}` }}>
              <Typography variant="caption" color="text.secondary">Estimated Arrival (ETA)</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
                {shipment.eta ? new Date(shipment.eta).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Pending"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ p: 1.75, borderRadius: 2, bgcolor: "#fff", border: `1px solid ${tokens.border}` }}>
              <Typography variant="caption" color="text.secondary">Account Attribution</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5, fontSize: "0.78rem" }} noWrap>
                {shipment.createdBy || "System"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {shipment.notes && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: tokens.bg }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25, fontWeight: 700 }}>
              Special Handling Notes:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.82rem" }}>
              {shipment.notes}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${tokens.border}`,
          justifyContent: "space-between",
          flexShrink: 0,
          bgcolor: "#FAFBFD",
        }}
      >
        {onDelete ? (
          <Button
            onClick={() => onDelete(shipment.shipmentId)}
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
          >
            Remove Shipment
          </Button>
        ) : (
          <Box />
        )}
        <Button onClick={onClose} variant="contained" sx={{ px: 3 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
