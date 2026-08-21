export type LearnedPreferenceScores = Record<string, number>;

export class PreferenceService {
  applyFeedback(current: LearnedPreferenceScores, signals: string[], positive: boolean): LearnedPreferenceScores {
    const delta = positive ? 0.08 : -0.1;
    return signals.reduce((scores, signal) => ({ ...scores, [signal]: Math.max(-1, Math.min(1, (scores[signal] ?? 0) + delta)) }), current);
  }

  scoreFor(signals: string[], learned: LearnedPreferenceScores): number {
    if (!signals.length) return 0.5;
    const average = signals.reduce((sum, signal) => sum + (learned[signal] ?? 0), 0) / signals.length;
    return (average + 1) / 2;
  }
}
