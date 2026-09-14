import Shipment from "../models/Shipment.js";
import TempReading from "../models/TempReading.js";
import FleetAsset from "../models/FleetAsset.js";
import Disruption from "../models/Disruption.js";
import { state as dbState } from "../config/db.js";

const REGIONS = [
  "US-West", "US-East", "US-Gulf", "EU-North", "EU-Med",
  "Asia-SE", "Asia-East", "LatAm-East", "Middle-East", "Africa-North",
];

class SimulatorService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.intervalMs = 12000; // 12 seconds per tick
    this.tickCount = 0;
    this.lastTickTime = null;
    this.eventLogs = [];
    this.maxLogs = 50;
  }

  logEvent(type, message, details = {}) {
    const entry = {
      id: `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      ...details,
    };
    this.eventLogs.unshift(entry);
    if (this.eventLogs.length > this.maxLogs) {
      this.eventLogs.pop();
    }
  }

  start(intervalMs = 12000) {
    if (this.isRunning) return;
    this.intervalMs = intervalMs;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.tick().catch((err) => {
        console.error("[Simulator] Tick error:", err.message);
      });
    }, this.intervalMs);
    console.log(`[Simulator] Background simulation service started (interval: ${this.intervalMs}ms)`);
  }

  stop() {
    if (!this.isRunning) return;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("[Simulator] Background simulation paused");
  }

  async tick() {
    this.tickCount++;
    this.lastTickTime = new Date().toISOString();

    if (!dbState.mongoConnected) {
      return { tickCount: this.tickCount, message: "Mongo not connected, skipping DB tick" };
    }

    try {
      const activeDisruptions = await Disruption.find();
      const disruptedRegions = new Set(
        activeDisruptions.filter((d) => ["critical", "high"].includes(d.severity)).map((d) => d.region)
      );

      // 1. Maintain realistic active in-transit shipment volume
      const inTransitCount = await Shipment.countDocuments({ status: "In Transit" });
      if (inTransitCount < 65) {
        // Dispatch new manifests from delivered shipments
        const deliveredShipments = await Shipment.find({ status: "Delivered" }).limit(5);
        for (const s of deliveredShipments) {
          const originIdx = Math.floor(Math.random() * REGIONS.length);
          let destIdx = Math.floor(Math.random() * REGIONS.length);
          while (destIdx === originIdx) {
            destIdx = Math.floor(Math.random() * REGIONS.length);
          }
          const origin = REGIONS[originIdx];
          const destination = REGIONS[destIdx];
          const waypoint = REGIONS[Math.floor(Math.random() * REGIONS.length)];
          const route = [origin, waypoint, destination];

          await Shipment.updateOne(
            { _id: s._id },
            {
              $set: {
                origin,
                destination,
                currentLocation: origin,
                routeRegions: route,
                status: "In Transit",
                hoursElapsed: 1,
                startedAt: new Date(),
                eta: new Date(Date.now() + (36 + Math.floor(Math.random() * 72)) * 3600 * 1000),
              },
            }
          );
          this.logEvent(
            "MANIFEST_DISPATCH",
            `New intermodal manifest dispatched for ${s.shipmentId}: ${origin} → ${destination}`,
            { shipmentId: s.shipmentId, origin, destination }
          );
        }
      }

      // 2. Advance a sample batch of active in-transit shipments
      const activeShipments = await Shipment.aggregate([
        { $match: { status: { $in: ["In Transit", "Delayed"] } } },
        { $sample: { size: 10 } }
      ]);
      
      for (const shipment of activeShipments) {
        const route = shipment.routeRegions || [shipment.origin, shipment.destination];
        const newHours = (shipment.hoursElapsed || 0) + 1;
        
        let newLocation = shipment.currentLocation;
        let newStatus = shipment.status;

        // Dynamic waypoint progression
        const currentIdx = route.indexOf(shipment.currentLocation);
        if (currentIdx !== -1 && currentIdx < route.length - 1 && Math.random() > 0.6) {
          newLocation = route[currentIdx + 1];
          this.logEvent(
            "SHIPMENT_MOVE",
            `Shipment ${shipment.shipmentId} reached corridor waypoint: ${newLocation}`,
            { shipmentId: shipment.shipmentId, from: shipment.currentLocation, to: newLocation }
          );
        }

        // Completion requires reaching destination and having sufficient elapsed transit time
        if (newLocation === shipment.destination && newHours >= 36 && Math.random() > 0.7) {
          newStatus = "Delivered";
          this.logEvent(
            "SHIPMENT_DELIVERED",
            `Shipment ${shipment.shipmentId} delivered safely at ${shipment.destination}`,
            { shipmentId: shipment.shipmentId }
          );
        } else if (disruptedRegions.has(newLocation)) {
          newStatus = "Delayed";
          this.logEvent(
            "DISRUPTION_INTERCEPT",
            `Shipment ${shipment.shipmentId} entered disruption zone at ${newLocation}`,
            { shipmentId: shipment.shipmentId, region: newLocation }
          );
        } else if (newStatus === "Delayed" && !disruptedRegions.has(newLocation) && Math.random() > 0.5) {
          newStatus = "In Transit";
          this.logEvent(
            "SHIPMENT_RESUMED",
            `Shipment ${shipment.shipmentId} cleared disruption corridor at ${newLocation}`,
            { shipmentId: shipment.shipmentId }
          );
        }

        await Shipment.updateOne(
          { _id: shipment._id },
          {
            $set: {
              hoursElapsed: newHours,
              currentLocation: newLocation,
              status: newStatus,
            },
          }
        );
      }

      // 3. Stream dynamic IoT temperature readings for cold-chain shipments
      const coldShipments = await Shipment.aggregate([
        { $match: { isColdChain: true, status: { $in: ["In Transit", "Delayed"] } } },
        { $sample: { size: 6 } }
      ]);
      const newReadings = [];

      for (const s of coldShipments) {
        const isUltraCold = (s.cargoType || "").includes("-20°C") || (s.cargoType || "").includes("-15°C");
        const minC = isUltraCold ? -25.0 : 2.0;
        const maxC = isUltraCold ? -15.0 : 8.0;
        const midC = (minC + maxC) / 2;

        // 90% normal reading, 10% excursion anomaly
        const hasExcursion = Math.random() < 0.12;
        let temp = Number((midC + (Math.random() * 2.0 - 1.0)).toFixed(2));
        if (hasExcursion) {
          temp = Number((maxC + Math.random() * 3.5).toFixed(2));
          this.logEvent(
            "COLDCHAIN_EXCURSION",
            `Thermal breach detected on ${s.shipmentId}: ${temp}°C (Allowed: ${minC}°C to ${maxC}°C)`,
            { shipmentId: s.shipmentId, temperatureC: temp, maxC }
          );
        }

        newReadings.push({
          shipmentId: s.shipmentId,
          timestamp: new Date(),
          temperatureC: temp,
          requiredMinC: minC,
          requiredMaxC: maxC,
        });
      }

      if (newReadings.length > 0) {
        await TempReading.insertMany(newReadings);
      }

      // 4. Dynamic Fleet Asset Telematics
      const fleetSample = await FleetAsset.aggregate([{ $sample: { size: 3 } }]);
      for (const asset of fleetSample) {
        let newStatus = asset.status;
        if (asset.status === "idle" && Math.random() > 0.5) newStatus = "loading";
        else if (asset.status === "loading" && Math.random() > 0.4) newStatus = "in_transit";
        else if (asset.status === "in_transit" && Math.random() > 0.6) newStatus = "idle";

        const newHours = asset.status === "idle" ? Number(((asset.lastActiveHoursAgo || 1) + 0.2).toFixed(1)) : 0.1;
        await FleetAsset.updateOne(
          { _id: asset._id },
          { $set: { status: newStatus, lastActiveHoursAgo: newHours } }
        );
      }

      return {
        success: true,
        tickCount: this.tickCount,
        lastTickTime: this.lastTickTime,
        updatedShipments: activeShipments.length,
        newTelemetryReadings: newReadings.length,
      };
    } catch (err) {
      console.error("[Simulator] Error during tick:", err);
      throw err;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs,
      tickCount: this.tickCount,
      lastTickTime: this.lastTickTime,
      totalEventsLogged: this.eventLogs.length,
      recentEvents: this.eventLogs.slice(0, 15),
    };
  }
}

export const simulator = new SimulatorService();
