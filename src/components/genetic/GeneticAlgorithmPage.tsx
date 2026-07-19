import { useState } from "react";
import { BlxAlphaCalculator } from "./BlxAlphaCalculator";
import { GeneCountCalculator } from "./GeneCountCalculator";
import { OnePointCrossoverCalculator } from "./OnePointCrossoverCalculator";
import { RouletteSelectionCalculator } from "./RouletteSelectionCalculator";
import { TournamentSelectionCalculator } from "./TournamentSelectionCalculator";
import { TwoPointCrossoverCalculator } from "./TwoPointCrossoverCalculator";

type GeneticTab = "one" | "two" | "roulette" | "tournament" | "gene-count" | "blx";

const tabs: { id: GeneticTab; label: string }[] = [
  { id: "one", label: "一点交叉" },
  { id: "two", label: "二点交叉" },
  { id: "roulette", label: "ルーレット選択" },
  { id: "tournament", label: "トーナメント選択" },
  { id: "gene-count", label: "遺伝子数" },
  { id: "blx", label: "BLX-α" },
];

export function GeneticAlgorithmPage() {
  const [active, setActive] = useState<GeneticTab>("one");

  return (
    <section className="card wide-card">
      <p className="section-kicker">遺伝的アルゴリズム</p>
      <h2>交叉・選択・遺伝子表現の計算</h2>
      <div className="sub-tabs" aria-label="遺伝的アルゴリズム計算機メニュー">
        {tabs.map((tab) => (
          <button type="button" className={active === tab.id ? "tab-button active-tab" : "tab-button"} onClick={() => setActive(tab.id)} key={tab.id}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="cards-grid ga-inner-grid">
        {active === "one" && <OnePointCrossoverCalculator />}
        {active === "two" && <TwoPointCrossoverCalculator />}
        {active === "roulette" && <RouletteSelectionCalculator />}
        {active === "tournament" && <TournamentSelectionCalculator />}
        {active === "gene-count" && <GeneCountCalculator />}
        {active === "blx" && <BlxAlphaCalculator />}
      </div>
    </section>
  );
}
