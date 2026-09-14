import express from "express";
import cors from "cors";
import morgan from "morgan";

import { requireAuth } from "./middleware/auth.js";
import { state } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import shipmentsRoutes from "./routes/shipments.routes.js";
import disruptionsRoutes from "./routes/disruptions.routes.js";
import fleetRoutes from "./routes/fleet.routes.js";
import coldchainRoutes from "./routes/coldchain.routes.js";
import copilotRoutes from "./routes/copilot.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", mongoConnected: state.mongoConnected });
});

// Public
app.use("/api/auth", authRoutes);

// Protected — everything past this point requires a valid JWT
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/shipments", requireAuth, shipmentsRoutes);
app.use("/api/disruptions", requireAuth, disruptionsRoutes);
app.use("/api/fleet", requireAuth, fleetRoutes);
app.use("/api/coldchain", requireAuth, coldchainRoutes);
app.use("/api/copilot", requireAuth, copilotRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
