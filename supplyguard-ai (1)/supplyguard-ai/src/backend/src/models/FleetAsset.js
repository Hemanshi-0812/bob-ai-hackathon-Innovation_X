import mongoose from "mongoose";

const fleetAssetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  type: String,
  homeRegion: String,
  currentRegion: String,
  status: String,
  capacityUnits: Number,
  lastActiveHoursAgo: Number,
});

export default mongoose.model("FleetAsset", fleetAssetSchema);
