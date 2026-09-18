/**
 * Keeps exactly one visualization animating at a time.
 *
 * Every stepped visualization registers its container element. An IntersectionObserver
 * tracks how much of each one is on screen; the most visible figure (at least half of it
 * in the viewport, or filling half the viewport; ties broken by the one closest to the
 * top) is played and every other
 * registered figure is paused. Pressing play on a figure makes it the active one for as
 * long as it stays on screen; scrolling it away hands control back to visibility.
 * The page being hidden (another tab, minimised window) pauses everything.
 */
const entries = new Map();
let observer = null;
let manualId = null;
let visibilityBound = false;

const ratioThresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

function evaluate() {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        entries.forEach((entry) => entry.onPause());
        return;
    }
    if (manualId && !(entries.get(manualId)?.ratio > 0)) manualId = null;

    let chosen = manualId;
    if (!chosen) {
        let best = null;
        entries.forEach((entry, id) => {
            if (entry.ratio < 0.5) return;
            if (!best || entry.ratio > best.entry.ratio || (entry.ratio === best.entry.ratio && entry.top < best.entry.top)) {
                best = { id, entry };
            }
        });
        chosen = best ? best.id : null;
    }
    entries.forEach((entry, id) => {
        if (id === chosen) entry.onPlay();
        else entry.onPause();
    });
}

function handleIntersections(list) {
    list.forEach((change) => {
        const entry = entries.get(change.target.dataset.vizId);
        if (!entry) return;
        const wasVisible = entry.ratio > 0;
        // A figure qualifies when half of it is on screen, or when it fills half the
        // viewport (tall figures on small screens never reach 50% of themselves).
        const viewportHeight = change.rootBounds?.height || window.innerHeight || 1;
        const coverage = change.intersectionRect.height / viewportHeight;
        entry.ratio = change.isIntersecting ? Math.max(change.intersectionRatio, coverage) : 0;
        entry.top = change.boundingClientRect.top;
        if (wasVisible && entry.ratio === 0) entry.onLeave();
    });
    evaluate();
}

function ensureObserver() {
    if (observer || typeof IntersectionObserver === 'undefined') return;
    observer = new IntersectionObserver(handleIntersections, { threshold: ratioThresholds });
    if (!visibilityBound && typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', evaluate);
        visibilityBound = true;
    }
}

/**
 * Register a visualization. Returns the matching unregister function.
 * @param {string} id
 * @param {{ el: Element, onPlay: () => void, onPause: () => void, onLeave: () => void }} handlers
 */
export function registerViz(id, { el, onPlay, onPause, onLeave }) {
    ensureObserver();
    if (!observer) return () => {};
    el.dataset.vizId = id;
    entries.set(id, { el, onPlay, onPause, onLeave, ratio: 0, top: Infinity });
    observer.observe(el);
    return () => {
        observer.unobserve(el);
        entries.delete(id);
        if (manualId === id) manualId = null;
        evaluate();
    };
}

/** The user pressed play on this figure: it wins until it scrolls away. */
export function activateViz(id) {
    manualId = id;
    evaluate();
}

/** The user paused or stepped this figure by hand: drop any manual claim it held. */
export function releaseViz(id) {
    if (manualId === id) manualId = null;
}

/** Test/diagnostic helper: ids of the registered figures. */
export function registeredVizIds() {
    return Array.from(entries.keys());
}
