import Shipment from "../models/Shipment.js";
import FleetAsset from "../models/FleetAsset.js";
import Disruption from "../models/Disruption.js";
import TempReading from "../models/TempReading.js";
import * as mock from "../data/mockData.js";
import { state } from "../config/db.js";

function toPlain(doc) {
  return doc.toObject ? doc.toObject() : doc;
}

export async function getShipments() {
  if (state.mongoConnected) return (await Shipment.find()).map(toPlain);
  return mock.shipments;
}

export async function getFleetAssets() {
  if (state.mongoConnected) return (await FleetAsset.find()).map(toPlain);
  return mock.fleetAssets;
}

export async function getDisruptions() {
  if (state.mongoConnected) return (await Disruption.find()).map(toPlain);
  return mock.disruptions;
}

export async function getDisruptionById(disruptionId) {
  if (state.mongoConnected) {
    const doc = await Disruption.findOne({ disruptionId });
    return doc ? toPlain(doc) : null;
  }
  return mock.disruptions.find((d) => d.disruptionId === disruptionId) || null;
}

export async function getColdChainReadings(shipmentId) {
  let readings;
  if (state.mongoConnected) {
    readings = (await TempReading.find(shipmentId ? { shipmentId } : {})).map(toPlain);
  } else {
    readings = mock.coldChainReadings;
    if (shipmentId) readings = readings.filter((r) => r.shipmentId === shipmentId);
  }
  return readings;
}

export { REGION_COORDS } from "../data/mockData.js";
