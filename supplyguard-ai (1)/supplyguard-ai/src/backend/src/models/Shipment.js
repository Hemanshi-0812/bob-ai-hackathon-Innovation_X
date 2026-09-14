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
});

export default mongoose.model("Shipment", shipmentSchema);
