import { useEffect, useState } from "react";
import { numbersToListInput, parseNumberList } from "../../lib/neural/parser";

type NumberListEditorProps = {
  weights: number[];
  inputs: number[];
  onChangeWeights: (weights: number[]) => void;
  onChangeInputs: (inputs: number[]) => void;
  onError: (message: string) => void;
};

function toInputValue(value: number): string {
  return Number.isNaN(value) ? "" : String(value);
}

function updateListValue(values: number[], index: number, value: string): number[] {
  return values.map((item, itemIndex) => (itemIndex === index ? (value.trim() === "" ? Number.NaN : Number(value)) : item));
}

export function NumberListEditor({ weights, inputs, onChangeWeights, onChangeInputs, onError }: NumberListEditorProps) {
  const [weightText, setWeightText] = useState(numbersToListInput(weights));
  const [inputText, setInputText] = useState(numbersToListInput(inputs));

  useEffect(() => {
    setWeightText(numbersToListInput(weights));
  }, [weights]);

  useEffect(() => {
    setInputText(numbersToListInput(inputs));
  }, [inputs]);

  const applyWeights = (value: string) => {
    try {
      onChangeWeights(parseNumberList(value));
      onError("");
    } catch (caughtError) {
      onError(caughtError instanceof Error ? caughtError.message : "重みの一括入力を解析できませんでした。");
    }
  };

  const applyInputs = (value: string) => {
    try {
      onChangeInputs(parseNumberList(value));
      onError("");
    } catch (caughtError) {
      onError(caughtError instanceof Error ? caughtError.message : "入力の一括入力を解析できませんでした。");
    }
  };

  const rowCount = Math.max(weights.length, inputs.length);

  return (
    <div className="number-list-editor">
      <div className="inline-fields">
        <label>
          <span>入力数 n</span>
          <input
            type="number"
            min="1"
            step="1"
            value={rowCount}
            onChange={(event) => {
              const count = Number(event.target.value);
              if (!Number.isInteger(count) || count < 1) return;
              onChangeWeights(Array.from({ length: count }, (_, index) => weights[index] ?? 0));
              onChangeInputs(Array.from({ length: count }, (_, index) => inputs[index] ?? 0));
            }}
          />
        </label>
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            onChangeWeights([...weights, 0]);
            onChangeInputs([...inputs, 0]);
          }}
          aria-label="入力行を追加"
        >
          入力を追加
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>番号</th>
              <th>重み wi</th>
              <th>入力 xi</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="number"
                    step="any"
                    value={toInputValue(weights[index])}
                    onChange={(event) => onChangeWeights(updateListValue(weights, index, event.target.value))}
                    aria-label={`w${index + 1}`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="any"
                    value={toInputValue(inputs[index])}
                    onChange={(event) => onChangeInputs(updateListValue(inputs, index, event.target.value))}
                    aria-label={`x${index + 1}`}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="danger-button"
                    disabled={rowCount <= 1}
                    onClick={() => {
                      onChangeWeights(weights.filter((_, itemIndex) => itemIndex !== index));
                      onChangeInputs(inputs.filter((_, itemIndex) => itemIndex !== index));
                    }}
                    aria-label={`${index + 1}番目の入力を削除`}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="split-grid">
        <label>
          <span>重みの一括入力</span>
          <textarea
            rows={4}
            value={weightText}
            onChange={(event) => setWeightText(event.target.value)}
            onBlur={(event) => applyWeights(event.target.value)}
            aria-label="重みの一括入力"
          />
        </label>
        <label>
          <span>入力の一括入力</span>
          <textarea
            rows={4}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onBlur={(event) => applyInputs(event.target.value)}
            aria-label="入力の一括入力"
          />
        </label>
      </div>
      <p className="description">一括入力欄は、入力後に欄の外へ移動すると表へ反映されます。</p>
    </div>
  );
}
