import { Chip } from "@mui/material";
import { tokens } from "../theme.js";

const STYLE_MAP = {
  low: { bg: tokens.emeraldSoft, fg: "#065F46", dot: tokens.emerald },
  medium: { bg: tokens.amberSoft, fg: "#92400E", dot: tokens.amber },
  high: { bg: tokens.amberSoft, fg: "#92400E", dot: tokens.amber },
  critical: { bg: tokens.redSoft, fg: "#991B1B", dot: tokens.red },
};

export default function SeverityChip({ severity }) {
  if (!severity) return null;
  const s = STYLE_MAP[severity] || { bg: "#F1F5F9", fg: tokens.textMuted, dot: tokens.textFaint };
  return (
    <Chip
      size="small"
      icon={
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: s.dot,
            marginLeft: 8,
          }}
        />
      }
      label={severity.charAt(0).toUpperCase() + severity.slice(1)}
      sx={{
        bgcolor: s.bg,
        color: s.fg,
        fontWeight: 700,
        "& .MuiChip-icon": { order: 1, marginRight: "8px" },
        "& .MuiChip-label": { order: 2, paddingLeft: 0 },
      }}
    />
  );
}
