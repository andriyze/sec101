import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Hook for controlling visualization animations with play/pause and step navigation
 * @param {Object} options
 * @param {number} options.totalSteps - Total number of steps in the animation
 * @param {number} options.interval - Auto-advance interval in ms (default: 4000)
 * @param {boolean} options.loop - Whether to loop back to start (default: true)
 * @param {number} options.initialStep - Starting step (default: 0)
 * @param {boolean} options.autoPlay - Start playing automatically (default: true)
 */
export const useAnimationControl = ({
    totalSteps,
    interval = 4000,
    loop = true,
    initialStep = 0,
    autoPlay = true
} = {}) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [isPlaying, setIsPlaying] = useState(autoPlay && !prefersReducedMotion);
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
        if (prefersReducedMotion) {
            setIsPlaying(false);
            setCurrentStep(totalSteps - 1); // Show final state
            return;
        }

        if (isPlaying) {
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

    // Go to next step (pauses auto-play)
    const nextStep = useCallback(() => {
        setIsPlaying(false);
        setCurrentStep((prev) => {
            const next = prev + 1;
            if (next >= totalSteps) {
                return loop ? 0 : prev;
            }
            return next;
        });
    }, [totalSteps, loop]);

    // Go to previous step (pauses auto-play)
    const prevStep = useCallback(() => {
        setIsPlaying(false);
        setCurrentStep((prev) => {
            const next = prev - 1;
            if (next < 0) {
                return loop ? totalSteps - 1 : 0;
            }
            return next;
        });
    }, [totalSteps, loop]);

    // Jump to specific step (pauses auto-play)
    const goToStep = useCallback((step) => {
        setIsPlaying(false);
        setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    }, [totalSteps]);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        if (prefersReducedMotion) return;
        setIsPlaying((prev) => !prev);
    }, [prefersReducedMotion]);

    // Play
    const play = useCallback(() => {
        if (prefersReducedMotion) return;
        setIsPlaying(true);
    }, [prefersReducedMotion]);

    // Pause
    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Reset to beginning
    const reset = useCallback(() => {
        setCurrentStep(0);
        setIsPlaying(autoPlay && !prefersReducedMotion);
    }, [autoPlay, prefersReducedMotion]);

    return {
        currentStep,
        isPlaying,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === totalSteps - 1,
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
