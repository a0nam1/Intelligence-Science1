import { formatFixed4 } from "../../lib/format";

type DiagramState = {
  state: string;
  value?: number;
  terminal?: boolean;
  qLeft?: number;
  qRight?: number;
};

type StateTransitionDiagramProps = {
  states: DiagramState[];
  currentState?: string;
  mode?: "td" | "q";
};

export function StateTransitionDiagram({ states, currentState, mode = "td" }: StateTransitionDiagramProps) {
  return (
    <div className="diagram-wrap" aria-label="状態遷移図">
      <div className="state-diagram">
        {states.map((item, index) => (
          <div className="diagram-item" key={item.state}>
            <div className="node-stack">
              {item.state === currentState && <span className="agent-marker" aria-label="現在状態" />}
              <div className={`state-node ${item.terminal ? "terminal-node" : ""} ${item.state === currentState ? "current-node" : ""}`}>
                {item.state}
              </div>
              {item.value !== undefined && <span className="node-value">V={formatFixed4(item.value)}</span>}
            </div>
            {index < states.length - 1 && (
              <div className="arrow-stack">
                {mode === "q" && (
                  <span className="q-label q-left">左 {item.qLeft !== undefined ? formatFixed4(item.qLeft) : "-"}</span>
                )}
                <span className="diagram-arrow">← →</span>
                {mode === "q" && (
                  <span className="q-label q-right">右 {item.qRight !== undefined ? formatFixed4(item.qRight) : "-"}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
