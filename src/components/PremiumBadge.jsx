import React from 'react';

const PremiumBadge = ({ role }) => {
    if (role === 'premium' || role === 'admin') {
        return <span className="premium-badge">⭐ Premium</span>;
    }
    return <span className="free-badge">Free</span>;
};

export default PremiumBadge;
