import React from 'react';

const ProgressBar = ({ completed, total, showLabel = true }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <span className="progress-bar-label">{percentage}%</span>
            )}
        </div>
    );
};

export default ProgressBar;
