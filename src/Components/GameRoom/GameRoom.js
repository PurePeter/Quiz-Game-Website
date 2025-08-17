import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './GameRoom.css';

const GameRoom = ({ roomCode, quizId, user, onBackToLobby }) => {
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
    
    const socketRef = useRef();
    const timerRef = useRef();

    // Initialize Socket.IO connection
    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        socketRef.current = newSocket;

        // Connection events
        newSocket.on('connect', () => {
            console.log('✅ Connected to Socket.IO server');
            setConnected(true);
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
            newSocket.emit('join_room', { roomCode });
        });

        // Room events - Match với backend events
        newSocket.on('room_created', (res) => {
            alert(`✅ Phòng đã được tạo thành công! Room Code: ${res.data.roomCode}`);
            onBackToLobby();
        });

        newSocket.on('room_joined', (res) => {
            setRoomId(res.data?.roomId || '');
            const incoming = Array.isArray(res.data?.players) ? res.data.players : [];
            const normalized = incoming.length > 0 
                ? incoming 
                : [{ id: user?._id || 'me', name: `Player ${(user?._id || 'me').substring(0,8)}...`, isHost: !!res.data?.isHost }];
            setPlayers(normalized);
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
            addGameLog(`${data.playerName || 'Player'} đã rời phòng`, 'info');
        });

        // Game events - Match với backend GameManager
        newSocket.on('game_started', (data) => {
            console.log('🎮 Game started:', data);
            setGameState('playing');
            setTotalQuestions(data.quiz?.questions?.length || 0);
            setCurrentQuestionIndex(0);
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
                startTime: data.startTime
            });
            setSelectedAnswer(null);
            setQuestionTimer(data.timeLimit || 25);
            setCurrentQuestionIndex(data.questionIndex);
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
            const playerResult = data.playerResults?.find(p => p.userId === user._id);
            if (playerResult) {
                setPlayerScore(prev => prev + playerResult.points);
                addGameLog(`🎯 Điểm câu này: +${playerResult.points}`, 'success');
            }
            
            addGameLog('📊 Kết quả câu hỏi', 'info');
            
            // Clear timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
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
    }, [roomCode, user._id]);

    // Helper functions
    const addGameLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setGameLogs(prev => [...prev, { timestamp, message, type }]);
    };

    const startQuestionTimer = (duration) => {
        setQuestionTimer(duration);
        timerRef.current = setInterval(() => {
            setQuestionTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleStartGame = () => {
        if (socket && isHost && roomId) {
            // ✅ Match với backend data structure
            socket.emit('start_game', { roomId });
            addGameLog('🎮 Bắt đầu trò chơi...', 'info');
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
                responseTime: responseTime * 1000 // Convert to milliseconds
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
            <h2>⏳ Đang chờ người chơi...</h2>
            <div className="room-info">
                <p><strong>Room Code:</strong> <span className="room-code">{roomCode}</span></p>
                <p><strong>Quiz:</strong> {currentQuestion?.quizTitle || 'Loading...'}</p>
                <p><strong>Players:</strong> {players.length}</p>
            </div>
            
            <div className="players-list">
                <h3>👥 Người chơi trong phòng:</h3>
                {players.map((player, index) => (
                    <div key={index} className="player-item">
                        <span className="player-name">{player.name}</span>
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
        </div>
    );

    const renderGameQuestion = () => (
        <div className="game-question">
            <div className="question-header">
                <h2>❓ Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}</h2>
                <div className="timer">⏱️ {questionTimer}s</div>
            </div>

            <div className="question-content">
                <p className="question-text">{currentQuestion?.question?.text}</p>
                
                {currentQuestion?.question?.imageUrl && (
                    <img 
                        src={currentQuestion.question.imageUrl} 
                        alt="Question" 
                        className="question-image"
                    />
                )}
            </div>

            <div className="answer-options">
                {currentQuestion?.question?.options?.map((option, index) => (
                    <button
                        key={index}
                        className={`answer-option ${
                            selectedAnswer === index ? 'selected' : ''
                        }`}
                        onClick={() => handleSubmitAnswer(index)}
                        disabled={selectedAnswer !== null || isHost}
                    >
                        {String.fromCharCode(65 + index)}. {option}
                    </button>
                ))}
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
                    <span className="player-name">{player.name || `Player ${player.userId.substring(0, 8)}...`}</span>
                    <span className="score">{player.totalScore} pts</span>
                </div>
            ))}
        </div>
    );

    const renderGameFinished = () => (
        <div className="game-finished">
            <h2>🏁 Trò chơi kết thúc!</h2>
            
            <div className="final-score">
                <h3>🎯 Điểm của bạn: {playerScore}</h3>
                <p>Tổng câu hỏi: {totalQuestions}</p>
                <p>Trung bình: {(playerScore / totalQuestions).toFixed(1)} điểm/câu</p>
            </div>
            
            <div className="final-results">
                {renderLeaderboard()}
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
                {gameState === 'playing' && renderGameQuestion()}
                {gameState === 'finished' && renderGameFinished()}
            </div>

            <div className="game-sidebar">
                <div className="players-panel">
                    <h3>👥 Người chơi ({players.length})</h3>
                    {players.map((player, index) => (
                        <div key={index} className="player-item">
                            <span className="player-name">{player.name}</span>
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
