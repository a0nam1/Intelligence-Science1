import type { QuadraticCoefficients } from "../../types/optimization";
import { differentiateQuadratic } from "./quadratic";

function formatNumber(value: number): string {
  if (Object.is(value, -0)) {
    return "0";
  }
  return Number.isInteger(value) ? value.toString() : value.toString();
}

function signedTerm(coefficient: number, variable: string, isFirst: boolean): string {
  if (coefficient === 0) {
    return "";
  }
  const sign = coefficient < 0 ? "-" : "+";
  const absolute = Math.abs(coefficient);
  const coefficientText = absolute === 1 && variable ? "" : formatNumber(absolute);
  const body = `${coefficientText}${variable}`;
  return isFirst ? (coefficient < 0 ? `-${body}` : body) : `${sign} ${body}`;
}

export function formatQuadraticExpression(coefficients: QuadraticCoefficients): string {
  const terms = [
    signedTerm(coefficients.a, "x²", true),
    signedTerm(coefficients.b, "x", false),
    signedTerm(coefficients.c, "", false),
  ].filter(Boolean);

  return `f(x) = ${terms.length ? terms.join(" ") : "0"}`;
}

export function formatDerivativeExpression(coefficients: QuadraticCoefficients): string {
  const derivative = differentiateQuadratic(coefficients);
  const terms = [
    signedTerm(derivative.linearCoefficient, "x", true),
    signedTerm(derivative.constant, "", false),
  ].filter(Boolean);

  return `f'(x) = ${terms.length ? terms.join(" ") : "0"}`;
}
