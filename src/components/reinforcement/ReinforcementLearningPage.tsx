import { EpsilonGreedyCalculator } from "./EpsilonGreedyCalculator";
import { EpisodeTdCalculator } from "./EpisodeTdCalculator";
import { QLearningCalculator } from "./QLearningCalculator";
import { ReinforcementTerms } from "./ReinforcementTerms";
import { TdValueCalculator } from "./TdValueCalculator";

export type ReinforcementSection = "td" | "episode" | "epsilon" | "q" | "terms";

type ReinforcementLearningPageProps = {
  section: ReinforcementSection;
};

export function ReinforcementLearningPage({ section }: ReinforcementLearningPageProps) {
  if (section === "td") {
    return <TdValueCalculator />;
  }
  if (section === "episode") {
    return <EpisodeTdCalculator />;
  }
  if (section === "epsilon") {
    return <EpsilonGreedyCalculator />;
  }
  if (section === "q") {
    return <QLearningCalculator />;
  }
  return <ReinforcementTerms />;
}
