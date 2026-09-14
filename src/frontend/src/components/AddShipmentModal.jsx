import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import AcUnitIcon from "@mui/icons-material/AcUnitOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FlightIcon from "@mui/icons-material/Flight";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import TrainIcon from "@mui/icons-material/Train";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

const REGIONS = [
  "US-West", "US-East", "US-Gulf", "EU-North", "EU-Med",
  "Asia-SE", "Asia-East", "LatAm-East", "Middle-East", "Africa-North",
];

const CARRIERS = ["DHL Freight", "Maersk", "MSC", "CMA CGM", "XPO Logistics", "J.B. Hunt", "FedEx Supply Chain"];

const MODES = [
  { value: "truck", label: "Truck / Road", icon: LocalShippingIcon },
  { value: "vessel", label: "Ocean Vessel", icon: DirectionsBoatIcon },
  { value: "rail", label: "Freight Rail", icon: TrainIcon },
  { value: "air", label: "Air Cargo", icon: FlightIcon },
];

const CARGO_PRESETS = [
  "Pharmaceuticals & Vaccines",
  "High-Value Electronics",
  "Automotive Components",
  "Precision Industrial Equipment",
  "Perishable Cold Cargo",
  "Retail & Consumer Goods",
];

export default function AddShipmentModal({ open, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    shipmentId: `SHP-${Math.floor(2000 + Math.random() * 8000)}`,
    origin: "US-West",
    destination: "EU-North",
    mode: "truck",
    carrier: "DHL Freight",
    cargoType: "Pharmaceuticals & Vaccines",
    cargoValueUsd: 185000,
    isColdChain: true,
    targetTemp: "2°C - 8°C",
    priority: "Express",
    eta: new Date(Date.now() + 72 * 3600 * 1000).toISOString().split("T")[0],
    notes: "Priority cold-chain shipment. Requires continuous temperature logging.",
  });

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCargoPreset = (preset) => {
    const isCold = preset.includes("Pharmaceuticals") || preset.includes("Perishable");
    setForm((prev) => ({
      ...prev,
      cargoType: preset,
      isColdChain: isCold,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.origin || !form.destination) {
      setError("Origin and Destination hubs are required.");
      return;
    }
    if (form.origin === form.destination) {
      setError("Origin and Destination cannot be the same hub.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shipmentId: form.shipmentId.trim() || undefined,
        origin: form.origin,
        destination: form.destination,
        mode: form.mode,
        carrier: form.carrier,
        cargoType: form.cargoType,
        cargoValueUsd: Number(form.cargoValueUsd) || 0,
        isColdChain: form.isColdChain,
        eta: new Date(form.eta),
        deadlineAt: new Date(new Date(form.eta).getTime() + 24 * 3600 * 1000),
        priority: form.priority,
        notes: form.notes,
      };
      const created = await api.createShipment(payload);
      if (onCreated) onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
              background: tokens.gradientPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(79, 70, 229, 0.25)",
            }}
          >
            <AddCircleOutlineIcon sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Add New Shipment
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Create a personalized shipment manifest in your shipper workspace
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
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
          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <Grid container spacing={2.5}>
            {/* Shipment ID & Priority */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Shipment Reference ID"
                value={form.shipmentId}
                onChange={handleChange("shipmentId")}
                fullWidth
                size="small"
                helperText="Auto-generated or custom identifier (e.g., SHP-2045)"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Priority Level"
                value={form.priority}
                onChange={handleChange("priority")}
                fullWidth
                size="small"
              >
                <MenuItem value="Standard">Standard Delivery</MenuItem>
                <MenuItem value="Express">Express (Accelerated)</MenuItem>
                <MenuItem value="Urgent">Urgent / Time-Critical</MenuItem>
                <MenuItem value="Critical">Critical Priority</MenuItem>
              </TextField>
            </Grid>

            {/* Origin & Destination Hubs */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Origin Logistics Hub"
                value={form.origin}
                onChange={handleChange("origin")}
                fullWidth
                size="small"
                required
              >
                {REGIONS.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Destination Logistics Hub"
                value={form.destination}
                onChange={handleChange("destination")}
                fullWidth
                size="small"
                required
              >
                {REGIONS.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Transport Mode & Carrier */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Transit Mode"
                value={form.mode}
                onChange={handleChange("mode")}
                fullWidth
                size="small"
              >
                {MODES.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <m.icon sx={{ fontSize: 18, color: tokens.indigo }} />
                      <span>{m.label}</span>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Freight Carrier"
                value={form.carrier}
                onChange={handleChange("carrier")}
                fullWidth
                size="small"
              >
                {CARRIERS.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Cargo Type & Presets */}
            <Grid item xs={12}>
              <TextField
                label="Cargo Description / Classification"
                value={form.cargoType}
                onChange={handleChange("cargoType")}
                fullWidth
                size="small"
                required
              />
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", mr: 0.5 }}>
                  Quick presets:
                </Typography>
                {CARGO_PRESETS.map((preset) => (
                  <Chip
                    key={preset}
                    label={preset}
                    size="small"
                    clickable
                    onClick={() => handleCargoPreset(preset)}
                    variant={form.cargoType === preset ? "filled" : "outlined"}
                    color={form.cargoType === preset ? "primary" : "default"}
                    sx={{ fontSize: "0.72rem", height: 24 }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Cargo Value & ETA */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cargo Declared Value (USD)"
                type="number"
                value={form.cargoValueUsd}
                onChange={handleChange("cargoValueUsd")}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Estimated Arrival (ETA)"
                type="date"
                value={form.eta}
                onChange={handleChange("eta")}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Cold Chain Specifications */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: form.isColdChain ? tokens.cyanSoft : tokens.bg,
                  border: `1px solid ${form.isColdChain ? "rgba(20,184,166,0.3)" : tokens.border}`,
                  transition: "all 200ms ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <AcUnitIcon sx={{ color: form.isColdChain ? tokens.cyan : "text.secondary" }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: form.isColdChain ? "#0F766E" : "text.primary" }}>
                        IoT Cold-Chain Telemetry Required
                      </Typography>
                      <Typography variant="caption" sx={{ color: form.isColdChain ? "#115E59" : "text.secondary" }}>
                        Enables automated temperature logging, excursion alerts, and cold-chain compliance.
                      </Typography>
                    </Box>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.isColdChain}
                        onChange={handleChange("isColdChain")}
                        color="success"
                      />
                    }
                    label=""
                    sx={{ mr: 0 }}
                  />
                </Box>

                {form.isColdChain && (
                  <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed rgba(20,184,166,0.25)", display: "flex", gap: 2 }}>
                    <TextField
                      label="Safe Temperature Range"
                      value={form.targetTemp}
                      onChange={handleChange("targetTemp")}
                      size="small"
                      sx={{ maxWidth: 220, bgcolor: "#fff" }}
                    />
                    <Typography variant="caption" sx={{ color: "#0F766E", alignSelf: "center" }}>
                      Safe pharmaceutical standard: 2°C to 8°C with auto-excursion detection.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Handling Notes */}
            <Grid item xs={12}>
              <TextField
                label="Handling Instructions / Manifest Notes"
                value={form.notes}
                onChange={handleChange("notes")}
                multiline
                rows={2}
                fullWidth
                size="small"
                placeholder="e.g., Keep upright, fragile electronics, seal verification required upon docking."
              />
            </Grid>
          </Grid>
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
          <Button onClick={onClose} variant="text" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              background: tokens.gradientPrimary,
              px: 3,
              py: 1,
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
              "&:hover": { background: tokens.indigoDark },
            }}
          >
            {loading ? "Registering Shipment…" : "Save & Track Shipment"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
