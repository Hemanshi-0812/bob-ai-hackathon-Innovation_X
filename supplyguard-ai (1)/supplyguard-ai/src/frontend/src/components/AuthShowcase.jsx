import { Box, Typography, Stack } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RouteIcon from "@mui/icons-material/AltRoute";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { tokens } from "../theme.js";

const POINTS = [
  { icon: TrendingUpIcon, text: "Real-time disruption intelligence across every active lane" },
  { icon: RouteIcon, text: "AI-generated rerouting recommendations in seconds" },
  { icon: ThermostatIcon, text: "Cold-chain excursion alerts before cargo is compromised" },
];

export default function AuthShowcase() {
  return (
    <Box
      sx={{
        flex: 1,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: tokens.navy,
        color: "#fff",
        px: 7,
        py: 7,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(ellipse at top left, black 10%, transparent 70%)",
        }}
      />

      <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: tokens.indigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldOutlinedIcon sx={{ fontSize: 21, color: "#fff" }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: "1.0625rem" }}>SupplyGuard AI</Typography>
      </Box>

      <Box sx={{ position: "relative", maxWidth: 420 }}>
        <Typography variant="overline" sx={{ color: "#818CF8" }}>
          Industry Problem Statement L2
        </Typography>
        <Typography variant="h3" sx={{ mt: 1.5, mb: 2, fontSize: "2rem" }}>
          Supply Chain Disruption Assistant &amp; Fleet Optimizer
        </Typography>
        <Typography variant="body1" sx={{ color: "#94A3B8", mb: 4 }}>
          One command center to detect disruptions, quantify shipment risk, and
          redeploy idle fleet before delays become losses.
        </Typography>

        <Stack spacing={2}>
          {POINTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    bgcolor: "rgba(79,70,229,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon sx={{ fontSize: 16, color: "#A5B4FC" }} />
                </Box>
                <Typography variant="body2" sx={{ color: "#CBD5E1", pt: 0.375 }}>{p.text}</Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Typography variant="caption" sx={{ position: "relative", color: "#475569" }}>
        Powered by IBM Bob · Logistics &amp; Ports sector
      </Typography>
    </Box>
  );
}
