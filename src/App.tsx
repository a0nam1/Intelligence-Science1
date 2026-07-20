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

const menuItems: { id: AppSection; label: string; shortLabel: string; icon: string }[] = [
  { id: "tsp", label: "巡回セールスマン問題", shortLabel: "TSP", icon: "⌘" },
  { id: "td", label: "TD学習", shortLabel: "TD学習", icon: "TD" },
  { id: "episode", label: "エピソードTD学習", shortLabel: "エピソードTD", icon: "E" },
  { id: "epsilon", label: "ε-greedy方策", shortLabel: "ε-greedy", icon: "ε" },
  { id: "q", label: "Q学習", shortLabel: "Q学習", icon: "Q" },
  { id: "quadratic", label: "二次関数", shortLabel: "二次関数", icon: "∿" },
  { id: "squared-error", label: "誤差関数", shortLabel: "誤差関数", icon: "◎" },
  { id: "gradient", label: "最急降下法", shortLabel: "最急降下法", icon: "↘" },
  { id: "simple-neuron", label: "単純ニューロン", shortLabel: "単純ニューロン", icon: "＊" },
  { id: "activation", label: "活性化関数", shortLabel: "活性化関数", icon: "ƒ" },
  { id: "perceptron-learning", label: "ステップ関数の学習", shortLabel: "ステップ学習", icon: "⊢" },
  { id: "sigmoid-learning", label: "シグモイド学習", shortLabel: "シグモイド", icon: "S" },
  { id: "genetic", label: "遺伝的アルゴリズム", shortLabel: "遺伝的アルゴリズム", icon: "DNA" },
  { id: "knowledge", label: "用語・確認問題", shortLabel: "用語・確認問題", icon: "?" },
];

export default function App() {
  const [cities, setCities] = useState<City[]>(sampleCities);
  const [activeSection, setActiveSection] = useState<AppSection>("tsp");
  const [isDeepTheme, setIsDeepTheme] = useState(false);
  const isTsp = activeSection === "tsp";
  const isOptimization = activeSection === "quadratic" || activeSection === "squared-error" || activeSection === "gradient";
  const isNeural =
    activeSection === "simple-neuron" ||
    activeSection === "activation" ||
    activeSection === "perceptron-learning" ||
    activeSection === "sigmoid-learning" ||
    activeSection === "neural-terms";
  const activeItem = menuItems.find((item) => item.id === activeSection) ?? menuItems[0];

  return (
    <div className={isDeepTheme ? "app-layout deep-theme" : "app-layout"}>
      <aside className="app-sidebar" aria-label="主メニュー">
        <div className="brand-mark">
          <img src="/app-icon.png" alt="知能科学計算ツール" />
        </div>
        <nav className="side-nav">
          {menuItems.map((item) => (
            <button
              type="button"
              className={activeSection === item.id ? "side-nav-button active-side-nav" : "side-nav-button"}
              aria-pressed={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              key={item.id}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button type="button" className="home-button" onClick={() => setActiveSection("tsp")}>
          <span className="nav-icon" aria-hidden="true">⌂</span>
          <span>ホーム</span>
        </button>
        <p className="sidebar-footer">© 2026 知能科学計算ツール</p>
      </aside>

      <main className="app-shell">
        <header className="app-header">
          <div>
            <h1>知能科学計算ツール</h1>
            <p>知能科学・機械学習のための計算・可視化ツール</p>
          </div>
          <div className="header-actions" aria-label="補助メニュー">
            <button type="button" className="utility-button" onClick={() => setActiveSection("knowledge")}>
              使い方
            </button>
            <button
              type="button"
              className="utility-button"
              aria-pressed={isDeepTheme}
              onClick={() => setIsDeepTheme((value) => !value)}
            >
              テーマ
            </button>
          </div>
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
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.shortLabel}</span>
            </button>
          ))}
        </nav>

        <section className="workspace-panel" aria-labelledby="workspace-title">
          <div className="workspace-heading">
            <p className="app-kicker">現在の計算</p>
            <h2 id="workspace-title">{activeItem.label}</h2>
          </div>

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
        </section>
      </main>
    </div>
  );
}
