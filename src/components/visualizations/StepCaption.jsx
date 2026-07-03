import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Per-step narration panel shared by stepped visualizations.
 * @param {Object} props
 * @param {Array<{title: string, text: string}>} props.steps - One caption per animation step
 * @param {number} props.currentStep - Current step index (0-based)
 */
const StepCaption = ({ steps = [], currentStep = 0 }) => {
    const { t } = useTranslation();
    const step = steps[currentStep];
    if (!step) return null;

    return (
        <div className="viz-step-caption" aria-live="polite" aria-atomic="true">
            <span className="viz-step-caption-number">
                {t('controls.step_n', { n: currentStep + 1, defaultValue: `Step ${currentStep + 1}` })} / {steps.length}
            </span>
            <h5 className="viz-step-caption-title">{step.title}</h5>
            <p className="viz-step-caption-text">{step.text}</p>
        </div>
    );
};

export default StepCaption;
