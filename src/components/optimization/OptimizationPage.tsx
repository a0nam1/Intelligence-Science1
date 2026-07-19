import { GradientDescentCalculator } from "./GradientDescentCalculator";
import { QuadraticCalculator } from "./QuadraticCalculator";
import { SquaredErrorCalculator } from "./SquaredErrorCalculator";

export type OptimizationSection = "quadratic" | "squared-error" | "gradient";

type OptimizationPageProps = {
  section: OptimizationSection;
};

export function OptimizationPage({ section }: OptimizationPageProps) {
  if (section === "quadratic") {
    return <QuadraticCalculator />;
  }
  if (section === "squared-error") {
    return <SquaredErrorCalculator />;
  }
  return <GradientDescentCalculator />;
}
