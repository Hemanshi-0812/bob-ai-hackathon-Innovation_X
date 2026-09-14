import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Shipments from "./pages/Shipments.jsx";
import Disruptions from "./pages/Disruptions.jsx";
import RiskAnalysis from "./pages/RiskAnalysis.jsx";
import Rerouting from "./pages/Rerouting.jsx";
import Fleet from "./pages/Fleet.jsx";
import ColdChain from "./pages/ColdChain.jsx";
import Copilot from "./pages/Copilot.jsx";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
            <Route path="/disruptions" element={<ProtectedRoute><Disruptions /></ProtectedRoute>} />
            <Route path="/risk-analysis" element={<ProtectedRoute><RiskAnalysis /></ProtectedRoute>} />
            <Route path="/rerouting" element={<ProtectedRoute><Rerouting /></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute><Fleet /></ProtectedRoute>} />
            <Route path="/coldchain" element={<ProtectedRoute><ColdChain /></ProtectedRoute>} />
            <Route path="/copilot" element={<ProtectedRoute><Copilot /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
