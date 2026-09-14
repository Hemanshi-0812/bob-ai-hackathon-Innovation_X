import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { simulator } from "./src/services/simulatorService.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`SupplyGuard AI backend listening on port ${PORT}`);
    // Start background simulation engine (advancing active shipments and IoT telemetry every 12s)
    simulator.start(12000);
  });
}

start();
