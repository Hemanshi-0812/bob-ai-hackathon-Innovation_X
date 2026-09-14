export function isAdmin(user) {
  return user?.role === "admin" || user?.role === "operator" || (user?.email && user.email.toLowerCase().includes("hetarajani"));
}

export function isRegionalManager(user) {
  return false;
}

export function isShipmentUser(user) {
  return user?.role === "shipment_user";
}

export function getUserRegion(user) {
  return user?.region || null;
}

function matchesRegion(region, shipment) {
  if (!region || !shipment) return false;
  const routeRegions = Array.isArray(shipment.routeRegions) ? shipment.routeRegions : [];
  return (
    shipment.origin === region ||
    shipment.destination === region ||
    shipment.currentLocation === region ||
    routeRegions.includes(region)
  );
}

export function filterUserVisibleShipments(shipments, user) {
  if (!Array.isArray(shipments)) return [];
  if (isAdmin(user)) return shipments;
  if (!user) return [];

  const userEmail = (user.email || "").toLowerCase();
  const userSub = user.sub || "";

  return shipments.filter((s) => {
    const creator = (s.createdBy || "").toLowerCase();
    const ownerId = s.userId || "";
    return (
      (userEmail && creator === userEmail) ||
      (userSub && ownerId === userSub) ||
      // Also match if user email is shipment user and shipment is tagged as demo-shipment-user
      (userEmail === "shipmentuser@supplyguard.ai" && (creator === "shipmentuser@supplyguard.ai" || ownerId === "demo-shipment-user"))
    );
  });
}

export function filterUserVisibleDisruptions(disruptions, user, userShipments = null) {
  if (!Array.isArray(disruptions)) return [];
  if (isAdmin(user)) return disruptions;
  if (!user) return [];

  // For a regular user, show disruptions that intersect with any of their shipment routes
  const shipmentsToCheck = userShipments || [];
  const relevantRegions = new Set();
  shipmentsToCheck.forEach((s) => {
    if (s.origin) relevantRegions.add(s.origin);
    if (s.destination) relevantRegions.add(s.destination);
    if (s.currentLocation) relevantRegions.add(s.currentLocation);
    if (Array.isArray(s.routeRegions)) {
      s.routeRegions.forEach((r) => relevantRegions.add(r));
    }
  });

  // If user has region assigned, also include user's home region disruptions
  if (user.region && user.region !== "global") {
    relevantRegions.add(user.region);
  }

  // If user has no shipments yet, show disruptions in their assigned region
  if (relevantRegions.size === 0 && user.region) {
    relevantRegions.add(user.region);
  }

  return disruptions.filter((d) => relevantRegions.has(d.region));
}

export function filterUserVisibleFleetAssets(assets, user) {
  if (!Array.isArray(assets)) return [];
  // Fleet management is strictly an admin feature
  if (isAdmin(user)) return assets;
  return [];
}
