export const shuffleIndices = (length, random = Math.random) => {
    const order = Array.from({ length }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
};

export const readStoredScore = (storageKey, storage = globalThis.window?.localStorage) => {
    if (!storageKey || !storage) return null;
    const raw = storage.getItem(storageKey);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const scorePercent = (score) => (
    score?.total > 0 ? (score.score / score.total) * 100 : 0
);

export const isBetterScore = (nextScore, bestScore) => (
    scorePercent(nextScore) > (bestScore ? scorePercent(bestScore) : -1)
);
