import React, { useState, useEffect } from 'react';
import './Lobby.css';

const Lobby = ({ onStartQuiz, isAuthenticated, user }) => {
    const [name, setName] = useState('');
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [roomPassword, setRoomPassword] = useState('');

    // API Configuration
    const API_BASE = 'http://localhost:3000/api/v1';

    // Load available quizzes when component mounts
    useEffect(() => {
        if (isAuthenticated) {
            loadAvailableQuizzes();
        }
    }, [isAuthenticated]);

    // Load available rooms when quiz is selected
    useEffect(() => {
        if (selectedQuiz) {
            loadAvailableRooms(selectedQuiz._id);
        }
    }, [selectedQuiz]);

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

    // Load available rooms for a specific quiz
    const loadAvailableRooms = async (quizId) => {
        try {
            const token = localStorage.getItem('quiz_token');
            console.log('🔑 Token for loading rooms:', token ? 'Token exists' : 'No token');
            
            const response = await fetch(`${API_BASE}/room/quiz/${quizId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', response.headers);
            
            const data = await response.json();
            console.log('📥 Available rooms response:', data);
            
            if (data.success) {
                setAvailableRooms(data.data || []);
                console.log('📥 Available rooms for quiz:', data.data);
            } else {
                console.log('❌ Failed to load rooms:', data.message);
                setAvailableRooms([]);
            }
        } catch (error) {
            console.error('❌ Error loading rooms:', error);
            setAvailableRooms([]);
        }
    };

    const handleStart = () => {
        if (name.trim() === '') {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }
        onStartQuiz(name);
    };

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
                name: roomName,
                quizId: selectedQuiz._id,
                maxPlayers: maxPlayers,
                password: roomPassword || undefined,
                createdBy: user._id
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
                alert('✅ Phòng đã được tạo thành công!');
                setShowCreateRoom(false);
                setRoomName('');
                setMaxPlayers(4);
                setRoomPassword('');
                setSelectedQuiz(null);
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

    const handleJoinRoom = async (roomId) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('quiz_token');
            
            const joinData = {
                roomId: roomId,
                password: ''
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
                // TODO: Navigate to game room
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
                                            <span className="category">{quiz.category}</span>
                                            <span className="difficulty">{quiz.difficulty}</span>
                                            <span className="questions">{quiz.questions?.length || 0} câu hỏi</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-quizzes">
                                <p>Chưa có quiz nào. Hãy tạo quiz trước!</p>
                                <button 
                                    className="create-quiz-btn"
                                    onClick={() => window.location.href = '#create'}
                                >
                                    🎯 Tạo Quiz
                                </button>
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
                            
                            {/* Available Rooms */}
                            <div className="available-rooms">
                                <h3>🚪 Phòng có sẵn</h3>
                                {availableRooms.length > 0 ? (
                                    <div className="room-grid">
                                        {availableRooms.map((room) => (
                                            <div key={room._id} className="room-card">
                                                <h4>{room.name || `Phòng ${room.roomCode}`}</h4>
                                                <div className="room-meta">
                                                    <span className="players">{room.players?.length || 0}/{room.settings?.maxPlayers || 4} người chơi</span>
                                                    <span className="status">{room.status}</span>
                                                </div>
                                                <button 
                                                    className="join-room-btn"
                                                    onClick={() => handleJoinRoom(room._id)}
                                                >
                                                    🚪 Tham Gia
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-rooms">
                                        <p>Chưa có phòng nào cho quiz này.</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="action-buttons">
                                <button 
                                    className="create-room-btn"
                                    onClick={() => setShowCreateRoom(true)}
                                >
                                    🏠 Tạo Phòng Mới
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
                                    
                                    <div className="form-group">
                                        <label>Mật khẩu phòng (tùy chọn)</label>
                                        <input
                                            type="password"
                                            value={roomPassword}
                                            onChange={(e) => setRoomPassword(e.target.value)}
                                            placeholder="Để trống nếu không cần mật khẩu"
                                        />
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
                                        onClick={() => setShowCreateRoom(false)}
                                    >
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
