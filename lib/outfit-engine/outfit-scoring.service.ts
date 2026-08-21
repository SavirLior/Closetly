import type { UserPreferences, WardrobeItem } from "../types";
import { colorCompatibility } from "./color-compatibility";

export const DEFAULT_SCORING_WEIGHTS = {
  color: 0.25,
  style: 0.25,
  formality: 0.2,
  silhouette: 0.15,
  season: 0.1,
  preference: 0.05,
} as const;

type ScoreContext = {
  style: string;
  formality: number;
  season: string;
  preferences: UserPreferences;
};

export class OutfitScoringService {
  score(items: WardrobeItem[], context: ScoreContext): number {
    const color = colorCompatibility(items.map((item) => item.primaryColor));
    const styleMatches = items.filter((item) => item.styles.includes(context.style)).length;
    const style = Math.max(0.55, styleMatches / items.length);
    const averageFormality = items.reduce((sum, item) => sum + item.formality, 0) / items.length;
    const formality = 1 - Math.min(1, Math.abs(averageFormality - context.formality) / 8);
    const fitCount = new Set(items.map((item) => item.fit)).size;
    const silhouette = fitCount <= 2 ? 0.9 : 0.72;
    const seasonMatches = items.filter((item) => item.seasons.includes(context.season)).length;
    const season = seasonMatches / items.length;
    const preferred = items.filter((item) =>
      context.preferences.preferredStyles.some((styleName) => item.styles.includes(styleName)),
    ).length;
    const preference = preferred / items.length;

    const weighted =
      color * DEFAULT_SCORING_WEIGHTS.color +
      style * DEFAULT_SCORING_WEIGHTS.style +
      formality * DEFAULT_SCORING_WEIGHTS.formality +
      silhouette * DEFAULT_SCORING_WEIGHTS.silhouette +
      season * DEFAULT_SCORING_WEIGHTS.season +
      preference * DEFAULT_SCORING_WEIGHTS.preference;

    return Math.round(weighted * 100);
  }
}
