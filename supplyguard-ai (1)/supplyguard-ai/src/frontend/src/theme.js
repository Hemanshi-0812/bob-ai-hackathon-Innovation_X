import { createTheme } from "@mui/material/styles";

// ---------------------------------------------------------------------------
// SupplyGuard AI — Adaptive Enterprise Design Tokens
// Supports dynamic switching between Cybernetic Dark & Enterprise Light modes.
// ---------------------------------------------------------------------------

export const tokens = {
  navy: "#070B14",
  navy800: "#0F172A",
  navy700: "#1E293B",
  indigo: "var(--sg-indigo, #0052FF)",
  indigoDark: "#0043D1",
  indigoSoft: "var(--sg-indigo-soft, rgba(0, 82, 255, 0.12))",
  cyan: "#06B6D4",
  cyanSoft: "var(--sg-cyan-soft, rgba(6, 182, 212, 0.15))",
  purple: "#6366F1",
  purpleSoft: "var(--sg-purple-soft, rgba(99, 102, 241, 0.15))",
  bg: "var(--sg-bg, #070B14)",
  card: "var(--sg-card, #0F172A)",
  glassCard: "var(--sg-glass-card, rgba(15, 23, 42, 0.85))",
  glassBorder: "var(--sg-glass-border, rgba(148, 163, 184, 0.15))",
  text: "var(--sg-text, #F8FAFC)",
  textMuted: "var(--sg-text-muted, #94A3B8)",
  textFaint: "var(--sg-text-faint, #64748B)",
  border: "var(--sg-border, rgba(148, 163, 184, 0.14))",
  borderStrong: "var(--sg-border-strong, rgba(148, 163, 184, 0.28))",
  emerald: "#10B981",
  emeraldSoft: "var(--sg-emerald-soft, rgba(16, 185, 129, 0.15))",
  amber: "#F59E0B",
  amberSoft: "var(--sg-amber-soft, rgba(245, 158, 11, 0.15))",
  red: "#EF4444",
  redSoft: "var(--sg-red-soft, rgba(239, 68, 68, 0.15))",
  blueSoft: "var(--sg-blue-soft, rgba(0, 82, 255, 0.12))",
  shadow: "var(--sg-shadow, rgba(0, 0, 0, 0.35))",
  gradientPrimary: "linear-gradient(135deg, #0284C7 0%, #2563EB 50%, #4F46E5 100%)",
  gradientCard: "var(--sg-card-gradient, linear-gradient(180deg, #111A2E 0%, #0D1527 100%))",
  gradientDark: "linear-gradient(180deg, #070B14 0%, #0F172A 100%)",
  topbarBg: "var(--sg-topbar-bg, rgba(7, 11, 20, 0.88))",
  bodyGradient: "var(--sg-body-gradient, radial-gradient(circle at top left, rgba(14,165,233,0.15), transparent 28%), linear-gradient(180deg, #070B14 0%, #0B1120 100%))",
};

export function getAppTheme(mode = "dark") {
  const isDark = mode === "dark";

  const palette = isDark
    ? {
        mode: "dark",
        background: { default: "#070B14", paper: "#0F172A" },
        primary: { main: "#38BDF8", dark: "#0284C7", light: "rgba(56, 189, 248, 0.15)", contrastText: "#FFFFFF" },
        secondary: { main: "#06B6D4", contrastText: "#FFFFFF" },
        success: { main: "#10B981", light: "rgba(16,185,129,0.18)", contrastText: "#FFFFFF" },
        warning: { main: "#F59E0B", light: "rgba(245,158,11,0.18)", contrastText: "#FFFFFF" },
        error: { main: "#EF4444", light: "rgba(239,68,68,0.18)", contrastText: "#FFFFFF" },
        text: { primary: "#F8FAFC", secondary: "#94A3B8", disabled: "#64748B" },
        divider: "rgba(148, 163, 184, 0.14)",
      }
    : {
        mode: "light",
        background: { default: "#F4F7FC", paper: "#FFFFFF" },
        primary: { main: "#0052FF", dark: "#0043D1", light: "#EFF6FF", contrastText: "#FFFFFF" },
        secondary: { main: "#0284C7", contrastText: "#FFFFFF" },
        success: { main: "#10B981", light: "#ECFDF5", contrastText: "#FFFFFF" },
        warning: { main: "#F59E0B", light: "#FFFBEB", contrastText: "#FFFFFF" },
        error: { main: "#DC2626", light: "#FEF2F2", contrastText: "#FFFFFF" },
        text: { primary: "#0A192F", secondary: "#475569", disabled: "#94A3B8" },
        divider: "#E2E8F0",
      };

  return createTheme({
    palette,
    shape: { borderRadius: 14 },
    spacing: 8,
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.02em" },
      h2: { fontWeight: 800, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700, letterSpacing: "-0.015em" },
      h4: { fontWeight: 700, letterSpacing: "-0.015em", fontSize: "1.75rem" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em", fontSize: "1.25rem" },
      h6: { fontWeight: 700, letterSpacing: "-0.005em", fontSize: "1.0625rem" },
      subtitle1: { fontWeight: 600, fontSize: "0.9375rem" },
      subtitle2: { fontWeight: 600, fontSize: "0.8125rem", color: isDark ? "#94A3B8" : "#64748B" },
      body1: { fontSize: "0.9375rem", lineHeight: 1.55 },
      body2: { fontSize: "0.8375rem", lineHeight: 1.55 },
      caption: { fontSize: "0.75rem", color: isDark ? "#94A3B8" : "#64748B" },
      button: { fontWeight: 600, textTransform: "none", letterSpacing: 0 },
      overline: { fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.6875rem" },
    },
    shadows: [
      "none",
      isDark ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 2px rgba(15,23,42,0.04)",
      isDark ? "0 2px 6px rgba(0,0,0,0.45)" : "0 1px 3px rgba(15,23,42,0.06)",
      isDark ? "0 4px 10px rgba(0,0,0,0.5)" : "0 2px 6px rgba(15,23,42,0.06)",
      isDark ? "0 6px 14px rgba(0,0,0,0.55)" : "0 4px 10px rgba(15,23,42,0.07)",
      isDark ? "0 8px 18px rgba(0,0,0,0.6)" : "0 4px 10px rgba(15,23,42,0.07)",
      isDark ? "0 10px 22px rgba(0,0,0,0.65)" : "0 6px 16px rgba(15,23,42,0.08)",
      isDark ? "0 12px 26px rgba(0,0,0,0.7)" : "0 6px 16px rgba(15,23,42,0.08)",
      isDark ? "0 14px 30px rgba(0,0,0,0.75)" : "0 8px 20px rgba(15,23,42,0.09)",
      ...Array(16).fill(isDark ? "0 18px 40px rgba(0,0,0,0.8)" : "0 16px 36px rgba(15,23,42,0.12)"),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": {
            "--sg-indigo": isDark ? "#0052FF" : "#0052FF",
            "--sg-indigo-soft": isDark ? "rgba(0, 82, 255, 0.16)" : "#EFF6FF",
            "--sg-cyan-soft": isDark ? "rgba(2, 132, 199, 0.16)" : "#F0F7FF",
            "--sg-purple-soft": isDark ? "rgba(0, 82, 255, 0.12)" : "#EFF6FF",
            "--sg-bg": isDark ? "#080C16" : "#FFFFFF",
            "--sg-card": isDark ? "#0F172A" : "#FFFFFF",
            "--sg-glass-card": isDark ? "rgba(15, 23, 42, 0.88)" : "#FFFFFF",
            "--sg-glass-border": isDark ? "rgba(148, 163, 184, 0.18)" : "#E2E8F0",
            "--sg-text": isDark ? "#F8FAFC" : "#0A192F",
            "--sg-text-muted": isDark ? "#94A3B8" : "#475569",
            "--sg-text-faint": isDark ? "#64748B" : "#94A3B8",
            "--sg-border": isDark ? "rgba(148, 163, 184, 0.16)" : "#E2E8F0",
            "--sg-border-strong": isDark ? "rgba(148, 163, 184, 0.28)" : "#CBD5E1",
            "--sg-emerald-soft": isDark ? "rgba(0, 82, 255, 0.12)" : "#EFF6FF",
            "--sg-amber-soft": isDark ? "rgba(0, 82, 255, 0.12)" : "#EFF6FF",
            "--sg-red-soft": isDark ? "rgba(239, 68, 68, 0.16)" : "#FEF2F2",
            "--sg-blue-soft": isDark ? "rgba(59, 130, 246, 0.16)" : "#EFF6FF",
            "--sg-shadow": isDark ? "rgba(0, 0, 0, 0.35)" : "rgba(15, 23, 42, 0.06)",
            "--sg-card-gradient": isDark
              ? "linear-gradient(180deg, #111A2E 0%, #0D1527 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
            "--sg-topbar-bg": isDark ? "rgba(11, 18, 32, 0.85)" : "rgba(255, 255, 255, 0.85)",
            "--sg-body-gradient": isDark
              ? "radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 28%), linear-gradient(180deg, #080C16 0%, #0B1120 100%)"
              : "radial-gradient(circle at top left, rgba(79,70,229,0.08), transparent 24%), linear-gradient(180deg, #f7f9fd 0%, #edf3f9 100%)",
          },
          "::selection": { backgroundColor: isDark ? "rgba(99,102,241,0.3)" : "#EEF2FF", color: isDark ? "#FFFFFF" : "#3B39C9" },
          "*:focus-visible": {
            outline: `2px solid ${isDark ? "#6366F1" : "#4F46E5"}`,
            outlineOffset: "2px",
          },
          body: {
            backgroundColor: isDark ? "#080C16" : "#F4F7FC",
            color: isDark ? "#F8FAFC" : "#0F172A",
            transition: "background-color 200ms ease, color 200ms ease",
          },
          "::-webkit-scrollbar": { width: 10, height: 10 },
          "::-webkit-scrollbar-track": { background: isDark ? "#0B1220" : "transparent" },
          "::-webkit-scrollbar-thumb": { background: isDark ? "#1E293B" : "#CBD5E1", borderRadius: 8 },
          "::-webkit-scrollbar-thumb:hover": { background: isDark ? "#334155" : "#94A3B8" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none", backgroundColor: isDark ? "#0F172A" : "#FFFFFF" },
          outlined: { borderColor: isDark ? "rgba(148, 163, 184, 0.16)" : "#E2E8F0" },
        },
        defaultProps: { elevation: 0 },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? "rgba(148, 163, 184, 0.16)" : "#E2E8F0"}`,
            borderRadius: 18,
            boxShadow: isDark ? "0 12px 28px rgba(0, 0, 0, 0.45)" : "0 12px 28px rgba(15, 23, 42, 0.05)",
            background: isDark
              ? "linear-gradient(180deg, #111A2E 0%, #0D1527 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
            transition: "background 200ms ease, border-color 200ms ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, paddingInline: 16, paddingBlock: 8, fontWeight: 600 },
          contained: {
            boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
            "&:hover": { boxShadow: "0 4px 14px rgba(99,102,241,0.35)" },
          },
          containedPrimary: {
            background: isDark ? "#6366F1" : "#4F46E5",
            "&:hover": { background: isDark ? "#4F46E5" : "#3B39C9" },
          },
          outlined: {
            borderColor: isDark ? "rgba(148, 163, 184, 0.24)" : "#E2E8F0",
            "&:hover": {
              borderColor: isDark ? "#6366F1" : "#4F46E5",
              backgroundColor: isDark ? "rgba(99, 102, 241, 0.12)" : "#EEF2FF",
            },
          },
        },
        defaultProps: { disableElevation: true },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontWeight: 600, fontSize: "0.6875rem" },
          label: { paddingInline: 8 },
          sizeSmall: { height: 22 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor: isDark ? "rgba(148, 163, 184, 0.14)" : "#E2E8F0",
            padding: "12px 16px",
            color: isDark ? "#E2E8F0" : "#0F172A",
          },
          head: {
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: isDark ? "#94A3B8" : "#64748B",
            backgroundColor: isDark ? "#0A101D" : "#F8FAFC",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:last-of-type td": { borderBottom: "none" },
            "&:hover": { backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#F8FAFC" },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: isDark ? "#0D1424" : "#FFFFFF",
            color: isDark ? "#F8FAFC" : "#0F172A",
            "& fieldset": { borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "#E2E8F0" },
            "&:hover fieldset": { borderColor: isDark ? "rgba(148, 163, 184, 0.4)" : "#CBD5E1" },
            "&.Mui-focused fieldset": { borderColor: isDark ? "#6366F1" : "#4F46E5", borderWidth: 1.5 },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            color: isDark ? "#94A3B8" : "#64748B",
            "&.Mui-focused": { color: isDark ? "#818CF8" : "#4F46E5" },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 10, border: "1px solid transparent" },
          standardError: isDark
            ? { backgroundColor: "rgba(239, 68, 68, 0.15)", borderColor: "rgba(239, 68, 68, 0.35)", color: "#FCA5A5" }
            : { backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" },
          standardWarning: isDark
            ? { backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: "rgba(245, 158, 11, 0.35)", color: "#FDE68A" }
            : { backgroundColor: "#FFFBEB", borderColor: "#FDE68A", color: "#92400E" },
          standardSuccess: isDark
            ? { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.35)", color: "#86EFAC" }
            : { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", color: "#065F46" },
          standardInfo: isDark
            ? { backgroundColor: "rgba(59, 130, 246, 0.15)", borderColor: "rgba(59, 130, 246, 0.35)", color: "#93C5FD" }
            : { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE", color: "#1E3A8A" },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { backgroundColor: isDark ? "rgba(148, 163, 184, 0.16)" : "#E2E8F0" },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? "#1E293B" : "#0B1220",
            color: "#FFFFFF",
            fontSize: "0.75rem",
            borderRadius: 6,
            padding: "6px 10px",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isDark ? "rgba(148, 163, 184, 0.14)" : "#E2E8F0" },
        },
      },
    },
  });
}

const theme = getAppTheme("dark");
export default theme;
