import type { KnowledgeQuestion } from "../types/knowledge";

export const knowledgeTerms: KnowledgeQuestion[] = [
  {
    id: "rl-exploitation",
    category: "強化学習",
    question: "今までの経験で一番良かった状態や行動を何度も選択する考え方",
    answer: "知識利用",
  },
  {
    id: "rl-exploration",
    category: "強化学習",
    question: "今までの経験ではよく分からない状態や、良くなかった状態にも遷移しようとする考え方",
    answer: "探索",
  },
  {
    id: "nn-backprop",
    category: "ニューラルネットワーク",
    question: "階層構造のニューラルネットワークで、出力に近い層から入力に近い層へ向かって順番に学習していく方法の名称は何か。",
    answer: "バックプロパゲーション",
  },
  {
    id: "nn-generalization",
    category: "ニューラルネットワーク",
    question: "教師データとして学習していないデータにも推測できるという特徴の名称は何か。",
    answer: "汎化能力",
  },
  {
    id: "nn-library",
    category: "ニューラルネットワーク",
    question: "ディープラーニングで代表的なライブラリ名を1つ答えよ。",
    answer: ["TensorFlow", "PyTorch", "Keras"],
  },
  {
    id: "opt-gradient-descent",
    category: "最適化",
    question: "関数の勾配を使って値が小さくなる方向へ変数を更新する代表的な最適化手法は何か。",
    answer: "最急降下法",
  },
  {
    id: "ga-one-point",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムの交叉の手法の1つで、「ランダムに選択した1点から後ろの遺伝子を全て入れ替える」という処理の名称は何か。",
    answer: "一点交叉",
  },
  {
    id: "ga-two-point",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムの交叉の手法の1つで、「ランダムに選択した2点の間の遺伝子を全て入れ替える」という処理の名称は何か。",
    answer: "二点交叉",
  },
  {
    id: "ga-roulette",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムの選択の手法の1つで、「集団内から適応度に比例した確率で個体を選ぶ」手法の名称は何か。",
    answer: "ルーレット選択",
  },
  {
    id: "ga-tournament",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムの選択の手法の1つで、「集団内からランダムに抽出した複数個体のうち、適応度の高い個体を選ぶ」手法の名称は何か。",
    answer: "トーナメント選択",
  },
  {
    id: "ga-real-coded",
    category: "遺伝的アルゴリズム",
    question: "遺伝子として実数を持つタイプの遺伝的アルゴリズムの名称は何か。",
    answer: "実数値遺伝的アルゴリズム",
  },
  {
    id: "ga-individual",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムでは、問題の解は（　）と呼ばれ、ベクトルで表現される。",
    answer: "個体",
    acceptedAnswers: ["individual"],
    explanation:
      "遺伝的アルゴリズムでは、問題の解の候補を個体と呼びます。個体は、複数の遺伝子から構成されるベクトルや文字列として表現されます。",
  },
  {
    id: "ga-gene",
    category: "遺伝的アルゴリズム",
    question: "個体（ベクトル）が持つ各要素を（　）と呼ぶ。",
    answer: "遺伝子",
    acceptedAnswers: ["gene"],
    explanation:
      "個体を構成する各要素を遺伝子と呼びます。例えば、二進数で表された個体では、それぞれの0または1が遺伝子に相当します。",
  },
  {
    id: "ga-fitness",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムにおいて、「個体（解）がどの程度良いかを表す値」の名称を答えてください。",
    answer: "適応度",
    acceptedAnswers: ["fitness"],
    explanation:
      "適応度は、その個体が問題の解としてどの程度優れているかを数値で表したものです。一般的には、適応度が高い個体ほど次の世代に残りやすくなります。",
  },
  {
    id: "ga-selection",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムの操作のうち、「現在の集団から、次に残す個体を選ぶ」操作の名称を答えてください。",
    answer: "選択",
    acceptedAnswers: ["selection"],
    explanation:
      "選択は、現在の集団の中から次の世代へ残す個体や、交叉に使用する親個体を選ぶ操作です。",
  },
  {
    id: "ga-crossover",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムの操作のうち、「2つ、またはそれ以上の個体を混ぜ合わせ、元の個体の特徴を併せ持つ新しい個体を生成する」操作の名称を答えてください。",
    answer: "交叉",
    acceptedAnswers: ["crossover"],
    explanation:
      "交叉は、複数の親個体の遺伝子を組み合わせて、新しい子個体を生成する操作です。一点交叉や二点交叉などの方法があります。",
  },
  {
    id: "ga-mutation-operation",
    category: "遺伝的アルゴリズム",
    question: "遺伝的アルゴリズムの操作のうち、「個体が持つ遺伝子のうちの一部を変更する」操作の名称を答えてください。",
    answer: "突然変異",
    acceptedAnswers: ["mutation"],
    explanation:
      "突然変異は、個体の一部の遺伝子を一定の確率で変化させる操作です。二進数の遺伝子では、0を1に、1を0に反転させる方法などがあります。",
  },
  {
    id: "ga-mutation",
    category: "遺伝的アルゴリズム",
    question: "遺伝子列の指定された位置において、0を1に、1を0に変化させる操作を何というか。",
    answer: "突然変異",
  },
  {
    id: "ga-theoretical-maximum-fitness",
    category: "遺伝的アルゴリズム",
    question: "すべての遺伝子の組み合わせを調べて得られる、最も高い適応度を何というか。",
    answer: "理論上の最大適応度",
  },
  {
    id: "ga-odd-position",
    category: "遺伝的アルゴリズム",
    question: "1番目、3番目、5番目のような位置を何というか。",
    answer: "奇数位置",
  },
  {
    id: "ga-tsp-crossover",
    category: "遺伝的アルゴリズム",
    question: "巡回セールスマン問題で都市番号をそのまま遺伝子として表現する場合、誤っている説明を1つ選びなさい。",
    choices: [
      { id: "a", text: "都市番号が重複しないようにする特別な交叉方法が存在する。" },
      { id: "b", text: "都市番号を遺伝子として表現した場合は、通常の一点交叉をそのまま利用できる。" },
      { id: "c", text: "解の遺伝子表現として都市番号を利用できる。" },
      { id: "d", text: "1つの巡回路の中で都市番号が重複しないようにする必要がある。" },
    ],
    answer: "b",
    explanation:
      "都市番号を並べる順列表現に通常の一点交叉をそのまま使うと、同じ都市番号が重複したり、必要な都市番号が欠けたりする可能性があります。そのため、順序交叉などの特別な交叉方法が必要です。",
  },
];
