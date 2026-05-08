import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuizCard from '../components/QuizCard';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QuizzesPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const { token, isPremium, isAuthenticated } = useAuth();

    const [quizzes, setQuizzes] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [todayAttempted, setTodayAttempted] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${API_URL}/categories/${categoryId}/quizzes?page=${page}&limit=10`
                );
                setQuizzes(res.data.data || []);
                setTotalPages(res.data.pagination?.totalPages || 1);

                // Get category name from the first quiz
                if (res.data.data?.length > 0 && res.data.data[0].category) {
                    setCategoryName(res.data.data[0].category.name || '');
                }
            } catch (err) {
                console.error('Error fetching quizzes:', err);
            }
            setLoading(false);
        };
        fetchQuizzes();
    }, [categoryId, page]);

    // Check if free user has already attempted today for this category
    useEffect(() => {
        const checkAttempts = async () => {
            if (!token || isPremium) return;
            try {
                const res = await axios.get(`${API_URL}/auth/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const attempted = res.data.data?.some(attempt => {
                    const attemptDate = new Date(attempt.createdAt);
                    return attemptDate >= today && attempt.category === categoryId;
                });
                setTodayAttempted(attempted);
            } catch (err) {
                console.error('Error checking attempts:', err);
            }
        };
        checkAttempts();
    }, [token, isPremium, categoryId]);

    const handleStartQuiz = (quizId) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate(`/quiz/${quizId}`);
    };

    return (
        <div className="page-container">
            <button onClick={() => navigate('/')} className="btn-back">
                ← Back to Categories
            </button>

            <div className="page-hero">
                <h1 className="page-title">{categoryName || 'Quizzes'}</h1>
                <p className="page-subtitle">
                    Choose a mock test to start practicing
                </p>
                {!isPremium && todayAttempted && (
                    <div className="limit-banner">
                        🔒 You've used your free daily attempt for this category. Upgrade to Premium for unlimited access.
                    </div>
                )}
            </div>

            {loading ? (
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>Loading quizzes...</p>
                </div>
            ) : (
                <>
                    <div className="quizzes-list">
                        {quizzes.map((quiz, i) => (
                            <QuizCard
                                key={quiz._id}
                                quiz={quiz}
                                index={(page - 1) * 10 + i}
                                onStart={handleStartQuiz}
                                locked={!isPremium && todayAttempted}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-page"
                            >
                                ← Previous
                            </button>
                            <span className="page-info">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn-page"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default QuizzesPage;
