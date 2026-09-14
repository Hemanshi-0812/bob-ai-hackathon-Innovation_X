import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Stack, Link } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useAuth } from "../context/AuthContext.jsx";
import { tokens } from "../theme.js";
import AuthShowcase from "../components/AuthShowcase.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
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
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.25, mb: 4 }}>
            <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: tokens.indigo, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldOutlinedIcon sx={{ fontSize: 19, color: "#fff" }} />
            </Box>
            <Typography sx={{ fontWeight: 700 }}>SupplyGuard AI</Typography>
          </Box>

          <Stack spacing={0.75} sx={{ mb: 4 }}>
            <Typography variant="h4">Create your account</Typography>
            <Typography variant="body2" color="text.secondary">
              Set up access to the supply chain command center.
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.25}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                autoFocus
                required
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                size="small"
                required
                helperText="At least 6 characters"
              />
              <TextField
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                size="small"
                required
              />
              <Button type="submit" variant="contained" disabled={loading} fullWidth size="large" sx={{ py: 1.25 }}>
                {loading ? "Creating account…" : "Create account"}
              </Button>
              <Typography variant="body2" align="center" color="text.secondary">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>Sign in</Link>
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" sx={{ display: "block" }}>
                Registration requires MongoDB to be connected (not available in offline mode).
              </Typography>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
