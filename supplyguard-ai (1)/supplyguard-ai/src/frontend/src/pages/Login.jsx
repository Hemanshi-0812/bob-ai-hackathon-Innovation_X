import { useState } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Link,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShowcase from "../components/AuthShowcase.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(() => searchParams.get("role") || "admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(targetEmail, targetPassword) {
    setError(null);
    setLoading(true);
    try {
      await login(targetEmail, targetPassword, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin(email, password);
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#FFFFFF" }}>
      {/* Left Brand Showcase in White & Blue */}
      <AuthShowcase />

      {/* Right Login Box */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 6,
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          {/* Back to Homepage Button & Mobile Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackIcon fontSize="small" />}
              size="small"
              sx={{
                color: "#0052FF",
                fontWeight: 700,
                fontSize: "0.82rem",
                bgcolor: "#EFF6FF",
                px: 1.75,
                py: 0.6,
                borderRadius: 2,
                border: "1px solid rgba(0, 82, 255, 0.2)",
                "&:hover": { bgcolor: "#DBEAFE" },
              }}
            >
              Back to Homepage
            </Button>

            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{ width: 32, height: 32, objectFit: "contain" }}
              />
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                SupplyGuard <Box component="span" sx={{ color: "#0052FF" }}>AI</Box>
              </Typography>
            </Box>
          </Box>

          <Stack spacing={0.75} sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.03em", color: "#0A192F" }}>
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Sign in to your logistics command center or customer shipper portal.
            </Typography>
          </Stack>

          {/* Clean Credentials Sign-In Form (Quick Demo Removed as Requested) */}
          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              {/* Role Selection Tabs */}
              <Box sx={{ bgcolor: "#F1F5F9", p: 0.5, borderRadius: 2.5, display: "flex", gap: 1 }}>
                <Button
                  fullWidth
                  variant={role === "admin" ? "contained" : "text"}
                  onClick={() => setRole("admin")}
                  startIcon={<ShieldOutlinedIcon sx={{ fontSize: "18px !important" }} />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    py: 1,
                    bgcolor: role === "admin" ? "#0052FF" : "transparent",
                    color: role === "admin" ? "#fff" : "#475569",
                    boxShadow: role === "admin" ? "0 4px 12px rgba(0, 82, 255, 0.25)" : "none",
                    "&:hover": { bgcolor: role === "admin" ? "#0043D1" : "rgba(0,0,0,0.05)" },
                  }}
                >
                  System Admin
                </Button>
                <Button
                  fullWidth
                  variant={role === "shipment_user" ? "contained" : "text"}
                  onClick={() => setRole("shipment_user")}
                  startIcon={<PersonOutlineIcon sx={{ fontSize: "18px !important" }} />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    py: 1,
                    bgcolor: role === "shipment_user" ? "#0052FF" : "transparent",
                    color: role === "shipment_user" ? "#fff" : "#475569",
                    boxShadow: role === "shipment_user" ? "0 4px 12px rgba(0, 82, 255, 0.25)" : "none",
                    "&:hover": { bgcolor: role === "shipment_user" ? "#0043D1" : "rgba(0,0,0,0.05)" },
                  }}
                >
                  Shipper User
                </Button>
              </Box>

              <TextField
                label={role === "admin" ? "Administrator Email Address" : "Shipper Email Address"}
                type="email"
                placeholder={role === "admin" ? "admin@supplyguard.ai" : "shipmentuser@supplyguard.ai"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                autoFocus
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    "&.Mui-focused fieldset": { borderColor: "#0052FF" },
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                size="small"
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    "&.Mui-focused fieldset": { borderColor: "#0052FF" },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                size="large"
                sx={{
                  py: 1.4,
                  bgcolor: "#0052FF",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  borderRadius: 2.5,
                  boxShadow: "0 4px 16px rgba(0, 82, 255, 0.3)",
                  "&:hover": { bgcolor: "#0043D1" },
                }}
              >
                {loading
                  ? "Signing in…"
                  : role === "admin"
                  ? "Sign In as System Administrator"
                  : "Sign In to Shipper Workspace"}
              </Button>

              {/* Helpful Demo Credentials Hint */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                  Demo Accounts: <strong>shipmentuser@supplyguard.ai</strong> or <strong>admin@supplyguard.ai</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                  Passwords: <strong>Shipment@2026</strong> or <strong>SupplyGuard@2026</strong>
                </Typography>
              </Box>

              <Typography variant="body2" align="center" sx={{ color: "#475569" }}>
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{ fontWeight: 700, color: "#0052FF", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  Create shipper account
                </Link>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
