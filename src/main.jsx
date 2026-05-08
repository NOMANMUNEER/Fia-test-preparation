import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import CategoriesPage from './pages/CategoriesPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizSessionPage from './pages/QuizSessionPage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<CategoriesPage />} />
                        <Route path="categories/:categoryId/quizzes" element={<QuizzesPage />} />
                        <Route path="quiz/:quizId" element={
                            <ProtectedRoute>
                                <QuizSessionPage />
                            </ProtectedRoute>
                        } />
                        <Route path="result" element={
                            <ProtectedRoute>
                                <ResultPage />
                            </ProtectedRoute>
                        } />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="signup" element={<SignupPage />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
