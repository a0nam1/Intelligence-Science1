import type { KnowledgeCategory } from "../../types/knowledge";

type KnowledgeFiltersProps = {
  categories: ("すべて" | KnowledgeCategory)[];
  activeCategory: "すべて" | KnowledgeCategory;
  search: string;
  onChangeCategory: (category: "すべて" | KnowledgeCategory) => void;
  onChangeSearch: (search: string) => void;
};

export function KnowledgeFilters({
  categories,
  activeCategory,
  search,
  onChangeCategory,
  onChangeSearch,
}: KnowledgeFiltersProps) {
  return (
    <div className="knowledge-filters">
      <label>
        <span>カテゴリ</span>
        <select value={activeCategory} onChange={(event) => onChangeCategory(event.target.value as "すべて" | KnowledgeCategory)}>
          {categories.map((category) => (
            <option value={category} key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        <span>キーワード検索</span>
        <input value={search} onChange={(event) => onChangeSearch(event.target.value)} placeholder="問題文・答えを検索" />
      </label>
    </div>
  );
}
