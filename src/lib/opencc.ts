import { Converter, CustomConverter } from 'opencc-js';
import metaphysicsDict from '@/dictionaries/metaphysics-zh-hans.json';

// Pre-built standard converters
const toTraditional = Converter({ from: 'cn', to: 't' });
const toSimplified = Converter({ from: 't', to: 'cn' });

// Build post-processing corrections for Traditional conversion.
// These fix terms that opencc-js converts incorrectly for metaphysics context.
// Entry [wrongTraditional, correctTraditional] — replaces opencc mistakes.
const traditionalCorrections: [string, string][] = [];

// All entries in the dictionary map simplified -> traditional.
// For post-processing, we need to find cases where opencc produces a
// different result than our dictionary says is correct.
for (const [simplified, traditional] of Object.entries(metaphysicsDict)) {
  const openccResult = toTraditional(simplified);
  if (openccResult !== traditional) {
    // opencc converts this term differently than our dictionary — add correction
    traditionalCorrections.push([openccResult, traditional]);
  }
}

// Also add explicit corrections for known opencc mistakes
// (where the simplified form is part of a larger term)
const explicitCorrections: [string, string][] = [
  ['神後', '神后'],
  ['益後', '益后'],
  ['醜', '丑'],
];
for (const [wrong, correct] of explicitCorrections) {
  if (!traditionalCorrections.some(([w, c]) => w === wrong && c === correct)) {
    traditionalCorrections.push([wrong, correct]);
  }
}

const fixTraditional = CustomConverter(traditionalCorrections);

// Build reverse dictionary for Simplified conversion corrections
const simplifiedCorrections: [string, string][] = [];
for (const [simplified, traditional] of Object.entries(metaphysicsDict)) {
  const openccResult = toSimplified(traditional);
  if (openccResult !== simplified) {
    simplifiedCorrections.push([openccResult, simplified]);
  }
}
const fixSimplified = CustomConverter(simplifiedCorrections);

/**
 * Convert text to Traditional Chinese with metaphysics term protection.
 * Applies standard OpenCC conversion, then fixes metaphysics terms
 * that opencc-js converts incorrectly (e.g., 丑→醜, 神后→神後).
 */
export function convertToTraditional(text: string): string {
  return fixTraditional(toTraditional(text));
}

/**
 * Convert text to Simplified Chinese with metaphysics term protection.
 * Applies standard OpenCC conversion, then fixes any metaphysics terms.
 */
export function convertToSimplified(text: string): string {
  return fixSimplified(toSimplified(text));
}

/**
 * Convert a single metaphysics term between Traditional and Simplified.
 * Uses the custom dictionary directly (not opencc-js) for precise control.
 */
export function convertMetaphysics(
  term: string,
  targetLocale: 'zh-hant' | 'zh-hans'
): string {
  if (targetLocale === 'zh-hant') {
    return (metaphysicsDict as Record<string, string>)[term] || term;
  }
  // Reverse lookup: traditional → simplified
  const reverse = Object.fromEntries(
    Object.entries(metaphysicsDict).map(([k, v]) => [v, k])
  );
  return (reverse as Record<string, string>)[term] || term;
}
