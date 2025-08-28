import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './GameRoom.css';

const GameRoom = ({ roomCode, quizId, user, playerName, onBackToLobby }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
    const [players, setPlayers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questionTimer, setQuestionTimer] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [gameLogs, setGameLogs] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [roomId, setRoomId] = useState('');
    const [countdown, setCountdown] = useState(null); // null hoặc số 3,2,1,0
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
    const [playerNames, setPlayerNames] = useState({});

    const socketRef = useRef();
    const timerRef = useRef();
    const playerNameRef = useRef(playerName);

    useEffect(() => {
        playerNameRef.current = playerName;
    }, [playerName]);

    const resolvePlayerName = (player) => {
        const playerId = player.userId || player.id || player._id;
        const isMe = user && playerId === user._id;
        if (isMe) {
            return (
                playerName || player.name || player.username || player.displayName || (user && user.name) || 'Player'
            );
        }
        return player.name || player.username || player.displayName || 'Player';
    };

    useEffect(() => {
        const names = {};
        players.forEach((player) => {
            const playerId = player.userId || player.id || player._id;
            if (playerId) {
                names[playerId] = resolvePlayerName(player);
            }
        });
        setPlayerNames(names);
    }, [players, playerName]);

    // Initialize Socket.IO connection
    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        socketRef.current = newSocket;

        // Connection events
        newSocket.on('connect', () => {
            console.log('✅ Connected to Socket.IO server');
            setConnected(true);
            setSocket(newSocket); // Thêm dòng này để đảm bảo socket được set ngay khi kết nối
            addGameLog('✅ Kết nối thành công với server', 'success');

            // Authenticate with JWT token
            const token = localStorage.getItem('quiz_token');
            if (token) {
                newSocket.emit('authenticate', { token });
            }
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            setConnected(false);
            setAuthenticated(false);
            addGameLog('❌ Mất kết nối với server', 'error');
        });

        // Authentication events
        newSocket.on('authenticated', (data) => {
            console.log('✅ Authenticated successfully:', data);
            setAuthenticated(true);
            addGameLog('✅ Xác thực thành công', 'success');

            // Join room after authentication
            newSocket.emit('join_room', { roomCode, playerName: playerNameRef.current });
        });

        // Room events - Match với backend events
        newSocket.on('room_created', (res) => {
            alert(`✅ Phòng đã được tạo thành công! Room Code: ${res.data.roomCode}`);
            onBackToLobby();
        });

        newSocket.on('room_joined', (res) => {
            console.log('Room joined data:', res); // Thêm log để debug
            setRoomId(res.data?.roomId || '');
            const incoming = Array.isArray(res.data?.players) ? res.data.players : [];
            setPlayers(incoming);
            setIsHost(res.data?.isHost || false);
            setGameState(res.data?.status || 'waiting');
            addGameLog(`🏠 Đã tham gia phòng ${roomCode}`, 'info');
        });

        newSocket.on('player_joined', (data) => {
            const incoming = Array.isArray(data.players) ? data.players : [];
            setPlayers(incoming);
            addGameLog(`${data.playerName || 'Player'} đã tham gia phòng`, 'info');
        });

        newSocket.on('player_left', (data) => {
            if (Array.isArray(data.players)) {
                setPlayers(data.players);
            }
            addGameLog(`${data.playerName || 'Player'} đã rời phòng`, 'info');
        });

        // Game events - Match với backend GameManager
        newSocket.on('countdown_started', (data) => {
            console.log('⏳ Countdown started received from server:', data);
            setGameState('countdown'); // Thêm state mới này
            setCountdown(3);
            addGameLog('⏳ Trò chơi sắp bắt đầu...', 'info');
        });

        newSocket.on('game_started', (data) => {
            console.log('🎮 Game started:', data);
            setGameState('playing');
            setTotalQuestions(data.totalQuestions || data.quiz?.questions?.length || 0);
            setCurrentQuestionIndex(0);
            setCountdown(null); // Reset countdown khi game bắt đầu
            addGameLog('🎮 Trò chơi đã bắt đầu!', 'success');
        });

        // ✅ Match với backend event 'new_question'
        newSocket.on('new_question', (data) => {
            console.log('❓ New question received:', data);
            setCurrentQuestion({
                questionIndex: data.questionIndex,
                totalQuestions: data.totalQuestions,
                question: data.question,
                timeLimit: data.timeLimit,
                startTime: data.startTime,
                image: data.question.imageUrl,
            });
            setSelectedAnswer(null);
            setQuestionTimer(data.timeLimit || 25);
            setCurrentQuestionIndex(data.questionIndex);
            setCorrectAnswerIndex(null);
            addGameLog(`❓ Câu hỏi ${data.questionIndex + 1}/${data.totalQuestions}`, 'info');

            // Start countdown timer
            startQuestionTimer(data.timeLimit || 25);
        });

        // ✅ Match với backend event 'answer_submitted'
        newSocket.on('answer_submitted', (data) => {
            console.log('📝 Answer submitted:', data);
            if (data.success) {
                addGameLog(' Đã gửi câu trả lời thành công', 'success');
            }
        });

        // ✅ Match với backend event 'question_results'
        newSocket.on('question_results', (data) => {
            console.log('📊 Question results:', data);
            setLeaderboard(data.leaderboard || []);

            // Update player score
            const playerResult = data.playerResults?.find((p) => p.userId === user._id);
            if (playerResult) {
                setPlayerScore((prev) => prev + playerResult.points);
                addGameLog(`🎯 Điểm câu này: +${playerResult.points}`, 'success');
            }

            console.log('Correct Answer Index from server:', data.correctAnswer); // ADDED FOR DEBUGGING
            setCorrectAnswerIndex(data.correctAnswer); // server cần trả về correctAnswerIndex
            addGameLog('📊 Kết quả câu hỏi', 'info');

            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Add 4-second delay to show results before clearing for next question
            setTimeout(() => {
                setCurrentQuestion(null); // Clear current question to prepare for next
                setCorrectAnswerIndex(null); // Hide correct answer highlight
                setSelectedAnswer(null); // Clear selected answer
            }, 4000); // 4 giây delay để hiển thị đáp án
        });

        // ✅ Match với backend event 'game_finished'
        newSocket.on('game_finished', (data) => {
            console.log('🏁 Game finished:', data);
            setGameState('finished');
            setLeaderboard(data.leaderboard || []);
            addGameLog(' Trò chơi kết thúc!', 'success');
        });

        // Error events
        newSocket.on('error', (data) => {
            console.error('❌ Socket error:', data);
            addGameLog(`❌ Lỗi: ${data.message}`, 'error');
        });

        newSocket.on('auth_error', (data) => {
            console.error('❌ Auth error:', data);
            addGameLog(`❌ Lỗi xác thực: ${data.message}`, 'error');
        });

        setSocket(newSocket);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            newSocket.disconnect();
        };
    }, [roomCode, user._id, onBackToLobby]);

    // Hiệu ứng countdown, khi countdown > 0 thì giảm dần, khi countdown = 0 thì gửi start_game
    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (countdown === 0) {
            // When the host's countdown finishes, they tell the server to start the game for everyone.
            const startGameTimer = setTimeout(() => {
                if (socket && isHost && roomId) {
                    console.log('Countdown finished, telling server to start game.');
                    socket.emit('start_game', {
                        roomId,
                        quizId,
                    });
                    addGameLog('🎮 Bắt đầu trò chơi...', 'info');
                }
                setCountdown(null);
            }, 1500); // Wait 1.5s on "GO!" before starting

            return () => clearTimeout(startGameTimer);
        }
    }, [countdown, socket, isHost, roomId, quizId]); // Added quizId to dependencies

    // Helper functions
    const addGameLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setGameLogs((prev) => [...prev, { timestamp, message, type }]);
    };

    // Thêm state để quản lý hiển thị kết quả
    const [showingResults, setShowingResults] = useState(false);

    const startQuestionTimer = (duration) => {
        setQuestionTimer(duration);
        setShowingResults(false);

        timerRef.current = setInterval(() => {
            setQuestionTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);

                    // Delay 1s trước khi hiển thị kết quả
                    setTimeout(() => {
                        if (socket) {
                            socket.emit('time_up', { roomId });
                        }
                        setShowingResults(true);

                        // Delay 4s để hiển thị kết quả trước khi chuyển câu hỏi
                        setTimeout(() => {
                            setShowingResults(false);
                            if (socket && isHost) {
                                socket.emit('next_question', { roomId });
                            }
                        }, 4000);
                    }, 1000);

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleStartGame = () => {
        if (isHost) {
            // Don't emit anything yet. Just start the countdown locally for the host.
            setGameState('countdown');
            setCountdown(3);
            addGameLog('⏳ Trò chơi sẽ bắt đầu sau vài giây...', 'info');
        } else {
            console.error('Only the host can start the game.');
        }
    };

    const handleSubmitAnswer = (answerIndex) => {
        if (socket && currentQuestion && selectedAnswer === null) {
            const responseTime = (currentQuestion.timeLimit || 25) - questionTimer;

            // ✅ Match với backend data structure
            socket.emit('submit_answer', {
                roomId,
                questionIndex: currentQuestion.questionIndex,
                selectedAnswer: answerIndex,
                responseTime: responseTime * 1000, // Convert to milliseconds
            });
            setSelectedAnswer(answerIndex);
        }
    };

    const handleLeaveRoom = () => {
        if (socket) {
            socket.emit('leave_room', { roomCode });
        }
        onBackToLobby();
    };

    // Render functions
    const renderWaitingRoom = () => (
        <div className="waiting-room">
            {countdown !== null ? (
                <div className="countdown-effect">
                    <h1 style={{ fontSize: '4rem', color: '#ffe066', margin: '40px 0' }}>
                        {countdown === 0 ? 'Go!' : countdown}
                    </h1>
                </div>
            ) : (
                <>
                    <h2>⏳ Đang chờ người chơi...</h2>
                    <div className="room-info">
                        <p>
                            <strong>Room Code:</strong> <span className="room-code">{roomCode}</span>
                        </p>
                        <p>
                            <strong>Quiz:</strong> {currentQuestion?.quizTitle || 'Loading...'}
                        </p>
                        <p>
                            <strong>Players:</strong> {players.length}
                        </p>
                    </div>

                    <div className="players-list">
                        <h3>👥 Người chơi trong phòng:</h3>
                        {players.map((player, index) => (
                            <div key={index} className="player-item">
                                <span className="player-name">{resolvePlayerName(player)}</span>
                                {player.isHost && <span className="host-badge">👑</span>}
                            </div>
                        ))}
                    </div>

                    {isHost && (
                        <button
                            className="start-game-btn"
                            onClick={handleStartGame}
                            // ✅ Sửa: Bỏ disabled condition
                            // disabled={players.length < 2}
                        >
                            🎮 Bắt đầu trò chơi
                        </button>
                    )}
                </>
            )}
        </div>
    );

    const renderGameQuestion = () => (
        <div className="quiz-container">
            <div className="header-quiz">
                <div className="header-info">
                    <div>
                        Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
                    </div>
                    <div>Điểm: {playerScore}</div>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>
            <div className="question-section">
                <div className="question-text">{currentQuestion?.question?.text}</div>
            </div>
            <div className="timer-bar-wrapper">
                <div className="timer-bar-bg">
                    <div
                        className="timer-bar-fill"
                        style={{
                            width: `${(questionTimer / (currentQuestion?.timeLimit || 25)) * 100}%`,
                            transition: 'width 1s linear',
                        }}
                    ></div>
                    <span className="timer-bar-text">{questionTimer}s</span>
                </div>
            </div>
            {currentQuestion?.question?.imageUrl && (
                <div className="question-image-container">
                    {' '}
                    <img
                        src={currentQuestion.question.imageUrl}
                        alt="Question"
                        className="question-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('Failed to load image:', currentQuestion.question.imageUrl); // Thêm log lỗi
                        }}
                    />
                </div>
            )}
            <div className="answer-section">
                {currentQuestion?.question?.options?.map((option, index) => {
                    let className = `answer-button answer-color-${index}`;
                    if (showingResults && correctAnswerIndex !== null) {
                        if (index === correctAnswerIndex) {
                            className += ' correct';
                        } else {
                            className += ' wrong';
                        }
                    } else if (selectedAnswer === index) {
                        className += ' selected';
                    }

                    return (
                        <button
                            key={index}
                            className={className}
                            onClick={() => handleSubmitAnswer(index)}
                            disabled={selectedAnswer !== null || showingResults || isHost}
                        >
                            <span>
                                {String.fromCharCode(65 + index)}. {option}
                            </span>
                        </button>
                    );
                })}
            </div>
            {selectedAnswer !== null && (
                <div className="answer-status">
                    <p>⏳ Đang chờ kết quả...</p>
                </div>
            )}
        </div>
    );

    const renderLeaderboard = () => (
        <div className="leaderboard">
            <h3>🏆 Bảng xếp hạng</h3>
            {leaderboard.map((player, index) => (
                <div key={index} className="leaderboard-item">
                    <span className="rank">{index + 1}</span>
                    <span className="player-name">
                        {playerNames[player.userId] || player.name || `Player ${player.userId?.substring(0, 8)}...`}
                    </span>
                    <span className="score">{player.totalScore} pts</span>
                </div>
            ))}
        </div>
    );

    const renderGameFinished = () => (
        <div className="quiz-container">
            <div className="summary-card">
                <h2>🏁 Trò chơi kết thúc!</h2>
                <h3>🎯 Điểm của bạn: {playerScore}</h3>
                <p>Tổng câu hỏi: {totalQuestions}</p>
                <p>Trung bình: {(playerScore / totalQuestions).toFixed(1)} điểm/câu</p>
            </div>
            <div className="leaderboard-container">
                <h2>Bảng Xếp Hạng</h2>
                <div className="leaderboard-scroll-area">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Hạng</th>
                                <th>Tên</th>
                                <th>Điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((player, index) => (
                                <tr key={index} className={index < 5 ? 'top-rank' : ''}>
                                    <td className="rank">{index + 1}</td>
                                    <td>
                                        {playerNames[player.userId] ||
                                            player.name ||
                                            `Player ${player.userId?.substring(0, 8)}...`}
                                    </td>
                                    <td>{player.totalScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="final-actions">
                <button className="play-again-btn" onClick={() => window.location.reload()}>
                    🔄 Chơi lại
                </button>
                <button className="back-to-lobby-btn" onClick={handleLeaveRoom}>
                    🏠 Về Lobby
                </button>
            </div>
        </div>
    );

    // Main render
    if (!connected) {
        return (
            <div className="game-room">
                <div className="connection-status">
                    <h2> Đang kết nối...</h2>
                    <p>Vui lòng chờ kết nối với server</p>
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="game-room">
                <div className="auth-status">
                    <h2> Đang xác thực...</h2>
                    <p>Vui lòng chờ xác thực</p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-room">
            <div className="game-header">
                <h1>🎮 Game Room: {roomCode}</h1>
                <div className="connection-info">
                    <span className={`status ${connected ? 'connected' : 'disconnected'}`}>
                        {connected ? '🟢 Online' : '🔴 Offline'}
                    </span>
                    <button className="leave-room-btn" onClick={handleLeaveRoom}>
                        🚪 Rời phòng
                    </button>
                </div>
            </div>

            <div className="game-content">
                {gameState === 'waiting' && renderWaitingRoom()}
                {gameState === 'countdown' && ( // Thêm render cho state countdown
                    <div className="countdown-screen">
                        <div className="countdown-effect">
                            <h1 className="countdown-number">{countdown === 0 ? 'GO!' : countdown}</h1>
                        </div>
                    </div>
                )}
                {gameState === 'playing' && renderGameQuestion()}
                {gameState === 'finished' && renderGameFinished()}
            </div>

            <div className="game-sidebar">
                <div className="players-panel">
                    <h3>👥 Người chơi ({players.length})</h3>
                    {players.map((player, index) => (
                        <div key={index} className="player-item">
                            <span className="player-name">{resolvePlayerName(player)}</span>
                            {player.isHost && <span className="host-badge">👑</span>}
                        </div>
                    ))}
                </div>

                {gameState === 'playing' && (
                    <div className="current-score">
                        <h3>🎯 Điểm hiện tại</h3>
                        <div className="score-display">
                            <span className="score-value">{playerScore}</span>
                            <span className="score-label">điểm</span>
                        </div>
                    </div>
                )}

                {gameState === 'playing' && renderLeaderboard()}

                <div className="game-logs">
                    <h3>📝 Game Logs</h3>
                    <div className="logs-container">
                        {gameLogs.slice(-10).map((log, index) => (
                            <div key={index} className={`log-entry ${log.type}`}>
                                <span className="log-time">{log.timestamp}</span>
                                <span className="log-message">{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameRoom;
