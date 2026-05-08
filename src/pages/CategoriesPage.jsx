import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryCard from '../components/CategoryCard';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, isPremium } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/categories`);
                setCategories(res.data.data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
            setLoading(false);
        };
        fetchCategories();
    }, []);

    return (
        <div className="page-container">
            <div className="page-hero">
                <h1 className="page-title">FIA Exam Preparation</h1>
                <p className="page-subtitle">
                    Select a category to start practicing MCQs for your upcoming exam
                </p>
                {!isAuthenticated && (
                    <p className="page-cta">
                        💡 <a href="/login">Login</a> to start taking quizzes and track your progress
                    </p>
                )}
                {isAuthenticated && !isPremium && (
                    <p className="page-cta premium-cta">
                        ⭐ Free plan: 1 quiz per category per day. Contact admin for Premium access.
                    </p>
                )}
            </div>

            {loading ? (
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>Loading categories...</p>
                </div>
            ) : (
                <div className="categories-grid">
                    {categories.map(cat => (
                        <CategoryCard key={cat._id} category={cat} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
