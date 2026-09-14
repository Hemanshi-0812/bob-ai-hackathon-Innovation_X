import { useEffect, useState } from "react";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Typography,
  InputAdornment,
  Stack,
  Button,
  Tabs,
  Tab,
  IconButton,
  TablePagination,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BoltIcon from "@mui/icons-material/Bolt";
import SyncIcon from "@mui/icons-material/Sync";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AppLayout from "../components/AppLayout.jsx";
import AddShipmentModal from "../components/AddShipmentModal.jsx";
import ShipmentDetailsModal from "../components/ShipmentDetailsModal.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Shipments() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [shipments, setShipments] = useState(null);
  const [disruptions, setDisruptions] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [slackSortActive, setSlackSortActive] = useState(false);

  // Calculate slack in hours between deadlineAt and eta for any shipment
  const getShipmentSlackHours = (s) => {
    if (!s || !s.deadlineAt || !s.eta) return null;
    const deadlineMs = new Date(s.deadlineAt).getTime();
    const etaMs = new Date(s.eta).getTime();
    if (isNaN(deadlineMs) || isNaN(etaMs)) return null;
    return Math.round((deadlineMs - etaMs) / (1000 * 60 * 60));
  };

  const fetchShipments = (silent = false) => {
    Promise.all([api.getShipments(), api.getDisruptions()])
      .then(([s, d]) => {
        setShipments(s);
        setDisruptions(d);
        setLastUpdated(new Date());
      })
      .catch((e) => {
        if (!silent) setError(e.message);
      });
  };

  useEffect(() => {
    fetchShipments();

    // Auto-refresh every 12 seconds to capture live simulator background updates
    const timer = setInterval(() => {
      fetchShipments(true);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const handleSimulateStep = async () => {
    setIsSimulating(true);
    try {
      await api.triggerSimulatorTick();
      await fetchShipments();
    } catch (err) {
      alert("Simulation tick failed: " + err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleCreated = (newShipment) => {
    setShipments((prev) => [newShipment, ...(prev || [])]);
  };

  const handleDelete = async (shipmentId) => {
    if (!window.confirm(`Are you sure you want to remove shipment ${shipmentId}?`)) return;
    try {
      await api.deleteShipment(shipmentId);
      if (selectedShipment?.shipmentId === shipmentId) {
        setSelectedShipment(null);
      }
      setShipments((prev) => (prev || []).filter((s) => s.shipmentId !== shipmentId));
    } catch (err) {
      alert("Failed to delete shipment: " + err.message);
    }
  };

  const filtered = (shipments || [])
    .filter((s) => {
      const matchesSearch = [s.shipmentId, s.origin, s.destination, s.carrier, s.cargoType, s.createdBy || ""]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === "cold_chain") return Boolean(s.isColdChain);
      if (statusFilter === "in_transit") return s.status === "In Transit";
      if (statusFilter === "delayed") return s.status === "Delayed";
      if (statusFilter === "delivered") return s.status === "Delivered";

      return true;
    })
    .sort((a, b) => {
      if (slackSortActive) {
        const slackA = getShipmentSlackHours(a) ?? 999;
        const slackB = getShipmentSlackHours(b) ?? 999;
        return slackA - slackB; // Ascending: tightest/critical slack first
      }
      return 0;
    });

  const paginatedShipments = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Dynamic Calculation: Avg. In-Transit Hours (calculated over active in-transit shipments)
  const inTransitShipments = (shipments || []).filter((s) => s.status === "In Transit");
  const averageHoursElapsed = inTransitShipments.length > 0
    ? Math.round(inTransitShipments.reduce((sum, item) => sum + (item.hoursElapsed || 0), 0) / inTransitShipments.length)
    : (shipments && shipments.length > 0
      ? Math.round(shipments.reduce((sum, item) => sum + (item.hoursElapsed || 0), 0) / shipments.length)
      : 0);

  // Dynamic Calculation: Avg. Deadline Slack Hours (buffer between deadlineAt and eta)
  const activeShipmentsForSlack = (shipments || []).filter(
    (s) => s.deadlineAt && s.eta && s.status !== "Delivered"
  );
  const avgDeadlineSlack = activeShipmentsForSlack.length > 0
    ? Math.round(
        activeShipmentsForSlack.reduce((sum, s) => {
          const slack = getShipmentSlackHours(s);
          return sum + (slack !== null ? slack : 24);
        }, 0) / activeShipmentsForSlack.length
      )
    : (shipments && shipments.length > 0
      ? Math.round(
          shipments.reduce((sum, s) => {
            const slack = getShipmentSlackHours(s);
            return sum + (slack !== null ? slack : 24);
          }, 0) / shipments.length
        )
      : 24);

  return (
    <AppLayout
      title={isAdmin ? "Enterprise Intermodal Logistics" : "My Shipments"}
      subtitle={
        shipments
          ? `${shipments.length} total shipments ${isAdmin ? "across global corridors" : `registered to ${user?.email}`}`
          : undefined
      }
    >
      {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

      {/* Dynamic Telemetry Banner & Controls */}
      <Card
        sx={{
          p: 2,
          mb: 2.5,
          background: "linear-gradient(90deg, rgba(30, 58, 138, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)",
          border: `1px solid rgba(59, 130, 246, 0.25)`,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              bgcolor: "rgba(16, 185, 129, 0.12)",
              color: "#059669",
              px: 1.5,
              py: 0.6,
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "0.78rem",
            }}
          >
            <FiberManualRecordIcon sx={{ fontSize: 11, animation: "pulse 1.8s infinite" }} />
            Dynamic Simulator Active
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.82rem" }}>
            Auto-advancing transit corridors & IoT cold chain every 12s • Last sync:{" "}
            <strong>{lastUpdated.toLocaleTimeString()}</strong>
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            startIcon={isSimulating ? <CircularProgress size={14} /> : <BoltIcon sx={{ color: "#F59E0B" }} />}
            onClick={handleSimulateStep}
            disabled={isSimulating}
            sx={{
              borderColor: "rgba(59, 130, 246, 0.4)",
              fontWeight: 700,
              fontSize: "0.8rem",
              "&:hover": { borderColor: tokens.indigo, bgcolor: "rgba(59, 130, 246, 0.06)" },
            }}
          >
            {isSimulating ? "Simulating..." : "Simulate 1 Step Now"}
          </Button>

          <Tooltip title="Instant reload">
            <IconButton size="small" onClick={() => fetchShipments()} sx={{ border: `1px solid ${tokens.border}` }}>
              <SyncIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Card>

      {/* Action Header: Metric Chips & Add Button */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2.5 }}>
        {shipments && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Chip
              icon={<Inventory2OutlinedIcon />}
              label={`${shipments.length} ${isAdmin ? "Network Shipments" : "My Shipments"}`}
              color="primary"
              sx={{ fontWeight: 700 }}
            />
            <Tooltip title={slackSortActive ? "Click to reset deadline slack sorting" : "Click to sort by deadline urgency (tightest SLA buffer first)"}>
              <Chip
                icon={<EventNoteIcon />}
                label={`Avg. deadline slack: ${avgDeadlineSlack}h${slackSortActive ? " (Urgency Sorted)" : ""}`}
                variant={slackSortActive ? "filled" : "outlined"}
                onClick={() => {
                  setSlackSortActive((prev) => !prev);
                  setPage(0);
                }}
                sx={{
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  ...(slackSortActive
                    ? {
                        bgcolor: "rgba(245, 158, 11, 0.18)",
                        color: "#B45309",
                        borderColor: "#F59E0B",
                        borderWidth: 1.5,
                        borderStyle: "solid",
                        "&:hover": { bgcolor: "rgba(245, 158, 11, 0.28)" },
                      }
                    : {
                        "&:hover": {
                          borderColor: tokens.indigo,
                          bgcolor: "rgba(79, 70, 229, 0.05)",
                        },
                      }),
                }}
              />
            </Tooltip>
            <Tooltip title={statusFilter === "in_transit" ? "Click to view all shipments" : "Click to filter active in-transit shipments"}>
              <Chip
                icon={<AccessTimeIcon />}
                label={`Avg. in-transit: ${averageHoursElapsed}h${statusFilter === "in_transit" ? " (Filtered)" : ""}`}
                variant={statusFilter === "in_transit" ? "filled" : "outlined"}
                onClick={() => {
                  setStatusFilter((prev) => (prev === "in_transit" ? "all" : "in_transit"));
                  setPage(0);
                }}
                sx={{
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  ...(statusFilter === "in_transit"
                    ? {
                        bgcolor: "rgba(79, 70, 229, 0.15)",
                        color: tokens.indigo,
                        borderColor: tokens.indigo,
                        borderWidth: 1.5,
                        borderStyle: "solid",
                        "&:hover": { bgcolor: "rgba(79, 70, 229, 0.22)" },
                      }
                    : {
                        "&:hover": {
                          borderColor: tokens.indigo,
                          bgcolor: "rgba(79, 70, 229, 0.05)",
                        },
                      }),
                }}
              />
            </Tooltip>
          </Stack>
        )}

        {/* Add New Shipment button is removed from admin side and only visible to shipper users */}
        {!isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{
              background: tokens.gradientPrimary,
              px: 2.5,
              py: 1,
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
            }}
          >
            Add New Shipment
          </Button>
        )}
      </Box>

      {/* Filter Tabs & Search Bar */}
      <Card sx={{ p: 2, mb: 2.5, border: `1px solid ${tokens.border}` }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Tabs
            value={statusFilter}
            onChange={(e, val) => {
              setStatusFilter(val);
              setPage(0);
            }}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, py: 0.5, px: 2, fontWeight: 700, fontSize: "0.82rem" } }}
          >
            <Tab value="all" label={`All (${shipments?.length || 0})`} />
            <Tab value="in_transit" label="In Transit" />
            <Tab value="delayed" label="Delayed" />
            <Tab value="delivered" label="Delivered" />
            <Tab value="cold_chain" label="Cold-Chain" />
          </Tabs>

          <TextField
            placeholder="Search by ID, route, carrier, cargo..."
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ width: { xs: "100%", sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Card>

      {!shipments && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}

      {shipments && (
        <Card sx={{ overflow: "hidden", border: `1px solid ${tokens.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(248, 250, 252, 0.8)" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Shipment ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Corridor Route</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Current Waypoint</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Mode</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Carrier</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Cargo Type</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Value (USD)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>ETA</TableCell>
                  {isAdmin && <TableCell sx={{ fontWeight: 700 }}>Owner</TableCell>}
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedShipments.map((s) => {
                  const statusCol =
                    s.status === "Delivered" ? "success" : s.status === "Delayed" ? "error" : "primary";
                  return (
                    <TableRow key={s.shipmentId} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 800,
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: "0.8125rem",
                            color: tokens.indigo,
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() => setSelectedShipment(s)}
                        >
                          {s.shipmentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {s.origin} <Box component="span" sx={{ color: "text.secondary", mx: 0.5 }}>→</Box> {s.destination}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={s.currentLocation || s.origin}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 22,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            borderColor: s.currentLocation === s.destination ? "#10B981" : tokens.indigo,
                            color: s.currentLocation === s.destination ? "#059669" : tokens.indigo,
                          }}
                        />
                        {s.status === "In Transit" && (
                          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", fontSize: "0.7rem", mt: 0.3, fontWeight: 600 }}>
                            ⏱️ {s.hoursElapsed || 0}h in-transit
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>{s.mode}</TableCell>
                      <TableCell>{s.carrier}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                          <Typography variant="body2">{s.cargoType}</Typography>
                          {s.isColdChain && (
                            <Chip
                              icon={<AcUnitIcon sx={{ fontSize: "13px !important" }} />}
                              label="Cold"
                              size="small"
                              sx={{ height: 20, bgcolor: tokens.cyanSoft, color: "#0F766E", fontSize: "0.68rem" }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          ${Number(s.cargoValueUsd).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={s.status || "In Transit"}
                          size="small"
                          color={statusCol}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: "block" }}>
                          {s.eta ? new Date(s.eta).toLocaleDateString() : "TBD"}
                        </Typography>
                        {(() => {
                          const slack = getShipmentSlackHours(s);
                          if (slack === null || s.status === "Delivered") return null;
                          const isBreached = slack < 0;
                          const isTight = slack <= 12;
                          return (
                            <Tooltip title={`Contract SLA Deadline: ${s.deadlineAt ? new Date(s.deadlineAt).toLocaleString() : "TBD"} (Slack Buffer: ${slack}h)`}>
                              <Chip
                                size="small"
                                label={isBreached ? `Breach: -${Math.abs(slack)}h` : isTight ? `Tight: +${slack}h` : `+${slack}h slack`}
                                sx={{
                                  height: 19,
                                  fontSize: "0.68rem",
                                  fontWeight: 700,
                                  mt: 0.4,
                                  bgcolor: isBreached
                                    ? "rgba(239, 68, 68, 0.12)"
                                    : isTight
                                    ? "rgba(245, 158, 11, 0.12)"
                                    : "rgba(16, 185, 129, 0.12)",
                                  color: isBreached ? "#DC2626" : isTight ? "#D97706" : "#059669",
                                  border: `1px solid ${
                                    isBreached
                                      ? "rgba(239, 68, 68, 0.3)"
                                      : isTight
                                      ? "rgba(245, 158, 11, 0.3)"
                                      : "rgba(16, 185, 129, 0.3)"
                                  }`,
                                }}
                              />
                            </Tooltip>
                          );
                        })()}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 120, display: "block" }}>
                            {s.createdBy || "system"}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedShipment(s)}
                            title="View tracking details"
                            sx={{ color: tokens.indigo }}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(s.shipmentId)}
                            title="Delete shipment"
                            sx={{ color: "text.secondary", "&:hover": { color: tokens.red } }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>

          {filtered.length === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, gap: 1.5 }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 36, color: "text.disabled" }} />
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                No shipments found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No shipments match your active search or category filter.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setAddModalOpen(true)}
              >
                Add Shipment
              </Button>
            </Box>
          )}

          {/* Table Pagination */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{ borderTop: `1px solid ${tokens.border}` }}
          />
        </Card>
      )}

      {/* Add Shipment Modal: Shipper user view only */}
      {!isAdmin && (
        <AddShipmentModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Shipment Details Modal */}
      <ShipmentDetailsModal
        shipment={selectedShipment}
        open={Boolean(selectedShipment)}
        onClose={() => setSelectedShipment(null)}
        onDelete={handleDelete}
        disruptions={disruptions}
      />
    </AppLayout>
  );
}
