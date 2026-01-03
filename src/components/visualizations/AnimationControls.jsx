import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable animation control bar for visualizations
 * @param {Object} props
 * @param {number} props.currentStep - Current step index (0-based)
 * @param {number} props.totalSteps - Total number of steps
 * @param {boolean} props.isPlaying - Whether auto-play is active
 * @param {function} props.onPrev - Called when previous button clicked
 * @param {function} props.onNext - Called when next button clicked
 * @param {function} props.onGoToStep - Called with step index when dot clicked
 * @param {function} props.onTogglePlay - Called when play/pause clicked
 * @param {boolean} props.disabled - Disable all controls (e.g., for reduced motion)
 * @param {boolean} props.showStepDots - Show step indicator dots (default: true)
 * @param {boolean} props.loop - Whether animation loops (affects button states)
 */
const AnimationControls = ({
    currentStep,
    totalSteps,
    isPlaying,
    onPrev,
    onNext,
    onGoToStep,
    onTogglePlay,
    disabled = false,
    showStepDots = true,
    loop = true
}) => {
    const { t } = useTranslation();

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    return (
        <div className={`animation-controls ${disabled ? 'disabled' : ''}`}>
            {/* Previous button */}
            <button
                className="animation-control-btn"
                onClick={onPrev}
                disabled={disabled || (!loop && isFirstStep)}
                aria-label={t('controls.previous', 'Previous step')}
                title={t('controls.previous', 'Previous step')}
            >
                <ChevronLeft size={18} />
            </button>

            {/* Step dots */}
            {showStepDots && (
                <div className="animation-step-dots" role="tablist" aria-label={t('controls.steps', 'Animation steps')}>
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <button
                            key={i}
                            className={`animation-step-dot ${currentStep === i ? 'active' : ''} ${currentStep > i ? 'done' : ''}`}
                            onClick={() => onGoToStep?.(i)}
                            disabled={disabled}
                            role="tab"
                            aria-selected={currentStep === i}
                            aria-label={t('controls.go_to_step', { step: i + 1, defaultValue: `Go to step ${i + 1}` })}
                            title={t('controls.step_n', { n: i + 1, defaultValue: `Step ${i + 1}` })}
                        />
                    ))}
                </div>
            )}

            {/* Next button */}
            <button
                className="animation-control-btn"
                onClick={onNext}
                disabled={disabled || (!loop && isLastStep)}
                aria-label={t('controls.next', 'Next step')}
                title={t('controls.next', 'Next step')}
            >
                <ChevronRight size={18} />
            </button>

            {/* Play/Pause button */}
            <button
                className="animation-control-btn play-pause"
                onClick={onTogglePlay}
                disabled={disabled}
                aria-label={isPlaying ? t('controls.pause', 'Pause animation') : t('controls.play', 'Play animation')}
                title={isPlaying ? t('controls.pause', 'Pause') : t('controls.play', 'Play')}
            >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
        </div>
    );
};

export default AnimationControls;
