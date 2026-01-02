import React from 'react';

const VizContainer = ({ title, children, className = '' }) => (
    <div className={`card panel-solid viz-container ${className}`}>
        {title && <h4 className="viz-title">{title}</h4>}
        <div className="viz-content">
            {children}
        </div>
    </div>
);

export default VizContainer;
