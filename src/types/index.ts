export type City = {
  id: number;
  x: number;
  y: number;
};

export type SegmentDistance = {
  from: number;
  to: number;
  distance: number;
};

export type RouteResult = {
  route: number[];
  totalDistance: number;
  segmentDistances: SegmentDistance[];
};
