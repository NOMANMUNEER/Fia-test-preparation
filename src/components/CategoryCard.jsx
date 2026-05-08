import React from 'react';
import { Link } from 'react-router-dom';

const categoryIcons = {
    'General Knowledge': '📚',
    'English': '📝',
    'Islamic Studies': '☪️'
};

const categoryGradients = {
    'General Knowledge': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'English': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'Islamic Studies': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
};

const CategoryCard = ({ category }) => {
    const icon = categoryIcons[category.name] || '📖';
    const gradient = categoryGradients[category.name] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    return (
        <Link to={`/categories/${category._id}/quizzes`} className="category-card">
            <div className="category-card-glow" style={{ background: gradient }}></div>
            <div className="category-card-content">
                <div className="category-icon">{icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">
                    {category.description || 'Practice MCQs for exam preparation'}
                </p>
                <div className="category-footer">
                    <span className="category-arrow">Explore Quizzes →</span>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
