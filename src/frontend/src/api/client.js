const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function getToken() {
  return localStorage.getItem("sg_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    if (path.startsWith("/auth/login") || path.startsWith("/auth/register")) {
      throw new Error(body.error || "Authentication failed. Please check your credentials.");
    }
    localStorage.removeItem("sg_token");
    localStorage.removeItem("sg_user");
    window.location.href = "/login";
    throw new Error(body.error || "Session expired. Please log in again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email, password, role = "admin") =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password, role }) }),
  switchRole: (role) =>
    request("/auth/switch-role", { method: "POST", body: JSON.stringify({ role }) }),
  register: (name, email, password, role = "shipment_user") =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, role }) }),

  getDashboardSummary: () => request("/dashboard/summary"),
  addDashboardData: (payload) =>
    request("/dashboard/data", { method: "POST", body: JSON.stringify(payload) }),

  getShipments: (shipper) => request(`/shipments${shipper ? `?shipper=${encodeURIComponent(shipper)}` : ""}`),
  getShipmentById: (id) => request(`/shipments/${id}`),
  createShipment: (payload) =>
    request("/shipments", { method: "POST", body: JSON.stringify(payload) }),
  updateShipment: (id, updates) =>
    request(`/shipments/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
  deleteShipment: (id) =>
    request(`/shipments/${id}`, { method: "DELETE" }),
  getRegionCoords: () => request("/shipments/map/coords"),

  getDisruptions: () => request("/disruptions"),
  getImpactedShipments: (id) => request(`/disruptions/${id}/impacted-shipments`),
  getRerouteRecommendations: (id) => request(`/disruptions/${id}/reroute-recommendations`),

  getFleetAssets: () => request("/fleet"),
  getIdleFleet: (disruptionId) =>
    request(`/fleet/idle${disruptionId ? `?disruptionId=${disruptionId}` : ""}`),

  getColdChainReadings: (shipmentId) =>
    request(`/coldchain/readings${shipmentId ? `?shipmentId=${shipmentId}` : ""}`),
  getColdChainExcursions: (shipmentId) =>
    request(`/coldchain/excursions${shipmentId ? `?shipmentId=${shipmentId}` : ""}`),

  getBrief: (disruptionId) => request(`/copilot/brief/${disruptionId}`),
  chatWithBob: (message) =>
    request("/copilot/chat", { method: "POST", body: JSON.stringify({ message }) }),
  getCopilotStatus: () => request("/copilot/status"),

  getSimulatorStatus: () => request("/simulator/status"),
  triggerSimulatorTick: () => request("/simulator/tick", { method: "POST" }),
  toggleSimulator: () => request("/simulator/toggle", { method: "POST" }),
  resetSimulatorDatabase: () => request("/simulator/reset", { method: "POST" }),
};
