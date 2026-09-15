import { getFleetAssets } from "./dataStore.js";

const IDLE_THRESHOLD_HOURS = 2.0;

export async function findIdleAssets(disruption) {
  const assets = await getFleetAssets();
  const demandRegion = disruption?.region || null;

  const idle = assets
    .filter((a) => a.status === "idle" && a.lastActiveHoursAgo >= IDLE_THRESHOLD_HOURS)
    .map((asset) => {
      let suggestion;
      if (demandRegion && asset.currentRegion !== demandRegion) {
        suggestion = `Reposition ${asset.type} ${asset.assetId} from ${asset.currentRegion} toward ${demandRegion} to absorb volume displaced by the active disruption.`;
      } else if (demandRegion) {
        suggestion = `${asset.assetId} is already in ${demandRegion} — assign directly to re-routed shipments instead of sourcing new capacity.`;
      } else {
        suggestion = `No active disruption context; consider ${asset.assetId} for the next available load out of ${asset.currentRegion}.`;
      }

      return {
        asset,
        idleHours: asset.lastActiveHoursAgo,
        redeploymentSuggestion: suggestion,
        nearestDemandRegion: demandRegion,
      };
    });

  return idle.sort((a, b) => b.idleHours - a.idleHours);
}
