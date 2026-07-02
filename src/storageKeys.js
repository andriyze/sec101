import { TOPIC_ORDER } from './topics';

export const PROGRESS_STORAGE_KEY = 'sec101-progress';
export const LANGUAGE_STORAGE_KEY = 'sec101-language';
export const QUIZ_UPDATED_EVENT = 'sec101:quiz-updated';
export const STORAGE_RESET_EVENT = 'sec101:storage-reset';
export const DEVICES_CHECKLIST_STORAGE_KEY = 'devices-checklist';

export const QUIZ_STORAGE_KEYS = TOPIC_ORDER.map((topicId) => `quiz-${topicId}`);
export const CHECKLIST_STORAGE_KEYS = [DEVICES_CHECKLIST_STORAGE_KEY];
export const RESETTABLE_STORAGE_KEYS = [...QUIZ_STORAGE_KEYS, ...CHECKLIST_STORAGE_KEYS];
