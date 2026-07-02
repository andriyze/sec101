import { describe, expect, test } from 'bun:test';
import { tArray, tObject } from './safeTranslate';

describe('safe translation helpers', () => {
    test('tArray returns arrays and falls back for missing values', () => {
        const t = (key, options) => (key === 'items' ? ['one'] : options.defaultValue);
        expect(tArray(t, 'items')).toEqual(['one']);
        expect(tArray(t, 'missing')).toEqual([]);
    });

    test('tArray guards against string fallback values', () => {
        expect(tArray(() => 'missing.key', 'missing.key')).toEqual([]);
    });

    test('tObject returns objects and guards against arrays', () => {
        expect(tObject(() => ({ title: 'Red flag' }), 'flag')).toEqual({ title: 'Red flag' });
        expect(tObject(() => ['not', 'object'], 'flag')).toEqual({});
    });
});
