import { describe, expect, test } from 'bun:test';
import { pickLanguage } from './i18n';

const UTC = 'UTC';

describe('device language detection', () => {
    test('Ukrainian anywhere in the device languages wins', () => {
        expect(pickLanguage(['uk-UA'], UTC)).toBe('ua');
        expect(pickLanguage(['UK'], UTC)).toBe('ua');
        expect(pickLanguage(['en-GB', 'uk-UA'], UTC)).toBe('ua');
        expect(pickLanguage(['ru-RU', 'de', 'uk'], UTC)).toBe('ua');
    });

    test('Kyiv time means Ukrainian, under the current and the old zone names', () => {
        for (const zone of ['Europe/Kyiv', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye']) {
            expect(pickLanguage(['en-US'], zone)).toBe('ua');
        }
    });

    test('everything else gets English', () => {
        expect(pickLanguage(['en-US'], 'Europe/Warsaw')).toBe('en');
        expect(pickLanguage(['de-DE', 'fr'], 'Europe/Berlin')).toBe('en');
        expect(pickLanguage([], undefined)).toBe('en');
        expect(pickLanguage([undefined], undefined)).toBe('en');
    });
});
