import { useState } from "react";
import { RouteDistanceCalculator } from "./components/RouteDistanceCalculator";
import { SolutionCountCalculator } from "./components/SolutionCountCalculator";
import { TspCalculator, sampleCities } from "./components/TspCalculator";
import { TwoCityDistanceCalculator } from "./components/TwoCityDistanceCalculator";
import {
  ReinforcementLearningPage,
  type ReinforcementSection,
} from "./components/reinforcement/ReinforcementLearningPage";
import { OptimizationPage, type OptimizationSection } from "./components/optimization/OptimizationPage";
import { NeuralPage, type NeuralSection } from "./components/neural/NeuralPage";
import { GeneticAlgorithmPage } from "./components/genetic/GeneticAlgorithmPage";
import { KnowledgePage } from "./components/knowledge/KnowledgePage";
import type { City } from "./types";

type AppSection = "tsp" | ReinforcementSection | OptimizationSection | NeuralSection | "genetic" | "knowledge";

const menuItems: { id: AppSection; label: string }[] = [
  { id: "tsp", label: "巡回セールスマン問題" },
  { id: "td", label: "TD学習" },
  { id: "episode", label: "エピソードTD学習" },
  { id: "epsilon", label: "ε-greedy方策" },
  { id: "q", label: "Q学習" },
  { id: "quadratic", label: "二次関数" },
  { id: "squared-error", label: "誤差関数" },
  { id: "gradient", label: "最急降下法" },
  { id: "simple-neuron", label: "単純ニューロン" },
  { id: "activation", label: "活性化関数" },
  { id: "perceptron-learning", label: "ステップ関数の学習" },
  { id: "sigmoid-learning", label: "シグモイド学習" },
  { id: "genetic", label: "遺伝的アルゴリズム" },
  { id: "knowledge", label: "用語・確認問題" },
];

export default function App() {
  const [cities, setCities] = useState<City[]>(sampleCities);
  const [activeSection, setActiveSection] = useState<AppSection>("tsp");
  const isTsp = activeSection === "tsp";
  const isOptimization = activeSection === "quadratic" || activeSection === "squared-error" || activeSection === "gradient";
  const isNeural =
    activeSection === "simple-neuron" ||
    activeSection === "activation" ||
    activeSection === "perceptron-learning" ||
    activeSection === "sigmoid-learning" ||
    activeSection === "neural-terms";

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-kicker">大学の授業・課題向け</p>
        <h1>知能科学計算ツール</h1>
      </header>

      <nav className="app-tabs" aria-label="機能メニュー">
        {menuItems.map((item) => (
          <button
            type="button"
            className={activeSection === item.id ? "tab-button active-tab" : "tab-button"}
            aria-pressed={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
            key={item.id}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {isTsp ? (
        <div className="cards-grid">
          <SolutionCountCalculator />
          <TwoCityDistanceCalculator />
          <TspCalculator cities={cities} setCities={setCities} />
          <RouteDistanceCalculator cities={cities} />
        </div>
      ) : isOptimization ? (
        <div className="cards-grid">
          <OptimizationPage section={activeSection as OptimizationSection} />
        </div>
      ) : isNeural ? (
        <div className="cards-grid">
          <NeuralPage section={activeSection as NeuralSection} />
        </div>
      ) : activeSection === "genetic" ? (
        <div className="cards-grid">
          <GeneticAlgorithmPage />
        </div>
      ) : activeSection === "knowledge" ? (
        <div className="cards-grid">
          <KnowledgePage />
        </div>
      ) : (
        <div className="cards-grid">
          <ReinforcementLearningPage section={activeSection as ReinforcementSection} />
        </div>
      )}
    </main>
  );
}
