import React, { useState, useEffect } from 'react';
import Quiz from '~/Components/Quiz/Quiz.js';
import Lobby from '~/Components/Lobby/Lobby';
import CountDown from '~/Components/CountDown/CountDown.js';
import EndGame from '~/Components/EndGame/EndGame.js';
import Header from '~/Components/Header/Header.js';

import '~/App.css';

function App() {
    const mockQuestions = [
        {
            questionText: 'Cổng mặc định của HTTP là gì?',
            imageUrl:
                'https://techvccloud.mediacdn.vn/2019/8/20/http-la-gi-15662919193721251939952-crop-1566291923697896132468.jpg',
            answerOptions: [
                { answerText: '80', isCorrect: true },
                { answerText: '443', isCorrect: false },
                { answerText: '8080', isCorrect: false },
                { answerText: '5000', isCorrect: false },
            ],
        },
        {
            questionText: 'TCP và UDP khác nhau chủ yếu ở điểm nào?',
            imageUrl: 'https://cloud.z.com/vn/wp-content/uploads/2023/06/udp-vs-tcp-1-.png',
            answerOptions: [
                { answerText: 'UDP đáng tin cậy hơn TCP', isCorrect: false },
                { answerText: 'TCP có kiểm soát lỗi, UDP thì không', isCorrect: true },
                { answerText: 'TCP dùng cho email, UDP dùng cho web', isCorrect: false },
                { answerText: 'UDP có độ trễ thấp hơn nhưng luôn chính xác hơn', isCorrect: false },
            ],
        },
        {
            questionText: 'Hình nào dưới đây là thủ đô của Việt Nam?',
            imageUrl: 'https://dulichviet.net.vn/wp-content/uploads/2019/09/thu-do-ha-noi.png',
            answerOptions: [
                { answerText: 'Hồ Chí Minh', isCorrect: false },
                { answerText: 'Đà Nẵng', isCorrect: false },
                { answerText: 'Cần Thơ', isCorrect: false },
                { answerText: 'Hà Nội', isCorrect: true },
            ],
        },
    ];

    // Quiz state
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [playerName, setPlayerName] = useState('');

    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        setQuestions(mockQuestions);
        
        // Check if user is already logged in (localStorage)
        const savedUser = localStorage.getItem('quizUser');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setIsAuthenticated(true);
        }
    }, []);

    // Authentication handlers
    const handleLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('quizUser', JSON.stringify(userData));
        console.log('User logged in:', userData);
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('quizUser');
        
        // Reset quiz state when logging out
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setIsQuizStarted(false);
        setIsCountingDown(false);
        setPlayerName('');
        
        console.log('User logged out');
    };

    const handleShowProfile = () => {
        setShowProfileModal(true);
    };

    // Quiz handlers
    const handleAnswer = (isCorrect, point) => {
        if (isCorrect) {
            setScore((prev) => prev + point);
        }
    };

    const handleNextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            setShowScore(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setIsQuizStarted(false);
        setIsCountingDown(false);
    };

    const startQuiz = (name) => {
        // Check if user is authenticated before starting quiz
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để chơi quiz!');
            return;
        }
        
        // Use authenticated user's name
        const quizPlayerName = user ? user.name : 'Guest';
        setPlayerName(quizPlayerName);
        setShowScore(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsCountingDown(true);
    };

    const handleCountdownFinish = () => {
        setIsCountingDown(false);
        setIsQuizStarted(true);
    };

    // Determine current page for header navigation
    const getCurrentPage = () => {
        if (isQuizStarted || isCountingDown) return 'quiz';
        if (showScore) return 'history';
        return 'quiz';
    };

    return (
        <div className="App">
            <Header
                isAuthenticated={isAuthenticated}
                user={user}
                onLogin={handleLogin}
                onLogout={handleLogout}
                onShowProfile={handleShowProfile}
                currentPage={getCurrentPage()}
            />
            
            {/* Main Content with top margin to account for fixed header */}
            <div className="main-content">
                {isCountingDown ? (
                    <CountDown initialCount={3} onFinish={handleCountdownFinish} />
                ) : !isQuizStarted ? (
                    <Lobby 
                        onStartQuiz={startQuiz} 
                        isAuthenticated={isAuthenticated}
                        user={user}
                    />
                ) : showScore ? (
                    <EndGame
                        score={score}
                        totalQuestions={questions.length}
                        onRestart={restartQuiz}
                        playerName={playerName}
                    />
                ) : (
                    <>
                        {questions.length > 0 ? (
                            <Quiz
                                questionData={questions[currentQuestionIndex]}
                                currentQuestionIndex={currentQuestionIndex}
                                totalQuestions={questions.length}
                                score={score}
                                onAnswer={handleAnswer}
                                onNext={handleNextQuestion}
                            />
                        ) : (
                            <h2>Đang tải câu hỏi...</h2>
                        )}
                    </>
                )}
            </div>

            {/* Profile Modal */}
            {showProfileModal && (
                <ProfileModal 
                    user={user}
                    onClose={() => setShowProfileModal(false)}
                    onUpdateUser={setUser}
                />
            )}
        </div>
    );
}

// Profile Modal Component
const ProfileModal = ({ user, onClose, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {
            ...user,
            ...formData,
            avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=4f46e5&color=fff`
        };
        
        onUpdateUser(updatedUser);
        localStorage.setItem('quizUser', JSON.stringify(updatedUser));
        onClose();
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Hồ sơ cá nhân</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="name">Tên hiển thị</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên hiển thị"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Nhập email"
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            Cập nhật
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;
