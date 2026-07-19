type CalculationStepsProps = {
  title?: string;
  steps: string[];
};

export function CalculationSteps({ title = "計算過程", steps }: CalculationStepsProps) {
  return (
    <details className="calculation-steps">
      <summary>{title}</summary>
      <pre>{steps.join("\n")}</pre>
    </details>
  );
}
