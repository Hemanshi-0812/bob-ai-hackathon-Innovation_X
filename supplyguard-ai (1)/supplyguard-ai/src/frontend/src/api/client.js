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
    localStorage.removeItem("sg_token");
    localStorage.removeItem("sg_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  getDashboardSummary: () => request("/dashboard/summary"),

  getShipments: () => request("/shipments"),
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
};
