import { useMemo, useState } from "react";
import { knowledgeTerms } from "../../data/knowledgeTerms";
import type { KnowledgeCategory } from "../../types/knowledge";
import { KnowledgeCard } from "./KnowledgeCard";
import { KnowledgeFilters } from "./KnowledgeFilters";

const categories: ("すべて" | KnowledgeCategory)[] = ["すべて", "強化学習", "ニューラルネットワーク", "遺伝的アルゴリズム", "最適化"];

export function KnowledgePage() {
  const [category, setCategory] = useState<"すべて" | KnowledgeCategory>("すべて");
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return knowledgeTerms.filter((item) => {
      const answer = Array.isArray(item.answer) ? item.answer.join(" ") : item.answer;
      const text = `${item.question} ${answer} ${item.explanation ?? ""}`.toLowerCase();
      return (category === "すべて" || item.category === category) && (!keyword || text.includes(keyword));
    });
  }, [category, search]);

  const safeIndex = filtered.length ? Math.min(index, filtered.length - 1) : 0;
  const current = filtered[safeIndex];

  const move = (direction: number) => {
    if (!filtered.length) return;
    setIndex((currentIndex) => (currentIndex + direction + filtered.length) % filtered.length);
    setVisible(false);
  };

  const random = () => {
    if (!filtered.length) return;
    const next = Math.floor(Math.random() * filtered.length);
    setIndex(next);
    setVisible(false);
  };

  return (
    <section className="card wide-card">
      <p className="section-kicker">用語・確認問題</p>
      <h2>知能科学の用語をまとめて確認</h2>
      <KnowledgeFilters
        categories={categories}
        activeCategory={category}
        search={search}
        onChangeCategory={(next) => { setCategory(next); setIndex(0); setVisible(false); }}
        onChangeSearch={(next) => { setSearch(next); setIndex(0); setVisible(false); }}
      />
      <div className="summary-grid">
        <div><span>表示中の問題</span><strong>{filtered.length ? `${safeIndex + 1} / ${filtered.length}` : "0 / 0"}</strong></div>
        <div><span>カテゴリ</span><strong>{category}</strong></div>
        <div><span>登録数</span><strong>{knowledgeTerms.length}</strong></div>
      </div>
      {current ? (
        <>
          <KnowledgeCard
            item={current}
            visible={visible}
            onToggleVisible={() => setVisible((currentVisible) => !currentVisible)}
            onCopy={async () => navigator.clipboard.writeText(Array.isArray(current.answer) ? current.answer.join(" / ") : current.answer)}
          />
          <div className="button-row">
            <button type="button" className="secondary-button" onClick={() => move(-1)}>前の問題へ</button>
            <button type="button" className="secondary-button" onClick={() => move(1)}>次の問題へ</button>
            <button type="button" onClick={random}>ランダム出題</button>
          </div>
        </>
      ) : (
        <p className="error-message">条件に一致する問題がありません。</p>
      )}
    </section>
  );
}
