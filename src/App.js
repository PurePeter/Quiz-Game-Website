import React, { useState, useEffect } from 'react';
import Quiz from './Components/Quiz/Quiz.js';
import Lobby from './Components/Lobby/Lobby';
import CountDown from './Components/CountDown/CountDown.js';
import EndGame from './Components/EndGame/EndGame.js';
import Header from './Components/Header/Header.js';
import CreateQuiz from './Components/CreateQuiz/CreateQuiz.js';
import History from './Components/History/History.js';
import GameRoom from './Components/GameRoom/GameRoom.js';
import Settings from './Components/Settings/Settings.js';
import EditProfile from './Components/EditProfile/EditProfile.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

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

    // API Configuration
    const API_BASE = 'http://localhost:3000/api/v1';

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
    const [token, setToken] = useState('');

    // Current page state
    const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('currentPage') || 'lobby');

    // GameRoom state
    const [showGameRoom, setShowGameRoom] = useState(false);
    const [currentRoomCode, setCurrentRoomCode] = useState('');
    const [currentQuizId, setCurrentQuizId] = useState('');
    const [quizToEditId, setQuizToEditId] = useState(null);
    const [currentPlayerName, setCurrentPlayerName] = useState('');

    useEffect(() => {
        setQuestions(mockQuestions);

        // Check if user is already logged in (localStorage)
        const savedUser = localStorage.getItem('quizUser');
        const savedToken = localStorage.getItem('quiz_token');

        if (savedUser && savedToken) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setToken(savedToken);
            setIsAuthenticated(true);
            console.log('✅ User đã đăng nhập từ localStorage:', userData);
        }
        const savedNightMode = localStorage.getItem('settings_nightMode');
        if (savedNightMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    }, []);

    // API Authentication handlers
    const handleLogin = async (credentials) => {
        try {
            console.log('🔑 App.js: Bắt đầu đăng nhập với API...');

            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const data = await response.json();
            console.log('📥 App.js: Login response:', data);

            if (data.success && data.user) {
                let userData = {
                    _id: data.user._id,
                    name: data.user.name,
                    email: data.user.email,
                    avatar: data.user.profilePicture ? `http://localhost:3000${data.user.profilePicture}` : '', // Use profilePicture and construct absolute URL
                    token: data.token,
                };

                // If avatar is still empty, use default avatar
                if (!userData.avatar) {
                    userData.avatar = `https://ui-avatars.com/api/?name=${data.user.name}&background=4f46e5&color=fff`;
                }

                setUser(userData);
                setToken(data.token);
                setIsAuthenticated(true);

                localStorage.setItem('quizUser', JSON.stringify(userData));
                localStorage.setItem('quiz_token', data.token);

                console.log('✅ App.js: Đăng nhập thành công:', userData);
                toast.success('Đăng nhập thành công!');
                return { success: true, user: userData };
            } else {
                console.log('❌ App.js: Đăng nhập thất bại:', data.message || 'Không có thông tin user');
                toast.error(data.message || 'Đăng nhập thất bại!');
                return { success: false, message: data.message || 'Không có thông tin user' };
            }
        } catch (error) {
            console.error('❌ App.js: Lỗi đăng nhập:', error);
            toast.error('Lỗi kết nối server');
            return { success: false, message: 'Lỗi kết nối server' };
        }
    };

    const handleRegister = async (userData) => {
        try {
            console.log('🚀 App.js: Bắt đầu đăng ký với API...');

            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                }),
            });

            const data = await response.json();
            console.log('📥 App.js: Register response:', data);

            if (data.success) {
                console.log('✅ App.js: Đăng ký thành công:', data.user);
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
            } else {
                console.log('❌ App.js: Đăng ký thất bại:', data.message);
                toast.error(data.message || 'Đăng ký thất bại!');
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('❌ App.js: Lỗi đăng ký:', error);
            toast.error('Lỗi kết nối server');
            return { success: false, message: 'Lỗi kết nối server' };
        }
    };

    const handleLogout = () => {
        setUser(null);
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('quizUser');
        localStorage.removeItem('quiz_token');

        // Reset quiz state
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setIsQuizStarted(false);
        setIsCountingDown(false);
        setPlayerName('');

        // Reset GameRoom state
        setShowGameRoom(false);
        setCurrentRoomCode('');
        setCurrentQuizId('');

        console.log('✅ User đã đăng xuất');
        toast.success('Đăng xuất thành công!');
    };

    // GameRoom handlers
    const handleEnterGameRoom = (roomCode, quizId, playerName) => {
        console.log(' Entering game room:', { roomCode, quizId, playerName });
        setCurrentRoomCode(roomCode);
        setCurrentQuizId(quizId);
        setCurrentPlayerName(playerName || '');
        setShowGameRoom(true);
    };

    const handleStartEditQuiz = (quizId) => {
        setQuizToEditId(quizId);
        setCurrentPage('create');
    };

    const handleFinishEditing = () => {
        setQuizToEditId(null);
        setCurrentPage('lobby');
    };

    const handleBackToLobby = () => {
        console.log('🏠 Going back to lobby');
        setShowGameRoom(false);
        setCurrentRoomCode('');
        setCurrentQuizId('');
        setCurrentPlayerName('');
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
        if (!isAuthenticated) {
            toast.warn('Vui lòng đăng nhập để chơi quiz!');
            return;
        }

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

    const handlePageChange = (page) => {
        setCurrentPage(page);
        localStorage.setItem('currentPage', page);

        if (page !== 'quiz') {
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowScore(false);
            setIsQuizStarted(false);
            setIsCountingDown(false);
            setPlayerName('');
        }
    };

    // Determine current page for header navigation
    const getCurrentPage = () => {
        if (showGameRoom) return 'gameRoom';
        if (isQuizStarted || isCountingDown) return 'quiz';
        if (showScore) return 'history';
        return currentPage;
    };

    // Render content based on current page
    const renderContent = () => {
        if (showGameRoom) {
            return (
                <GameRoom
                    roomCode={currentRoomCode}
                    quizId={currentQuizId}
                    user={user}
                    playerName={currentPlayerName}
                    onBackToLobby={handleBackToLobby}
                />
            );
        }

        if (isCountingDown) {
            return <CountDown initialCount={3} onFinish={handleCountdownFinish} />;
        }

        if (isQuizStarted && !showScore) {
            return (
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
            );
        }

        if (showScore) {
            return (
                <EndGame
                    score={score}
                    totalQuestions={questions.length}
                    onRestart={restartQuiz}
                    playerName={playerName}
                />
            );
        }

        switch (currentPage) {
            case 'create':
                return (
                    <CreateQuiz
                        isAuthenticated={isAuthenticated}
                        user={user}
                        quizId={quizToEditId}
                        onFinishEditing={handleFinishEditing}
                    />
                );
            case 'history':
                return <History isAuthenticated={isAuthenticated} user={user} />;
            case 'leaderboard':
                return (
                    <EndGame
                        score={0}
                        totalQuestions={0}
                        onFinish={() => {}}
                        playerName=""
                        showLeaderboardOnly={true}
                    />
                );
            case 'settings':
                return <Settings />;
            case 'edit-profile':
                return (
                    <EditProfile
                        user={user}
                        onClose={() => handlePageChange('lobby')}
                        onUpdateUser={(updatedUser) => {
                            setUser(updatedUser);
                            toast.success('Hồ sơ đã được cập nhật!');
                        }}
                    />
                );
            default:
                return (
                    <Lobby
                        onStartQuiz={startQuiz}
                        isAuthenticated={isAuthenticated}
                        user={user}
                        onEnterGameRoom={handleEnterGameRoom}
                        onEditQuiz={handleStartEditQuiz}
                    />
                );
        }
    };

    return (
        <div className="App">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Header
                isAuthenticated={isAuthenticated}
                user={user}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onLogout={handleLogout}
                onShowProfile={() => handlePageChange('edit-profile')}
                currentPage={getCurrentPage()}
                onPageChange={handlePageChange}
            />

            <div className="main-content">{renderContent()}</div>
        </div>
    );
}

export default App;
