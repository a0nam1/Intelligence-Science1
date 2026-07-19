import type { City, RouteResult } from "../types";
import { factorialBigInt } from "./math";

const EPSILON = 1e-10;

export function calculateSolutionCount(cityCount: number): bigint {
  if (!Number.isInteger(cityCount) || cityCount < 3) {
    throw new Error("都市数は3以上の整数で入力してください。");
  }
  return factorialBigInt(cityCount - 1) / 2n;
}

export function calculateDistance(cityA: City, cityB: City): number {
  validateCity(cityA);
  validateCity(cityB);
  return Math.hypot(cityB.x - cityA.x, cityB.y - cityA.y);
}

export function calculateRouteDistance(route: number[], cities: City[]): RouteResult {
  validateCities(cities, 3, Number.POSITIVE_INFINITY);

  const normalizedRoute = normalizeRoute(route);
  validateRoute(normalizedRoute, cities);

  const cityMap = new Map(cities.map((city) => [city.id, city]));
  const closedRoute = [...normalizedRoute, normalizedRoute[0]];
  const segmentDistances = closedRoute.slice(0, -1).map((from, index) => {
    const to = closedRoute[index + 1];
    const fromCity = cityMap.get(from);
    const toCity = cityMap.get(to);

    if (!fromCity || !toCity) {
      throw new Error("存在しない都市番号が含まれています。");
    }

    return {
      from,
      to,
      distance: calculateDistance(fromCity, toCity),
    };
  });

  const totalDistance = segmentDistances.reduce((sum, segment) => sum + segment.distance, 0);
  return {
    route: normalizedRoute,
    totalDistance,
    segmentDistances,
  };
}

export function generatePermutations(values: number[]): number[][] {
  if (values.length <= 1) {
    return [values];
  }

  return values.flatMap((value, index) => {
    const remaining = values.slice(0, index).concat(values.slice(index + 1));
    return generatePermutations(remaining).map((permutation) => [value, ...permutation]);
  });
}

export function findShortestRoutes(cities: City[]): RouteResult[] {
  validateCities(cities, 3, 10);

  const startCity = cities.find((city) => city.id === 1);
  if (!startCity) {
    throw new Error("都市1が必要です。");
  }

  const otherCityIds = cities
    .filter((city) => city.id !== 1)
    .map((city) => city.id);
  const candidates = generatePermutations(otherCityIds).map((permutation) =>
    calculateRouteDistance([1, ...permutation], cities),
  );

  const shortestDistance = Math.min(...candidates.map((candidate) => candidate.totalDistance));
  return candidates.filter((candidate) => Math.abs(candidate.totalDistance - shortestDistance) < EPSILON);
}

export function validateCities(cities: City[], min: number, max: number): void {
  if (!Number.isInteger(cities.length) || cities.length < min || cities.length > max) {
    throw new Error(`都市数は${min}～${max}の整数で入力してください。`);
  }

  const ids = new Set<number>();
  for (const city of cities) {
    validateCity(city);
    if (!Number.isInteger(city.id) || city.id < 1) {
      throw new Error("都市番号が不正です。");
    }
    if (ids.has(city.id)) {
      throw new Error("都市番号が重複しています。");
    }
    ids.add(city.id);
  }
}

function normalizeRoute(route: number[]): number[] {
  if (route.length > 1 && route[0] === route[route.length - 1]) {
    return route.slice(0, -1);
  }
  return route;
}

function validateRoute(route: number[], cities: City[]): void {
  if (route.length !== cities.length) {
    throw new Error("すべての都市を1回ずつ含めてください。");
  }
  if (route[0] !== 1) {
    throw new Error("経路は都市1から始めてください。");
  }

  const cityIds = new Set(cities.map((city) => city.id));
  const routeIds = new Set<number>();

  for (const id of route) {
    if (!Number.isInteger(id)) {
      throw new Error("都市番号は整数で入力してください。");
    }
    if (!cityIds.has(id)) {
      throw new Error(`都市${id}は存在しません。`);
    }
    if (routeIds.has(id)) {
      throw new Error(`都市${id}が重複しています。`);
    }
    routeIds.add(id);
  }

  if (routeIds.size !== cityIds.size) {
    throw new Error("すべての都市を1回ずつ含めてください。");
  }
}

function validateCity(city: City): void {
  if (!Number.isFinite(city.x) || !Number.isFinite(city.y)) {
    throw new Error(`都市${city.id}の座標を正しい数値で入力してください。`);
  }
}
