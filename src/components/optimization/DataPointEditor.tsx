import type { DataPoint } from "../../types/optimization";

type DataPointEditorProps = {
  dataPoints: DataPoint[];
  onChange: (dataPoints: DataPoint[]) => void;
};

export function DataPointEditor({ dataPoints, onChange }: DataPointEditorProps) {
  const updatePoint = (index: number, key: keyof DataPoint, value: string) => {
    onChange(
      dataPoints.map((point, pointIndex) =>
        pointIndex === index ? { ...point, [key]: value.trim() === "" ? Number.NaN : Number(value) } : point,
      ),
    );
  };

  return (
    <div className="data-editor">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>x</th>
              <th>y</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((point, index) => (
              <tr key={`point-${index}`}>
                <td>
                  <input
                    type="number"
                    step="any"
                    value={Number.isNaN(point.x) ? "" : point.x}
                    onChange={(event) => updatePoint(index, "x", event.target.value)}
                    aria-label={`${index + 1}件目のx`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="any"
                    value={Number.isNaN(point.y) ? "" : point.y}
                    onChange={(event) => updatePoint(index, "y", event.target.value)}
                    aria-label={`${index + 1}件目のy`}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => onChange(dataPoints.filter((_, pointIndex) => pointIndex !== index))}
                    disabled={dataPoints.length <= 1}
                    aria-label={`${index + 1}件目のデータを削除`}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="secondary-button small-button"
        onClick={() => onChange([...dataPoints, { x: 0, y: 0 }])}
        aria-label="学習データを追加"
      >
        データを追加
      </button>
    </div>
  );
}
