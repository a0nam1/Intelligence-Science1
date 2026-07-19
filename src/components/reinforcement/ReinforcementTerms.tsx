import { useState } from "react";
import { knowledgeTerms } from "../../data/knowledgeTerms";

const terms = knowledgeTerms.filter((term) => term.category === "強化学習");

export function ReinforcementTerms() {
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = async (index: number, answer: string) => {
    await navigator.clipboard.writeText(answer);
    setCopiedIndex(index);
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">用語確認</p>
      <h2>N本腕バンディット問題の用語確認</h2>
      <div className="term-grid">
        {terms.map((term, index) => (
          <article className="term-card" key={term.id}>
            <p className="section-kicker">用語{index + 1}</p>
            <h3>{term.question}</h3>
            {visible[index] ? <p className="answer-line correct-result">{Array.isArray(term.answer) ? term.answer.join(" / ") : term.answer}</p> : <p className="hidden-answer">答えは非表示です</p>}
            <div className="button-row">
              <button type="button" onClick={() => setVisible((current) => ({ ...current, [index]: !current[index] }))}>
                {visible[index] ? "答えを非表示" : "答えを表示"}
              </button>
              <button type="button" className="copy-button" onClick={() => copy(index, Array.isArray(term.answer) ? term.answer.join(" / ") : term.answer)}>
                {copiedIndex === index ? "コピーしました" : "答えをコピー"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
