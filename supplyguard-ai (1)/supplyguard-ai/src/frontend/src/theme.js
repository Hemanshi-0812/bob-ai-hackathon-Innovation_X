import { createTheme } from "@mui/material/styles";

// ---------------------------------------------------------------------------
// SupplyGuard AI — Enterprise design tokens
// Deep navy / indigo / off-white system. Status color (emerald/amber/red)
// is reserved exclusively for state (severity, risk, success/failure).
// ---------------------------------------------------------------------------

export const tokens = {
  navy: "#0F172A",
  navy800: "#152037",
  navy700: "#1C2942",
  indigo: "#4F46E5",
  indigoDark: "#4338CA",
  indigoSoft: "#EEF2FF",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#1E293B",
  textMuted: "#64748B",
  textFaint: "#94A3B8",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  emerald: "#059669",
  emeraldSoft: "#ECFDF5",
  amber: "#D97706",
  amberSoft: "#FFFBEB",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  blueSoft: "#EFF6FF",
};

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: tokens.bg, paper: tokens.card },
    primary: { main: tokens.indigo, dark: tokens.indigoDark, light: tokens.indigoSoft, contrastText: "#FFFFFF" },
    secondary: { main: tokens.navy, contrastText: "#FFFFFF" },
    success: { main: tokens.emerald, light: tokens.emeraldSoft, contrastText: "#FFFFFF" },
    warning: { main: tokens.amber, light: tokens.amberSoft, contrastText: "#FFFFFF" },
    error: { main: tokens.red, light: tokens.redSoft, contrastText: "#FFFFFF" },
    text: { primary: tokens.text, secondary: tokens.textMuted, disabled: tokens.textFaint },
    divider: tokens.border,
  },
  shape: { borderRadius: 8 },
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
    subtitle2: { fontWeight: 600, fontSize: "0.8125rem", color: tokens.textMuted },
    body1: { fontSize: "0.9375rem", lineHeight: 1.55 },
    body2: { fontSize: "0.8375rem", lineHeight: 1.55 },
    caption: { fontSize: "0.75rem", color: tokens.textMuted },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: 0 },
    overline: { fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.6875rem" },
  },
  shadows: [
    "none",
    "0 1px 2px rgba(15,23,42,0.04)",
    "0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
    "0 2px 6px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)",
    "0 4px 10px rgba(15,23,42,0.07), 0 1px 3px rgba(15,23,42,0.05)",
    "0 4px 10px rgba(15,23,42,0.07), 0 1px 3px rgba(15,23,42,0.05)",
    "0 6px 16px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.05)",
    "0 6px 16px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.05)",
    "0 8px 20px rgba(15,23,42,0.09), 0 2px 6px rgba(15,23,42,0.05)",
    "0 8px 20px rgba(15,23,42,0.09), 0 2px 6px rgba(15,23,42,0.05)",
    "0 10px 24px rgba(15,23,42,0.10)",
    "0 10px 24px rgba(15,23,42,0.10)",
    "0 12px 28px rgba(15,23,42,0.11)",
    "0 12px 28px rgba(15,23,42,0.11)",
    "0 14px 32px rgba(15,23,42,0.12)",
    "0 14px 32px rgba(15,23,42,0.12)",
    "0 16px 36px rgba(15,23,42,0.13)",
    "0 16px 36px rgba(15,23,42,0.13)",
    "0 18px 40px rgba(15,23,42,0.14)",
    "0 18px 40px rgba(15,23,42,0.14)",
    "0 20px 44px rgba(15,23,42,0.15)",
    "0 20px 44px rgba(15,23,42,0.15)",
    "0 22px 48px rgba(15,23,42,0.16)",
    "0 22px 48px rgba(15,23,42,0.16)",
    "0 24px 52px rgba(15,23,42,0.17)",
    "0 24px 52px rgba(15,23,42,0.17)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::selection": { backgroundColor: tokens.indigoSoft, color: tokens.indigoDark },
        "*:focus-visible": {
          outline: `2px solid ${tokens.indigo}`,
          outlineOffset: "2px",
        },
        body: { backgroundColor: tokens.bg },
        "::-webkit-scrollbar": { width: 10, height: 10 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": { background: tokens.borderStrong, borderRadius: 8 },
        "::-webkit-scrollbar-thumb:hover": { background: tokens.textFaint },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        outlined: { borderColor: tokens.border },
      },
      defaultProps: { elevation: 0 },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${tokens.border}`,
          borderRadius: 12,
          boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 16, paddingBlock: 8, fontWeight: 600 },
        contained: {
          boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
          "&:hover": { boxShadow: "0 4px 10px rgba(79,70,229,0.22)" },
        },
        containedPrimary: {
          background: tokens.indigo,
          "&:hover": { background: tokens.indigoDark },
        },
        outlined: { borderColor: tokens.border, "&:hover": { borderColor: tokens.indigo, backgroundColor: tokens.indigoSoft } },
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
        root: { borderBottomColor: tokens.border, padding: "12px 16px" },
        head: {
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: tokens.textMuted,
          backgroundColor: "#F8FAFC",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-of-type td": { borderBottom: "none" },
          "&:hover": { backgroundColor: "#F8FAFC" },
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
          backgroundColor: tokens.card,
          "& fieldset": { borderColor: tokens.border },
          "&:hover fieldset": { borderColor: tokens.borderStrong },
          "&.Mui-focused fieldset": { borderColor: tokens.indigo, borderWidth: 1.5 },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontSize: "0.875rem" } },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, border: "1px solid transparent" },
        standardError: { backgroundColor: tokens.redSoft, borderColor: "#FECACA", color: "#991B1B" },
        standardWarning: { backgroundColor: tokens.amberSoft, borderColor: "#FDE68A", color: "#92400E" },
        standardSuccess: { backgroundColor: tokens.emeraldSoft, borderColor: "#A7F3D0", color: "#065F46" },
        standardInfo: { backgroundColor: tokens.blueSoft, borderColor: "#BFDBFE", color: "#1E3A8A" },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: tokens.border },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.navy,
          fontSize: "0.75rem",
          borderRadius: 6,
          padding: "6px 10px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: tokens.border } },
    },
  },
});

export default theme;
