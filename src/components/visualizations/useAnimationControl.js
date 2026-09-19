import { useState, useEffect, useCallback, useRef, useId } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { registerViz, activateViz, releaseViz } from './vizScheduler';

/**
 * Hook for controlling visualization animations with play/pause and step navigation.
 *
 * Attach the returned `vizRef` to the visualization's container (VizContainer accepts it
 * as `ref`). With `autoPlayOnView` (default) the figure starts playing when it is the most
 * visible visualization on screen and pauses when another one takes over or it scrolls
 * away; only one visualization animates at a time. Manual controls always win: stepping or
 * pausing keeps the figure paused until it leaves the viewport, pressing play makes it the
 * active one.
 *
 * @param {Object} options
 * @param {number} options.totalSteps - Total number of steps in the animation
 * @param {number} options.interval - Auto-advance interval in ms (default: 4000)
 * @param {boolean} options.loop - Whether to loop back to start (default: true)
 * @param {number} options.initialStep - Starting step (default: 0)
 * @param {boolean} options.autoPlay - Start playing immediately, regardless of visibility (default: false)
 * @param {boolean} options.autoPlayOnView - Play while this is the most visible figure (default: true)
 */
export const useAnimationControl = ({
    totalSteps,
    interval = 4000,
    loop = true,
    initialStep = 0,
    autoPlay = false,
    autoPlayOnView = true
} = {}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const vizId = useId();
    const vizRef = useRef(null);
    // Set once the user stepped or paused by hand; cleared when the figure scrolls away.
    const userPausedRef = useRef(false);

    const [currentStep, setCurrentStep] = useState(() => {
        // For reduced motion, show final state immediately
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return totalSteps - 1;
        }
        return initialStep;
    });
    const [isPlaying, setIsPlaying] = useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return false;
        }
        return autoPlay;
    });
    const intervalRef = useRef(null);

    // Clear interval helper
    const clearAnimationInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Set up auto-advance interval
    useEffect(() => {
        if (isPlaying && !prefersReducedMotion) {
            intervalRef.current = setInterval(() => {
                setCurrentStep((prev) => {
                    const next = prev + 1;
                    if (next >= totalSteps) {
                        return loop ? 0 : prev;
                    }
                    return next;
                });
            }, interval);
        }

        return clearAnimationInterval;
    }, [isPlaying, interval, totalSteps, loop, prefersReducedMotion, clearAnimationInterval]);

    // Let the page-wide scheduler start and stop this figure based on visibility.
    useEffect(() => {
        const el = vizRef.current;
        if (!autoPlayOnView || prefersReducedMotion || !el) return undefined;
        return registerViz(vizId, {
            el,
            onPlay: () => { if (!userPausedRef.current) setIsPlaying(true); },
            onPause: () => setIsPlaying(false),
            onLeave: () => { userPausedRef.current = false; }
        });
    }, [vizId, autoPlayOnView, prefersReducedMotion]);

    // Reduced motion: start on the final state and never autoplay, but every step stays
  // reachable through the controls so the narration is not lost.
  const effectiveCurrentStep = currentStep
    const effectiveIsPlaying = prefersReducedMotion ? false : isPlaying;

    const holdManually = useCallback(() => {
        userPausedRef.current = true;
        releaseViz(vizId);
        setIsPlaying(false);
    }, [vizId]);

    // Go to next step (pauses auto-play)
    const nextStep = useCallback(() => {
        holdManually();
        setCurrentStep((prev) => {
            const next = prev + 1;
            if (next >= totalSteps) {
                return loop ? 0 : prev;
            }
            return next;
        });
    }, [totalSteps, loop, holdManually]);

    // Go to previous step (pauses auto-play)
    const prevStep = useCallback(() => {
        holdManually();
        setCurrentStep((prev) => {
            const next = prev - 1;
            if (next < 0) {
                return loop ? totalSteps - 1 : 0;
            }
            return next;
        });
    }, [totalSteps, loop, holdManually]);

    // Jump to specific step (pauses auto-play)
    const goToStep = useCallback((step) => {
        holdManually();
        setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    }, [totalSteps, holdManually]);

    // Play: this figure becomes the active one
    const play = useCallback(() => {
        if (prefersReducedMotion) return;
        userPausedRef.current = false;
        setIsPlaying(true);
        if (autoPlayOnView) activateViz(vizId);
    }, [prefersReducedMotion, autoPlayOnView, vizId]);

    // Pause
    const pause = useCallback(() => {
        holdManually();
    }, [holdManually]);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        if (prefersReducedMotion) return;
        if (isPlaying) pause(); else play();
    }, [prefersReducedMotion, isPlaying, pause, play]);

    // Reset to beginning (keeps the current playing state)
    const reset = useCallback(() => {
        setCurrentStep(0);
    }, []);

    return {
        vizRef,
        currentStep: effectiveCurrentStep,
        isPlaying: effectiveIsPlaying,
        isFirstStep: effectiveCurrentStep === 0,
        isLastStep: effectiveCurrentStep === totalSteps - 1,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
        togglePlay,
        play,
        pause,
        reset,
        prefersReducedMotion
    };
};

export default useAnimationControl;
