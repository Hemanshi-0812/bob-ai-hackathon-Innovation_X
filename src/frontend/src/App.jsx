import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Home from "./pages/Home.jsx";
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
import UserProfile from "./pages/UserProfile.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Enterprise Home Page */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Authenticated Workspace & Command Center */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/shipments" element={<ProtectedRoute><Shipments /></ProtectedRoute>} />
            <Route path="/coldchain" element={<ProtectedRoute><ColdChain /></ProtectedRoute>} />
            <Route path="/copilot" element={<ProtectedRoute><Copilot /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

            {/* Admin-only operations modules */}
            <Route path="/disruptions" element={<ProtectedRoute><AdminRoute><Disruptions /></AdminRoute></ProtectedRoute>} />
            <Route path="/risk-analysis" element={<ProtectedRoute><AdminRoute><RiskAnalysis /></AdminRoute></ProtectedRoute>} />
            <Route path="/rerouting" element={<ProtectedRoute><AdminRoute><Rerouting /></AdminRoute></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute><AdminRoute><Fleet /></AdminRoute></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
