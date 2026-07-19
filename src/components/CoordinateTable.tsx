import type { City } from "../types";

type CoordinateTableProps = {
  cities: City[];
  onChangeCity: (id: number, key: "x" | "y", value: string) => void;
  onAddCity: () => void;
  onDeleteCity: (id: number) => void;
  onSetCityCount: (count: number) => void;
  onLoadSample: () => void;
};

function toInputValue(value: number): string {
  return Number.isNaN(value) ? "" : String(value);
}

export function CoordinateTable({
  cities,
  onChangeCity,
  onAddCity,
  onDeleteCity,
  onSetCityCount,
  onLoadSample,
}: CoordinateTableProps) {
  return (
    <div className="coordinate-section">
      <div className="inline-fields">
        <label>
          <span>都市数</span>
          <input
            type="number"
            min="3"
            max="10"
            step="1"
            value={cities.length}
            onChange={(event) => onSetCityCount(Number(event.target.value))}
          />
        </label>
        <button type="button" className="secondary-button" onClick={onAddCity} disabled={cities.length >= 10}>
          都市を追加
        </button>
        <button type="button" className="secondary-button" onClick={onLoadSample}>
          サンプルデータ入力
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>都市</th>
              <th>x座標</th>
              <th>y座標</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id}>
                <td>都市{city.id}</td>
                <td>
                  <input
                    type="number"
                    step="any"
                    value={toInputValue(city.x)}
                    onChange={(event) => onChangeCity(city.id, "x", event.target.value)}
                    aria-label={`都市${city.id}のx座標`}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="any"
                    value={toInputValue(city.y)}
                    onChange={(event) => onChangeCity(city.id, "y", event.target.value)}
                    aria-label={`都市${city.id}のy座標`}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => onDeleteCity(city.id)}
                    disabled={cities.length <= 3}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
