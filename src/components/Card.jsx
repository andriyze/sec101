import React from 'react';
import { useTranslation } from 'react-i18next';

const Card = ({ title, description, link, linkText, icon }) => {
    const { t } = useTranslation();

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                {icon && <div className="icon-box">{icon}</div>}
                <h3 style={{ margin: icon ? '0 0 0 1rem' : 0 }}>{title}</h3>
            </div>
            <p>{description}</p>
            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', marginTop: '1rem', fontWeight: 600 }}
                >
                    {linkText || t('common.visit')} <span style={{ marginLeft: '5px' }}>→</span>
                </a>
            )}
        </div>
    );
};

export default Card;
