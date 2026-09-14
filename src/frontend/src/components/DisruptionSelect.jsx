import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from "@mui/material";
import SeverityChip from "./SeverityChip.jsx";

export default function DisruptionSelect({ disruptions, value, onChange, allowNone = false, label = "Disruption" }) {
  return (
    <FormControl size="small" sx={{ minWidth: 320, mb: 2.5 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        sx={{ bgcolor: "background.paper" }}
      >
        {allowNone && <MenuItem value="">— All regions —</MenuItem>}
        {disruptions.map((d) => (
          <MenuItem key={d.disruptionId} value={d.disruptionId}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {d.disruptionId} <Typography component="span" variant="body2" color="text.secondary">— {d.region}</Typography>
              </Typography>
              <SeverityChip severity={d.severity} />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
