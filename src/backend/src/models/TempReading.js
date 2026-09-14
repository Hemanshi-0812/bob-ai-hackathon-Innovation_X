import mongoose from "mongoose";

const tempReadingSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, index: true },
  timestamp: Date,
  temperatureC: Number,
  requiredMinC: Number,
  requiredMaxC: Number,
});

export default mongoose.model("TempReading", tempReadingSchema);
