import { describe, expect, test } from 'bun:test';
import { isBetterScore, readStoredScore, scorePercent, shuffleIndices } from './quizUtils';

const storageWith = (values) => ({
    getItem: (key) => values[key] ?? null,
});

describe('quiz utilities', () => {
    test('shuffleIndices returns each index exactly once', () => {
        const order = shuffleIndices(5, () => 0);
        expect(order.toSorted()).toEqual([0, 1, 2, 3, 4]);
        expect(order).toHaveLength(5);
    });

    test('readStoredScore tolerates missing and invalid values', () => {
        expect(readStoredScore('quiz-passwords', storageWith({}))).toBeNull();
        expect(readStoredScore('quiz-passwords', storageWith({ 'quiz-passwords': '{bad' }))).toBeNull();
        expect(readStoredScore('quiz-passwords', storageWith({ 'quiz-passwords': '{"score":3,"total":4}' }))).toEqual({ score: 3, total: 4 });
    });

    test('score comparison uses percentage instead of raw score', () => {
        expect(scorePercent({ score: 3, total: 4 })).toBe(75);
        expect(isBetterScore({ score: 3, total: 4 }, { score: 7, total: 10 })).toBe(true);
        expect(isBetterScore({ score: 6, total: 10 }, { score: 3, total: 4 })).toBe(false);
    });
});
