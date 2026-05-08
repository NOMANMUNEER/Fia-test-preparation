import React from 'react';

const QuizCard = ({ quiz, index, onStart, locked }) => {
    return (
        <div className={`quiz-card ${locked ? 'quiz-card-locked' : ''}`}>
            <div className="quiz-card-number">{String(index + 1).padStart(2, '0')}</div>
            <div className="quiz-card-info">
                <h4 className="quiz-card-title">{quiz.title}</h4>
                <p className="quiz-card-meta">
                    {quiz.totalQuestions || 20} Questions
                </p>
            </div>
            <div className="quiz-card-action">
                {locked ? (
                    <div className="quiz-locked-label">
                        <span>🔒</span>
                        <span>Premium Only</span>
                    </div>
                ) : (
                    <button 
                        onClick={() => onStart(quiz._id)} 
                        className="btn-start-quiz"
                    >
                        Start Quiz
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizCard;
