import { useState } from "react";
import { knowledgeTerms } from "../../data/knowledgeTerms";

const cards = knowledgeTerms.filter((term) => term.category === "ニューラルネットワーク");

export function NeuralTerms() {
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState<number | null>(null);

  const copy = async (index: number, answer: string) => {
    await navigator.clipboard.writeText(answer);
    setCopied(index);
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">ニューラルネット用語</p>
      <h2>学習用カード</h2>
      <div className="term-grid">
        {cards.map((card, index) => (
          <article className="term-card" key={card.id}>
            <p className="section-kicker">カード{index + 1}</p>
            <h3>{card.question}</h3>
            {visible[index] ? <p className="answer-line correct-result">{Array.isArray(card.answer) ? card.answer.join(" / ") : card.answer}</p> : <p className="hidden-answer">答えは非表示です</p>}
            <div className="button-row">
              <button type="button" onClick={() => setVisible((current) => ({ ...current, [index]: !current[index] }))}>
                {visible[index] ? "答えを非表示" : "答えを表示"}
              </button>
              <button type="button" className="copy-button" onClick={() => copy(index, Array.isArray(card.answer) ? card.answer.join(" / ") : card.answer)}>
                {copied === index ? "コピーしました" : "答えをコピー"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
