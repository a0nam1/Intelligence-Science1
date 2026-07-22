import { useState } from "react";
import { getKnowledgeAnswerText, isCorrectKnowledgeAnswer } from "../../lib/knowledge";
import type { KnowledgeQuestion } from "../../types/knowledge";

type KnowledgeCardProps = {
  item: KnowledgeQuestion;
  visible: boolean;
  onToggleVisible: () => void;
  onCopy: () => void;
};

export function KnowledgeCard({ item, visible, onToggleVisible, onCopy }: KnowledgeCardProps) {
  const [answerInput, setAnswerInput] = useState("");
  const [judgement, setJudgement] = useState<"correct" | "incorrect" | null>(null);
  const answer = getKnowledgeAnswerText(item);
  const shouldShowAnswer = visible || judgement === "incorrect";

  const checkAnswer = () => {
    setJudgement(isCorrectKnowledgeAnswer(item, answerInput) ? "correct" : "incorrect");
  };

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
      <label>
        <span>答え入力</span>
        <input
          value={answerInput}
          onChange={(event) => { setAnswerInput(event.target.value); setJudgement(null); }}
          aria-label="確認問題の答え入力欄"
          placeholder="答えを入力"
        />
      </label>
      {judgement === "correct" && <p className="answer-line correct-result">正解です。</p>}
      {judgement === "incorrect" && <p className="error-message">不正解です。正解と解説を確認してください。</p>}
      {shouldShowAnswer ? <p className="answer-line correct-result">{answer}</p> : <p className="hidden-answer">答えは非表示です</p>}
      {shouldShowAnswer && item.explanation && <p className="note">{item.explanation}</p>}
      <div className="button-row">
        <button type="button" onClick={checkAnswer}>回答を判定</button>
        <button type="button" onClick={onToggleVisible}>{visible ? "答えを非表示" : "答えを表示"}</button>
        <button type="button" className="copy-button" onClick={onCopy}>答えをコピー</button>
      </div>
    </article>
  );
}
