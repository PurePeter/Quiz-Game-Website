import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Lobby.css';

const Lobby = ({ onStartQuiz, isAuthenticated, user, onEnterGameRoom }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [showJoinRoom, setShowJoinRoom] = useState(false); // ✅ Thêm state cho join room
    const [roomName, setRoomName] = useState('');
    const [roomCode, setRoomCode] = useState(''); // ✅ Thêm state cho room code
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [playerName, setPlayerName] = useState('');
    
    const socketRef = useRef();

    // API Configuration
    const API_BASE = 'http://localhost:3000/api/v1';

    // Initialize Socket.IO connection
    useEffect(() => {
        if (isAuthenticated) {
            const newSocket = io('http://localhost:3000');
            socketRef.current = newSocket;

            // Connection events
            newSocket.on('connect', () => {
                console.log('✅ Connected to Socket.IO server');
                setConnected(true);
                
                // Authenticate with JWT token
                const token = localStorage.getItem('quiz_token');
                if (token) {
                    newSocket.emit('authenticate', { token });
                }
            });

            // Authentication events
            newSocket.on('authenticated', (data) => {
                console.log('✅ Authenticated successfully:', data);
                setAuthenticated(true);
            });

            // Room events
            newSocket.on('room_created', (data) => {
                console.log('🏠 Room created:', data);
                setCurrentRoom(data);
                alert(`✅ Phòng đã được tạo thành công! Room Code: ${data.data.roomCode}`);
                setShowCreateRoom(false);
                
                // Navigate to game room
                if (onEnterGameRoom) {
                    onEnterGameRoom(data.data.roomCode, selectedQuiz._id);
                }
            });

            newSocket.on('room_joined', (data) => {
                console.log('🏠 Room joined:', data);
                setCurrentRoom(data);
                alert('✅ Đã tham gia phòng thành công!');
                setShowJoinRoom(false);
                
                // Navigate to game room
                if (onEnterGameRoom) {
                    onEnterGameRoom(data.data.roomCode, selectedQuiz._id);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isAuthenticated, selectedQuiz, onEnterGameRoom]);

    // Load available quizzes from backend
    const loadAvailableQuizzes = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/quiz/all`);
            const data = await response.json();
            
            if (data.success) {
                setAvailableQuizzes(data.data || []);
                console.log('📥 Available quizzes:', data.data);
            } else {
                console.log('❌ Failed to load quizzes:', data.message);
            }
        } catch (error) {
            console.error('❌ Error loading quizzes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load quizzes when authenticated
    useEffect(() => {
        if (authenticated) {
            loadAvailableQuizzes();
        }
    }, [authenticated]);

    // Create room via HTTP API
    const handleCreateRoom = async () => {
        if (!selectedQuiz) {
            alert('Vui lòng chọn một quiz để tạo phòng!');
            return;
        }
        if (!roomName.trim()) {
            alert('Vui lòng nhập tên phòng!');
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem('quiz_token');
            
            const roomData = {
                quizId: selectedQuiz._id,
                settings: {
                    maxPlayers: maxPlayers || 8,
                    autoStart: false,
                    showLeaderboard: true
                }
            };

            console.log('🚀 Creating room:', roomData);

            const response = await fetch(`${API_BASE}/room/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(roomData)
            });

            const data = await response.json();
            console.log('📥 Create room response:', data);

            if (data.success) {
                alert(`✅ Phòng đã được tạo thành công! Room Code: ${data.data.roomCode}`);
                setShowCreateRoom(false);
                setRoomName('');
                setMaxPlayers(4);
                setSelectedQuiz(null);
                
                // Navigate to game room
                if (onEnterGameRoom) {
                    onEnterGameRoom(data.data.roomCode, selectedQuiz._id);
                }
            } else {
                alert(`❌ Lỗi tạo phòng: ${data.message}`);
            }
        } catch (error) {
            console.error('❌ Error creating room:', error);
            alert('❌ Lỗi kết nối server');
        } finally {
            setIsLoading(false);
        }
    };

    // Join room via HTTP API
    const handleJoinRoom = async () => {
        if (!roomCode.trim()) {
            alert('Vui lòng nhập room code!');
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem('quiz_token');
            
            const joinData = {
                roomCode: roomCode.trim()
            };

            console.log('🚀 Joining room:', joinData);

            const response = await fetch(`${API_BASE}/room/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(joinData)
            });

            const data = await response.json();
            console.log('📥 Join room response:', data);

            if (data.success) {
                alert('✅ Đã tham gia phòng thành công!');
                setShowJoinRoom(false);
                setRoomCode('');
                
                // Navigate to game room
                if (onEnterGameRoom) {
                    onEnterGameRoom(data.data.roomCode, data.data.quizId);
                }
            } else {
                alert(`❌ Lỗi tham gia phòng: ${data.message}`);
            }
        } catch (error) {
            console.error('❌ Error joining room:', error);
            alert('❌ Lỗi kết nối server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStart = () => {
        if (playerName.trim() === '') {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }
        onStartQuiz(playerName);
    };

    return (
        <div className="lobby-container">
            <h1 className="lobby-title">🎮 Quiz Game Lobby</h1>
            <p className="lobby-description">Chọn quiz và tạo phòng để chơi cùng bạn bè!</p>

            {!isAuthenticated ? (
                <div className="auth-required">
                    <div className="auth-icon">🔐</div>
                    <h2>Đăng nhập để chơi Quiz</h2>
                    <p>Vui lòng đăng nhập để sử dụng tính năng tạo phòng và chơi quiz.</p>
                </div>
            ) : (
                <>
                    {/* Quiz Selection */}
                    <div className="quiz-selection">
                        <h2>📚 Chọn Quiz</h2>
                        {isLoading ? (
                            <div className="loading">Đang tải quiz...</div>
                        ) : availableQuizzes.length > 0 ? (
                            <div className="quiz-grid">
                                {availableQuizzes.map((quiz) => (
                                    <div 
                                        key={quiz._id} 
                                        className={`quiz-card ${selectedQuiz?._id === quiz._id ? 'selected' : ''}`}
                                        onClick={() => setSelectedQuiz(quiz)}
                                    >
                                        <h3>{quiz.title}</h3>
                                        <p>{quiz.description}</p>
                                        <div className="quiz-meta">
                                            <span className="questions">{quiz.questions?.length || 0} câu hỏi</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-quizzes">
                                <p>Chưa có quiz nào. Hãy tạo quiz trước!</p>
                            </div>
                        )}
                    </div>

                    {/* Room Actions */}
                    {selectedQuiz && (
                        <div className="room-actions">
                            <h2>🏠 Quản lý Phòng</h2>
                            <div className="selected-quiz">
                                <strong>Quiz đã chọn:</strong> {selectedQuiz.title}
                            </div>
                            
                            <div className="action-buttons">
                                <button 
                                    className="create-room-btn"
                                    onClick={() => setShowCreateRoom(true)}
                                >
                                    🏠 Tạo Phòng Mới
                                </button>
                                
                                <button 
                                    className="join-room-btn"
                                    onClick={() => setShowJoinRoom(true)}
                                >
                                    🚪 Tham Gia Phòng
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Create Room Modal */}
                    {showCreateRoom && (
                        <div className="modal-overlay" onClick={() => setShowCreateRoom(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>🏠 Tạo Phòng Mới</h2>
                                    <button className="modal-close" onClick={() => setShowCreateRoom(false)}>×</button>
                                </div>
                                
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Tên phòng *</label>
                                        <input
                                            type="text"
                                            value={roomName}
                                            onChange={(e) => setRoomName(e.target.value)}
                                            placeholder="Nhập tên phòng..."
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Số người chơi tối đa</label>
                                        <select value={maxPlayers} onChange={(e) => setMaxPlayers(Number(e.target.value))}>
                                            <option value={2}>2 người</option>
                                            <option value={4}>4 người</option>
                                            <option value={6}>6 người</option>
                                            <option value={8}>8 người</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button 
                                        className="submit-btn"
                                        onClick={handleCreateRoom}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang tạo...' : '🏠 Tạo Phòng'}
                                    </button>
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => setShowCreateRoom(false)}>
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Join Room Modal */}
                    {showJoinRoom && (
                        <div className="modal-overlay" onClick={() => setShowJoinRoom(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>🚪 Tham Gia Phòng</h2>
                                    <button className="modal-close" onClick={() => setShowJoinRoom(false)}>×</button>
                                </div>
                                
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Room Code *</label>
                                        <input
                                            type="text"
                                            value={roomCode}
                                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                            placeholder="Nhập room code (ví dụ: 9F4O87)"
                                            required
                                            maxLength={6}
                                            style={{ textTransform: 'uppercase' }}
                                        />
                                        <small>Nhập 6 ký tự room code để tham gia phòng</small>
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button 
                                        className="submit-btn"
                                        onClick={handleJoinRoom}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang tham gia...' : '🚪 Tham Gia Phòng'}
                                    </button>
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => setShowJoinRoom(false)}>
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Start (for testing) */}
                    <div className="quick-start">
                        <h2>⚡ Chơi Nhanh</h2>
                        <p>Hoặc chơi ngay với quiz mẫu</p>
                        <input
                            type="text"
                            className="name-input"
                            placeholder="Tên của bạn..."
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                        />
                        <button className="start-button" onClick={handleStart}>
                            🚀 Bắt đầu ngay
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Lobby;
