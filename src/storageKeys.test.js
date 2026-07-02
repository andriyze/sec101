import { describe, expect, test } from 'bun:test';
import { CHECKLIST_STORAGE_KEYS, QUIZ_STORAGE_KEYS, RESETTABLE_STORAGE_KEYS } from './storageKeys';
import { TOPIC_ORDER } from './topics';

describe('storage key registry', () => {
    test('registers one quiz key per topic', () => {
        expect(QUIZ_STORAGE_KEYS).toEqual(TOPIC_ORDER.map((topicId) => `quiz-${topicId}`));
    });

    test('resettable keys include quizzes and checklist keys', () => {
        expect(RESETTABLE_STORAGE_KEYS).toEqual([...QUIZ_STORAGE_KEYS, ...CHECKLIST_STORAGE_KEYS]);
    });
});
