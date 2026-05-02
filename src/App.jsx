import React, { useState, useEffect } from 'react';
import axios from 'axios';

// اپنا رینڈر یو آر ایل یہاں ڈالیں
const API_URL = "https://project-production-7d46.up.railway.app/api";

function App() {
  const [view, setView] = useState('home'); // home, quiz, result
  const [quizzes, setQuizzes] = useState([]); // Default empty array
  const [questions, setQuestions] = useState([]); // Default empty array
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token] = useState(localStorage.getItem('token'));

  // 1. کوئز لسٹ لوڈ کریں
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${API_URL}/quizzes`);
        setQuizzes(res.data.data || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setQuizzes([]); // Error ki surat mein empty array
      }
    };
    fetchQuizzes();
  }, []);

  // 2. کوئز شروع کریں
  const startQuiz = async (quizId) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/quizzes/${quizId}/questions?limit=10`);
      setQuestions(res.data.data || []);
      setCurrentIdx(0);
      setScore(0);
      setView('quiz');
    } catch (err) {
      alert("Failed to load questions. Check your Backend/CORS.");
    }
    setLoading(false);
  };

  // 3. جواب پر کلک ہینڈل کریں
  const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentIdx];
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      submitScore();
    }
  };

  // 4. اسکور بیک اینڈ پر سیو کریں
  const submitScore = async () => {
    setView('result');
    if (!token) return;

    try {
      await axios.post(`${API_URL}/quizzes/submit`, {
        quizId: questions[0].quiz,
        score: Math.round((score / questions.length) * 100),
        correctCount: score,
        totalQuestions: questions.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to save result");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-xl mx-auto">
        
        <header className="bg-blue-600 text-white p-6 rounded-t-xl shadow-lg mb-4 text-center">
          <h1 className="text-2xl font-bold">FIA Exam Portal</h1>
          <p className="text-sm opacity-80">Official Preparation Material</p>
        </header>

        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Select a Topic</h2>
            {quizzes.length > 0 ? (
              quizzes.map(q => (
                <button 
                  key={q._id} 
                  onClick={() => startQuiz(q._id)}
                  className="w-full text-left p-4 mb-3 rounded-lg border hover:bg-blue-50 hover:border-blue-500 transition-all flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold">{q.title}</div>
                    <div className="text-xs text-gray-500">{q.category}</div>
                  </div>
                  <span className="text-blue-500">Start →</span>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-500">Loading quizzes... Make sure Backend is running.</p>
            )}
          </div>
        )}

        {/* --- QUIZ VIEW --- */}
        {view === 'quiz' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            {loading ? (
              <p className="text-center">Loading questions...</p>
            ) : questions.length > 0 ? (
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-6">
                  {questions[currentIdx]?.questionText}
                </h3>

                <div className="space-y-3">
                  {questions[currentIdx]?.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left p-4 rounded-lg border-2 border-gray-100 hover:border-blue-600 hover:bg-blue-50 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-red-500">No questions found in this quiz.</p>
            )}
          </div>
        )}

        {/* --- RESULT VIEW --- */}
        {view === 'result' && (
          <div className="bg-white p-10 rounded-xl shadow-md text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">Test Finished!</h2>
            <p className="text-gray-600 mb-6">Your Performance Report</p>
            
            <div className="text-6xl font-black mb-6">
              {Math.round((score / (questions.length || 1)) * 100)}%
            </div>

            <div className="flex justify-around mb-8 text-sm">
              <div className="text-green-600 font-bold">Correct: {score}</div>
              <div className="text-red-600 font-bold">Total: {questions.length}</div>
            </div>

            <button 
              onClick={() => setView('home')}
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all"
            >
              Try Another Quiz
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;