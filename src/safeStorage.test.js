import { afterEach, describe, expect, test } from 'bun:test';
import { readStorage, removeStorage, writeStorage } from './safeStorage';
import { readStoredScore } from './components/quizUtils';

// Chrome and Firefox throw on reading `window.localStorage` when the user blocks site data.
const blockedWindow = Object.defineProperty({}, 'localStorage', {
    get() {
        throw new Error('SecurityError: Access is denied for this document.');
    },
});

describe('safe storage', () => {
    afterEach(() => {
        delete globalThis.window;
    });

    test('works without a window, as while prerendering', () => {
        expect(readStorage('quiz-phishing')).toBeNull();
        expect(() => writeStorage('quiz-phishing', '{}')).not.toThrow();
        expect(() => removeStorage('quiz-phishing')).not.toThrow();
    });

    test('works when the browser blocks site data', () => {
        globalThis.window = blockedWindow;
        expect(readStorage('quiz-phishing')).toBeNull();
        expect(() => writeStorage('quiz-phishing', '{}')).not.toThrow();
        expect(() => removeStorage('quiz-phishing')).not.toThrow();
        expect(readStoredScore('quiz-phishing')).toBeNull();
    });
});
