import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert, Stack, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShowcase from "../components/AuthShowcase.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("shipment_user");
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
      await register(name, email, password, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#FFFFFF" }}>
      <AuthShowcase />

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
          {/* Back to Homepage & Mobile Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3.5 }}>
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
              <Box component="img" src="/logo.png" alt="Logo" sx={{ width: 32, height: 32, objectFit: "contain" }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                SupplyGuard <Box component="span" sx={{ color: "#0052FF" }}>AI</Box>
              </Typography>
            </Box>
          </Box>

          <Stack spacing={0.75} sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.03em", color: "#0A192F" }}>
              Create an account
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              Set up verified access to the supply chain command center.
            </Typography>
          </Stack>

          {/* Account Role Selector */}
          <Box sx={{ mb: 3, p: 0.5, bgcolor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 2.5, display: "flex" }}>
            <Button
              fullWidth
              size="small"
              startIcon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
              onClick={() => setRole("shipment_user")}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "0.8rem",
                py: 0.85,
                bgcolor: role === "shipment_user" ? "#FFFFFF" : "transparent",
                color: role === "shipment_user" ? "#0052FF" : "#64748B",
                border: role === "shipment_user" ? "1px solid rgba(0, 82, 255, 0.25)" : "none",
                boxShadow: role === "shipment_user" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              }}
            >
              Shipper User
            </Button>
            <Button
              fullWidth
              size="small"
              startIcon={<ShieldOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={() => setRole("admin")}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "0.8rem",
                py: 0.85,
                bgcolor: role === "admin" ? "#FFFFFF" : "transparent",
                color: role === "admin" ? "#0052FF" : "#64748B",
                border: role === "admin" ? "1px solid rgba(0, 82, 255, 0.25)" : "none",
                boxShadow: role === "admin" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
              }}
            >
              Administrator
            </Button>
          </Box>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.25}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Full Name / Representative"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                autoFocus
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, "&.Mui-focused fieldset": { borderColor: "#0052FF" } } }}
              />
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, "&.Mui-focused fieldset": { borderColor: "#0052FF" } } }}
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
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, "&.Mui-focused fieldset": { borderColor: "#0052FF" } } }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                size="small"
                required
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, "&.Mui-focused fieldset": { borderColor: "#0052FF" } } }}
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
                {loading ? "Creating account…" : role === "admin" ? "Register Administrator Account" : "Register Shipper Account"}
              </Button>
              <Typography variant="body2" align="center" sx={{ color: "#475569" }}>
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{ fontWeight: 700, color: "#0052FF", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
