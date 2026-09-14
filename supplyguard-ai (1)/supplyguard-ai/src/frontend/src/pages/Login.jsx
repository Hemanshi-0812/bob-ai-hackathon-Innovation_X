import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Stack, Link } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useAuth } from "../context/AuthContext.jsx";
import { tokens } from "../theme.js";
import AuthShowcase from "../components/AuthShowcase.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: tokens.bg }}>
      <AuthShowcase />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 6,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 380 }}>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.25, mb: 4 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: tokens.indigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldOutlinedIcon sx={{ fontSize: 19, color: "#fff" }} />
            </Box>
            <Typography sx={{ fontWeight: 700 }}>SupplyGuard AI</Typography>
          </Box>

          <Stack spacing={0.75} sx={{ mb: 4 }}>
            <Typography variant="h4">Welcome back</Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your supply chain command center.
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.25}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                size="small"
              />
              <Button type="submit" variant="contained" disabled={loading} fullWidth size="large" sx={{ py: 1.25 }}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              <Typography variant="body2" align="center" color="text.secondary">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>Create one</Link>
              </Typography>

              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: tokens.indigoSoft,
                  border: `1px solid #E0E7FF`,
                }}
              >
                <Typography variant="caption" sx={{ display: "block", color: tokens.indigoDark, fontWeight: 600 }}>
                  Demo account (offline mode)
                </Typography>
                <Typography variant="caption" sx={{ color: tokens.indigoDark, fontFamily: '"JetBrains Mono", monospace' }}>
                  [email protected] / supplyguard123
                </Typography>
              </Box>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
