import { formatNumberFixed4 } from "../../lib/neural/formatter";

type NeuronDiagramProps = {
  weights: number[];
  inputs: number[];
  theta: number;
  activationName: string;
  output?: number;
};

export function NeuronDiagram({ weights, inputs, theta, activationName, output }: NeuronDiagramProps) {
  const shownCount = Math.min(weights.length, 6);
  const hiddenCount = Math.max(0, weights.length - shownCount);

  return (
    <div className="neuron-diagram" aria-label="ニューロン図">
      <div className="neuron-inputs">
        {Array.from({ length: shownCount }, (_, index) => (
          <div className="neuron-input-row" key={index}>
            <span>x{index + 1}={Number.isFinite(inputs[index]) ? formatNumberFixed4(inputs[index]) : "-"}</span>
            <i />
            <strong>w{index + 1}={Number.isFinite(weights[index]) ? formatNumberFixed4(weights[index]) : "-"}</strong>
          </div>
        ))}
        {hiddenCount > 0 && <p>ほか {hiddenCount} 入力</p>}
      </div>
      <div className="neuron-core">
        <span>Σwixi - θ</span>
        <strong>θ={Number.isFinite(theta) ? formatNumberFixed4(theta) : "-"}</strong>
        <em>{activationName}</em>
      </div>
      <div className="neuron-output">
        <i />
        <span>y</span>
        <strong>{output === undefined ? "-" : Number.isInteger(output) ? output : formatNumberFixed4(output)}</strong>
      </div>
    </div>
  );
}
