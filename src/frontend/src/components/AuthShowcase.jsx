import { Box, Typography, Stack, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RouteIcon from "@mui/icons-material/AltRoute";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const POINTS = [
  { icon: TrendingUpIcon, text: "Real-time disruption intelligence across global trade corridors" },
  { icon: RouteIcon, text: "AI-generated autonomous intermodal rerouting in seconds" },
  { icon: ThermostatIcon, text: "Continuous IoT cold-chain telemetry and reefer safeguards" },
];

export default function AuthShowcase() {
  return (
    <Box
      sx={{
        flex: 1,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "#F8FAFC",
        color: "#0A192F",
        px: 7,
        py: 6,
        borderRight: "1px solid #E2E8F0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle Blue Grid Accent */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 82, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 82, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Top Brand Header + Back to Homepage link */}
      <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="SupplyGuard AI Logo"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              objectFit: "contain",
              filter: "drop-shadow(0 4px 12px rgba(0, 82, 255, 0.25))",
            }}
          />
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
              SupplyGuard <Box component="span" sx={{ color: "#0052FF" }}>AI</Box>
            </Typography>
            <Typography sx={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600 }}>
              Global Intermodal Freight Defense
            </Typography>
          </Box>
        </Box>

        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon fontSize="small" />}
          size="small"
          sx={{
            color: "#0052FF",
            fontWeight: 700,
            fontSize: "0.8rem",
            bgcolor: "#EFF6FF",
            px: 1.75,
            py: 0.6,
            borderRadius: 2,
            border: "1px solid rgba(0, 82, 255, 0.2)",
            "&:hover": { bgcolor: "#DBEAFE" },
          }}
        >
          Homepage
        </Button>
      </Box>

      {/* Middle Value Proposition */}
      <Box sx={{ position: "relative", maxWidth: 440, my: "auto" }}>
        <Typography
          variant="overline"
          sx={{
            color: "#0052FF",
            fontWeight: 800,
            letterSpacing: "0.08em",
            bgcolor: "#EFF6FF",
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            border: "1px solid rgba(0, 82, 255, 0.2)",
            display: "inline-block",
            mb: 2,
          }}
        >
          Enterprise Freight Resilience
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 900, fontSize: "2.1rem", lineHeight: 1.2, mb: 2, color: "#0A192F" }}>
          Autonomous Disruption Radar &amp; Fleet Protection
        </Typography>
        <Typography variant="body1" sx={{ color: "#475569", mb: 4, lineHeight: 1.6 }}>
          One command center to detect global bottlenecks, quantify supply chain risks, and reroute fleet assets before delays become losses.
        </Typography>

        <Stack spacing={2.5}>
          {POINTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    borderRadius: 2,
                    bgcolor: "#EFF6FF",
                    border: "1px solid rgba(0, 82, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon sx={{ fontSize: 18, color: "#0052FF" }} />
                </Box>
                <Typography variant="body2" sx={{ color: "#334155", fontWeight: 600, pt: 0.6 }}>
                  {p.text}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Footer info */}
      <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
          SupplyGuard AI · Global Logistics Architecture
        </Typography>
        <Typography variant="caption" sx={{ color: "#0052FF", fontWeight: 700 }}>
          SOC2 &amp; GDP Certified
        </Typography>
      </Box>
    </Box>
  );
}
