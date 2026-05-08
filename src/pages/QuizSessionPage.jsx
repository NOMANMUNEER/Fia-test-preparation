import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QuizSessionPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`${API_URL}/quizzes/${quizId}/questions`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuestions(res.data.data || []);
            } catch (err) {
                if (err.response?.status === 403 && err.response?.data?.upgradeRequired) {
                    setError('🔒 ' + err.response.data.message);
                } else if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError('Failed to load questions. Please try again.');
                }
            }
            setLoading(false);
        };
        fetchQuestions();
    }, [quizId, token, navigate]);

    const handleAnswer = (option) => {
        if (showFeedback) return; // Prevent double-click
        
        setSelectedAnswer(option);
        setShowFeedback(true);

        const isCorrect = option === questions[currentIdx].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Auto-advance after 800ms
        setTimeout(() => {
            if (currentIdx + 1 < questions.length) {
                setCurrentIdx(prev => prev + 1);
                setSelectedAnswer(null);
                setShowFeedback(false);
            } else {
                // Quiz finished — submit and navigate to results
                submitAndNavigate(isCorrect ? score + 1 : score);
            }
        }, 800);
    };

    const submitAndNavigate = async (finalScore) => {
        try {
            await axios.post(`${API_URL}/quizzes/${quizId}/submit`, {
                score: Math.round((finalScore / questions.length) * 100),
                correctCount: finalScore,
                totalQuestions: questions.length
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Failed to save result:', err);
        }

        navigate('/result', {
            state: {
                score: finalScore,
                total: questions.length,
                quizId
            }
        });
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>Loading questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error-card">
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)} className="btn-back">
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="page-container">
                <div className="error-card">
                    <p>No questions found in this quiz.</p>
                    <button onClick={() => navigate(-1)} className="btn-back">
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="page-container">
            <div className="quiz-session">
                {/* Progress Bar */}
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="quiz-session-header">
                    <span className="q-counter">
                        Question {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="q-score">Score: {score}</span>
                </div>

                <div className="quiz-session-card">
                    <h3 className="question-text">{currentQ.questionText}</h3>

                    <div className="options-list">
                        {currentQ.options.map((opt, i) => {
                            let optClass = 'option-btn';
                            if (showFeedback) {
                                if (opt === currentQ.correctAnswer) {
                                    optClass += ' option-correct';
                                } else if (opt === selectedAnswer && opt !== currentQ.correctAnswer) {
                                    optClass += ' option-wrong';
                                } else {
                                    optClass += ' option-disabled';
                                }
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt)}
                                    className={optClass}
                                    disabled={showFeedback}
                                >
                                    <span className="option-letter">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="option-text">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizSessionPage;
