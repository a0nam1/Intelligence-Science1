import { ActivationCalculator } from "./ActivationCalculator";
import { NeuralTerms } from "./NeuralTerms";
import { PerceptronLearningCalculator } from "./PerceptronLearningCalculator";
import { SigmoidLearningCalculator } from "./SigmoidLearningCalculator";
import { SimpleNeuronCalculator } from "./SimpleNeuronCalculator";

export type NeuralSection = "simple-neuron" | "activation" | "perceptron-learning" | "sigmoid-learning" | "neural-terms";

type NeuralPageProps = {
  section: NeuralSection;
};

export function NeuralPage({ section }: NeuralPageProps) {
  if (section === "simple-neuron") {
    return <SimpleNeuronCalculator />;
  }
  if (section === "activation") {
    return <ActivationCalculator />;
  }
  if (section === "perceptron-learning") {
    return <PerceptronLearningCalculator />;
  }
  if (section === "sigmoid-learning") {
    return <SigmoidLearningCalculator />;
  }
  return <NeuralTerms />;
}
