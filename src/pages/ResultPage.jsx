import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score = 0, total = 0, quizId } = location.state || {};

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    let performanceClass = 'performance-low';
    let performanceText = 'Keep Practicing! 💪';
    if (percentage >= 80) {
        performanceClass = 'performance-high';
        performanceText = 'Excellent Work! 🏆';
    } else if (percentage >= 50) {
        performanceClass = 'performance-mid';
        performanceText = 'Good Effort! 📈';
    }

    return (
        <div className="page-container">
            <div className="result-card">
                <div className={`result-circle ${performanceClass}`}>
                    <span className="result-percentage">{percentage}%</span>
                </div>

                <h2 className="result-title">{performanceText}</h2>
                <p className="result-subtitle">Quiz Completed Successfully</p>

                <div className="result-stats">
                    <div className="stat-item stat-correct">
                        <span className="stat-value">{score}</span>
                        <span className="stat-label">Correct</span>
                    </div>
                    <div className="stat-item stat-wrong">
                        <span className="stat-value">{total - score}</span>
                        <span className="stat-label">Wrong</span>
                    </div>
                    <div className="stat-item stat-total">
                        <span className="stat-value">{total}</span>
                        <span className="stat-label">Total</span>
                    </div>
                </div>

                <div className="result-actions">
                    <button onClick={() => navigate(-1)} className="btn-secondary">
                        ← Try Another Quiz
                    </button>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        🏠 Back to Categories
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
