export type SentimentSignal = {
  source: 'X' | 'news' | 'market';
  label: 'positive' | 'neutral' | 'negative';
  score: number;
  weight: number;
};

export type HeatBucket = 'critical' | 'high' | 'elevated' | 'watch' | 'low';

export function classifyOperation(text: string): 'LOGISTICS' | 'MARKET' | 'INFRASTRUCTURE' | 'NATURAL' | 'GEOPOLITICAL' {
  const value = text.toLowerCase();
  if (/cable|port|shipping|vessel|freight|route|container|maritime|logistic/.test(value)) return 'LOGISTICS';
  if (/market|central bank|liquidity|oil|gold|bitcoin|crypto|commodity|yield|currency/.test(value)) return 'MARKET';
  if (/fiber|internet|grid|pipeline|power|satellite|telecom|infrastructure/.test(value)) return 'INFRASTRUCTURE';
  if (/earthquake|storm|flood|cyclone|tsunami|heatwave|volcan/.test(value)) return 'NATURAL';
  return 'GEOPOLITICAL';
}

export function consensusSentiment(signals: SentimentSignal[]) {
  const coverage = signals.length;
  if (!coverage) return { label: 'neutral' as const, score: 0, coverage: 0 };
  const totalWeight = signals.reduce((sum, item) => sum + item.weight, 0) || 1;
  const score = signals.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
  const label = score <= -0.18 ? 'negative' : score >= 0.18 ? 'positive' : 'neutral';
  return { label, score: Number(score.toFixed(2)), coverage };
}

export function heatBucket(score: number): HeatBucket {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'elevated';
  if (score >= 15) return 'watch';
  return 'low';
}
