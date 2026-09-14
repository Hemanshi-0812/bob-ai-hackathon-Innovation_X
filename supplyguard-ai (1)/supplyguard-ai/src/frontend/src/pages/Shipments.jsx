import { useEffect, useState } from "react";
import {
  Card, Table, TableHead, TableRow, TableCell, TableBody, Chip,
  TextField, Box, CircularProgress, Alert, Typography, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AppLayout from "../components/AppLayout.jsx";
import { api } from "../api/client.js";
import { tokens } from "../theme.js";

export default function Shipments() {
  const [shipments, setShipments] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getShipments().then(setShipments).catch((e) => setError(e.message));
  }, []);

  const filtered = (shipments || []).filter((s) =>
    [s.shipmentId, s.origin, s.destination, s.carrier, s.cargoType]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AppLayout
      title="Shipment Management"
      subtitle={shipments ? `${shipments.length} shipments tracked` : undefined}
    >
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        placeholder="Search by ID, region, carrier, or cargo type…"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2.5, maxWidth: 420, bgcolor: "background.paper" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />
      {!shipments && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 10 }}><CircularProgress /></Box>
      )}
      {shipments && (
        <Card sx={{ overflow: "hidden" }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Shipment</TableCell>
                  <TableCell>Route</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Carrier</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell align="right">Value (USD)</TableCell>
                  <TableCell>ETA</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.shipmentId} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', fontSize: "0.8125rem" }}>
                        {s.shipmentId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{s.origin} <Box component="span" sx={{ color: "text.secondary", mx: 0.5 }}>→</Box> {s.destination}</Typography>
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{s.mode}</TableCell>
                    <TableCell>{s.carrier}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Typography variant="body2">{s.cargoType}</Typography>
                        {s.isColdChain && (
                          <Chip
                            icon={<AcUnitIcon sx={{ fontSize: "13px !important" }} />}
                            label="Cold chain"
                            size="small"
                            sx={{ bgcolor: tokens.blueSoft, color: "#1E3A8A" }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${Number(s.cargoValueUsd).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(s.eta).toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {filtered.length === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 6, gap: 1 }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
              <Typography variant="body2" color="text.secondary">No shipments match your search.</Typography>
            </Box>
          )}
        </Card>
      )}
    </AppLayout>
  );
}
