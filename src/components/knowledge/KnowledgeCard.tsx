import type { KnowledgeQuestion } from "../../types/knowledge";

type KnowledgeCardProps = {
  item: KnowledgeQuestion;
  visible: boolean;
  onToggleVisible: () => void;
  onCopy: () => void;
};

export function KnowledgeCard({ item, visible, onToggleVisible, onCopy }: KnowledgeCardProps) {
  const answer = Array.isArray(item.answer) ? item.answer.join(" / ") : item.answer;

  return (
    <article className="term-card knowledge-card">
      <p className="section-kicker">{item.category}</p>
      <h3>{item.question}</h3>
      {item.choices && (
        <ol className="choice-list">
          {item.choices.map((choice) => (
            <li key={choice.id}>{choice.id}. {choice.text}</li>
          ))}
        </ol>
      )}
      {visible ? <p className="answer-line correct-result">{answer}</p> : <p className="hidden-answer">答えは非表示です</p>}
      {visible && item.explanation && <p className="note">{item.explanation}</p>}
      <div className="button-row">
        <button type="button" onClick={onToggleVisible}>{visible ? "答えを非表示" : "答えを表示"}</button>
        <button type="button" className="copy-button" onClick={onCopy}>答えをコピー</button>
      </div>
    </article>
  );
}
