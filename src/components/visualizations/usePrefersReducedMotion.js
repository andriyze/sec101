import { useState, useEffect } from 'react';

export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e) => setPrefersReducedMotion(e.matches);

        // Use addEventListener if available, fallback to addListener for iOS Safari <14
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handler);
        } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handler);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handler);
            } else if (mediaQuery.removeListener) {
                mediaQuery.removeListener(handler);
            }
        };
    }, []);

    return prefersReducedMotion;
};
