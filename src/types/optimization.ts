export type QuadraticCoefficients = {
  a: number;
  b: number;
  c: number;
};

export type DataPoint = {
  x: number;
  y: number;
};

export type GradientDescentStep = {
  iteration: number;
  previousX: number;
  previousY: number;
  gradient: number;
  movement: number;
  updatedX: number;
  updatedY: number;
};

export type ErrorDetail = {
  index: number;
  x: number;
  actualY: number;
  predictedY: number;
  residual: number;
  squaredResidual: number;
  contribution: number;
};
