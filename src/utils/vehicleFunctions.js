import {
  VEHICLE_SPEED,
  MIN_TURN_SPEED,
  EARTH_RADIUS,
  HEADING_LOOKAHEAD,
  HEADING_LOOKBEHIND,
  CURVE_DETECTION_DISTANCE,
} from '../data/vehicle';

// AI-assisted: see docs/AI_LOG.md #16.
export function getVehicleSize(latitudeDelta) {
  if (latitudeDelta <= 0.0015) return 76;
  if (latitudeDelta <= 0.004) return 64;
  if (latitudeDelta <= 0.01) return 56;
  if (latitudeDelta <= 0.03) return 48;
  return 40;
}

export function getDistance(start, end) {
  const radians = Math.PI / 180;
  const latitudeDifference = (end.latitude - start.latitude) * radians;
  const longitudeDifference = (end.longitude - start.longitude) * radians;
  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(start.latitude * radians) *
      Math.cos(end.latitude * radians) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 2 * EARTH_RADIUS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getHeading(start, end) {
  const radians = Math.PI / 180;

  const startLatitude = start.latitude * radians;
  const endLatitude = end.latitude * radians;

  const longitudeDifference = (end.longitude - start.longitude) * radians;

  const y = Math.sin(longitudeDifference) * Math.cos(endLatitude);

  const x =
    Math.cos(startLatitude) * Math.sin(endLatitude) -
    Math.sin(startLatitude) *
      Math.cos(endLatitude) *
      Math.cos(longitudeDifference);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function getAngleDifference(current, target) {
  return ((target - current + 540) % 360) - 180;
}

export function rotateTowards(current, target, maxChange) {
  const difference = getAngleDifference(current, target);

  const adjustment = Math.max(-maxChange, Math.min(maxChange, difference));

  return (current + adjustment + 360) % 360;
}

export function interpolatePosition(start, end, progress) {
  const value = Math.max(0, Math.min(1, progress));

  return {
    latitude: start.latitude + (end.latitude - start.latitude) * value,
    longitude: start.longitude + (end.longitude - start.longitude) * value,
  };
}

export function buildRoute(coordinates) {
  const points = [];
  const distances = [];

  for (const point of coordinates) {
    if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) {
      continue;
    }

    if (points.length === 0) {
      points.push(point);
      distances.push(0);
      continue;
    }

    const distance = getDistance(points[points.length - 1], point);

    if (distance < 0.01) continue;

    points.push(point);

    distances.push(distances[distances.length - 1] + distance);
  }

  return {
    points,
    distances,
    totalDistance: distances[distances.length - 1] ?? 0,
  };
}

export function getPositionAtDistance(route, distance) {
  const { points, distances, totalDistance } = route;

  if (distance <= 0) return points[0];

  if (distance >= totalDistance) {
    return points[points.length - 1];
  }

  let low = 0;
  let high = distances.length - 1;

  while (low < high - 1) {
    const middle = Math.floor((low + high) / 2);

    if (distances[middle] <= distance) {
      low = middle;
    } else {
      high = middle;
    }
  }

  const segmentDistance = distances[high] - distances[low];

  const progress = (distance - distances[low]) / segmentDistance;

  return interpolatePosition(points[low], points[high], progress);
}

export function getSmoothedHeading(route, distance) {
  const behind = getPositionAtDistance(
    route,
    Math.max(0, distance - HEADING_LOOKBEHIND),
  );

  const ahead = getPositionAtDistance(
    route,
    Math.min(route.totalDistance, distance + HEADING_LOOKAHEAD),
  );

  if (getDistance(behind, ahead) < 0.01) {
    return null;
  }

  return getHeading(behind, ahead);
}

export function getTargetSpeed(route, distance) {
  const before = Math.max(0, distance - CURVE_DETECTION_DISTANCE / 2);

  const after = Math.min(
    route.totalDistance,
    distance + CURVE_DETECTION_DISTANCE,
  );

  const headingBefore = getSmoothedHeading(route, before);

  const headingAfter = getSmoothedHeading(route, after);

  if (headingBefore === null || headingAfter === null) {
    return VEHICLE_SPEED;
  }

  const angleDifference = Math.abs(
    getAngleDifference(headingBefore, headingAfter),
  );

  if (angleDifference < 12) {
    return VEHICLE_SPEED;
  }

  const intensity = Math.min(angleDifference / 90, 1);

  return VEHICLE_SPEED - (VEHICLE_SPEED - MIN_TURN_SPEED) * intensity;
}

export function approachValue(current, target, maxChange) {
  if (current < target) {
    return Math.min(current + maxChange, target);
  }

  return Math.max(current - maxChange, target);
}
