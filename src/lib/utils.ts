import { type MaturityLevel } from './types';

/**
 * Maturity Level definitions based on Permendagri No 99 Tahun 2018
 * and the workflow diagram scoring ranges
 */
export const MATURITY_LEVELS: MaturityLevel[] = [
  {
    level: 1,
    label: 'Initial',
    description: 'Belum ada sistem yang terstruktur',
    color: '#ef4444',
    minScore: 0,
    maxScore: 1.5,
  },
  {
    level: 2,
    label: 'Developing',
    description: 'Sudah mulai ada pengembangan sistem',
    color: '#f97316',
    minScore: 1.6,
    maxScore: 2.5,
  },
  {
    level: 3,
    label: 'Defined',
    description: 'Sistem sudah terdefinisi dengan baik',
    color: '#eab308',
    minScore: 2.6,
    maxScore: 3.5,
  },
  {
    level: 4,
    label: 'Managed',
    description: 'Sistem terkelola dan terukur',
    color: '#22c55e',
    minScore: 3.6,
    maxScore: 4.5,
  },
  {
    level: 5,
    label: 'Optimized',
    description: 'Sistem telah optimal dan berkelanjutan',
    color: '#3b82f6',
    minScore: 4.6,
    maxScore: 5.0,
  },
];

/**
 * Calculate total score from array of tingkat_capaian values
 * Formula: Total Skor = Sum(all tingkat_capaian) / 11
 */
export function calculateTotalScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / 11) * 100) / 100;
}

/**
 * Get maturity level based on total score
 */
export function getMaturityLevel(totalScore: number): MaturityLevel {
  for (let i = MATURITY_LEVELS.length - 1; i >= 0; i--) {
    if (totalScore >= MATURITY_LEVELS[i].minScore) {
      return MATURITY_LEVELS[i];
    }
  }
  return MATURITY_LEVELS[0];
}

/**
 * Get maturity level label string
 */
export function getMaturityLevelLabel(totalScore: number): string {
  const level = getMaturityLevel(totalScore);
  return `Level ${level.level} (${level.label})`;
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format score to 2 decimal places
 */
export function formatScore(score: number): string {
  return score.toFixed(2);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tingkat labels
 */
export const TINGKAT_OPTIONS = [
  { value: 1, label: 'Tingkat I (Initial)', desc: 'Tanpa Data Dukung' },
  { value: 2, label: 'Tingkat II (Developing)', desc: 'Memerlukan Data Dukung' },
  { value: 3, label: 'Tingkat III (Defined)', desc: 'Memerlukan Data Dukung' },
  { value: 4, label: 'Tingkat IV (Managed)', desc: 'Memerlukan Data Dukung' },
  { value: 5, label: 'Tingkat V (Optimized)', desc: 'Memerlukan Data Dukung' },
];
