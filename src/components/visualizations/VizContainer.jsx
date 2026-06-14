import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';

const VizContainer = ({ title, description, children, className = '' }) => {
    const { t } = useTranslation();
    const titleId = useId();
    const descriptionId = useId();
    const accessibleDescription = description || (
        title
            ? t('visualizations.accessibility.titled', { title })
            : t('visualizations.accessibility.untitled')
    );

    return (
        <figure
            className={`card panel-solid viz-container ${className}`}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={descriptionId}
        >
            {title && <figcaption id={titleId} className="viz-title">{title}</figcaption>}
            <p id={descriptionId} className="sr-only">{accessibleDescription}</p>
            <div className="viz-content">
                {children}
            </div>
        </figure>
    );
};

export default VizContainer;
