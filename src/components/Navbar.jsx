import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PremiumBadge from './PremiumBadge';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🛡️</span>
                    <span className="brand-text">FIA Exam Portal</span>
                </Link>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <PremiumBadge role={user?.role} />
                            <span className="user-name">{user?.name}</span>
                            <button onClick={handleLogout} className="btn-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="btn-nav">Login</Link>
                            <Link to="/signup" className="btn-nav btn-nav-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
