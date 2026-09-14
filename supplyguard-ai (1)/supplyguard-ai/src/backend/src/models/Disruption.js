import mongoose from "mongoose";

const disruptionSchema = new mongoose.Schema({
  disruptionId: { type: String, required: true, unique: true },
  type: String,
  region: String,
  description: String,
  startedAt: Date,
  estimatedDurationHours: Number,
  severity: String,
});

export default mongoose.model("Disruption", disruptionSchema);
