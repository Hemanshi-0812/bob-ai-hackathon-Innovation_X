import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  origin: String,
  destination: String,
  currentLocation: String,
  routeRegions: [String],
  mode: String,
  carrier: String,
  cargoType: String,
  cargoValueUsd: Number,
  isColdChain: Boolean,
  eta: Date,
  deadlineAt: Date,
  startedAt: Date,
  hoursElapsed: Number,
  createdBy: { type: String, default: "system" },
  userId: { type: String },
  status: { type: String, default: "In Transit" },
  priority: { type: String, default: "Standard" },
  notes: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Shipment", shipmentSchema);
