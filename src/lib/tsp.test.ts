import { describe, expect, it } from "vitest";
import { formatFixed4 } from "./format";
import {
  calculateDistance,
  calculateRouteDistance,
  calculateSolutionCount,
  findShortestRoutes,
} from "./tsp";
import type { City } from "../types";

const sampleCities: City[] = [
  { id: 1, x: 3.21, y: 6.54 },
  { id: 2, x: 9.87, y: 4.32 },
  { id: 3, x: 7.65, y: 0.98 },
  { id: 4, x: 5.43, y: 8.76 },
];

describe("TSP calculation helpers", () => {
  it("calculates the symmetric TSP solution count for 11 cities", () => {
    expect(calculateSolutionCount(11)).toBe(1814400n);
  });

  it("formats the distance between two cities to four decimal places", () => {
    const distance = calculateDistance(
      { id: 1, x: 1.2, y: 3.4 },
      { id: 2, x: 5.6, y: 7.8 },
    );

    expect(formatFixed4(distance)).toBe("6.2225");
  });

  it("finds the sample shortest distance", () => {
    const [shortestRoute] = findShortestRoutes(sampleCities);

    expect(formatFixed4(shortestRoute.totalDistance)).toBe("20.5444");
  });

  it("calculates equal distances for a route and its reverse", () => {
    const routeA = calculateRouteDistance([1, 3, 2, 4], sampleCities);
    const routeB = calculateRouteDistance([1, 4, 2, 3], sampleCities);

    expect(routeA.totalDistance).toBeCloseTo(routeB.totalDistance, 12);
  });

  it("includes the return segment from city 4 to city 1", () => {
    const result = calculateRouteDistance([1, 3, 2, 4], sampleCities);

    expect(result.segmentDistances[result.segmentDistances.length - 1]).toMatchObject({ from: 4, to: 1 });
  });
});
