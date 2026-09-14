import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterUserVisibleShipments,
  filterUserVisibleDisruptions,
  filterUserVisibleFleetAssets,
  isAdmin,
  isRegionalManager,
  isShipmentUser,
} from '../src/utils/access.js';

test('admin sees all shipments', () => {
  const shipments = [{ shipmentId: 'SHP-1', routeRegions: ['US-West', 'EU-North'] }];
  assert.deepEqual(filterUserVisibleShipments(shipments, { role: 'admin' }), shipments);
});

test('shipment user sees all shipments in the simplified two-role model', () => {
  const shipments = [
    { shipmentId: 'SHP-1', origin: 'US-West', destination: 'EU-North', routeRegions: ['US-West', 'EU-North'] },
    { shipmentId: 'SHP-2', origin: 'EU-North', destination: 'Asia-SE', routeRegions: ['EU-North', 'Asia-SE'] },
    { shipmentId: 'SHP-3', origin: 'LatAm-East', destination: 'US-East', routeRegions: ['LatAm-East', 'US-East'] },
  ];

  assert.deepEqual(
    filterUserVisibleShipments(shipments, { role: 'shipment_user', region: 'US-West' }).map((s) => s.shipmentId),
    ['SHP-1', 'SHP-2', 'SHP-3']
  );
});

test('admin sees all disruptions', () => {
  const disruptions = [{ disruptionId: 'DIS-1', region: 'US-West' }, { disruptionId: 'DIS-2', region: 'EU-North' }];
  assert.deepEqual(filterUserVisibleDisruptions(disruptions, { role: 'admin' }), disruptions);
});

test('shipment user sees all disruptions in the simplified two-role model', () => {
  const disruptions = [
    { disruptionId: 'DIS-1', region: 'US-West' },
    { disruptionId: 'DIS-2', region: 'EU-North' },
    { disruptionId: 'DIS-3', region: 'US-West' },
  ];

  assert.deepEqual(
    filterUserVisibleDisruptions(disruptions, { role: 'shipment_user', region: 'US-West' }).map((d) => d.disruptionId),
    ['DIS-1', 'DIS-2', 'DIS-3']
  );
});

test('admin sees all fleet assets', () => {
  const fleet = [{ assetId: 'AST-1', homeRegion: 'US-West', currentRegion: 'US-West' }, { assetId: 'AST-2', homeRegion: 'EU-North', currentRegion: 'EU-North' }];
  assert.deepEqual(filterUserVisibleFleetAssets(fleet, { role: 'admin' }), fleet);
});

test('shipment user sees all fleet assets in the simplified two-role model', () => {
  const fleet = [
    { assetId: 'AST-1', homeRegion: 'US-West', currentRegion: 'US-West' },
    { assetId: 'AST-2', homeRegion: 'EU-North', currentRegion: 'EU-North' },
    { assetId: 'AST-3', homeRegion: 'US-West', currentRegion: 'Asia-SE' },
  ];

  assert.deepEqual(
    filterUserVisibleFleetAssets(fleet, { role: 'shipment_user', region: 'US-West' }).map((a) => a.assetId),
    ['AST-1', 'AST-2', 'AST-3']
  );
});

test('role helpers identify expected access types', () => {
  assert.equal(isAdmin({ role: 'admin' }), true);
  assert.equal(isShipmentUser({ role: 'shipment_user' }), true);
  assert.equal(isRegionalManager({ role: 'shipment_user' }), false);
  assert.equal(isRegionalManager({ role: 'operator' }), false);
});
