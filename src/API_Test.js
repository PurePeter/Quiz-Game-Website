import React, { useState, useEffect } from 'react';
import './API_Test.css';

const API_Test = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = 'http://localhost:3000/api/v1';

  // Test Authentication
  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'Test123!@#'
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Đăng ký thành công!');
        setUser(data.user);
      } else {
        setMessage(`❌ Đăng ký thất bại: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123456'
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Đăng nhập thành công!');
        setToken(data.token);
        setUser(data.user);
      } else {
        setMessage(`❌ Đăng nhập thất bại: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  // Test Quiz Creation
  const testCreateQuiz = async () => {
    if (!token) {
      setMessage('❌ Vui lòng đăng nhập trước!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/quiz/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Quiz Test',
          description: 'Quiz để test API',
          questions: [
            {
              text: 'Thủ đô Việt Nam là gì?',
              options: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Huế'],
              correctAnswer: 0
            },
            {
              text: '1 + 1 = ?',
              options: ['1', '2', '3', '4'],
              correctAnswer: 1
            }
          ],
          timePerQuestion: 30,
          scoring: {
            basePoints: 100,
            timeBonus: true,
            maxTimeBonus: 50,
            penaltyForWrong: false,
            wrongAnswerPenalty: 0
          }
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Tạo quiz thành công!');
        fetchQuizzes();
      } else {
        setMessage(`❌ Tạo quiz thất bại: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  // Fetch Quizzes
  const fetchQuizzes = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE}/quiz/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách quiz:', error);
    }
  };

  // Test Room Creation
  const testCreateRoom = async () => {
    if (!token || quizzes.length === 0) {
      setMessage('❌ Vui lòng đăng nhập và tạo quiz trước!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/room/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: quizzes[0]._id,
          settings: {
            maxPlayers: 10,
            autoStart: false,
            showLeaderboard: true
          }
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Tạo phòng thành công!');
        setRooms([...rooms, data.room]);
      } else {
        setMessage(`❌ Tạo phòng thất bại: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message}`);
    }
    setLoading(false);
  };

  // Test API Status
  const testAPIStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/');
      if (response.ok) {
        const data = await response.text();
        setMessage(`✅ API hoạt động: ${data}`);
      } else {
        setMessage('❌ API không hoạt động');
      }
    } catch (error) {
      setMessage(`❌ Không thể kết nối API: ${error.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchQuizzes();
    }
  }, [token]);

  return (
    <div className="api-test">
      <h1>🧪 Quiz Game API Test</h1>
      
      <div className="status-section">
        <h2>📊 Trạng thái</h2>
        <button onClick={testAPIStatus} disabled={loading}>
          {loading ? '⏳ Đang kiểm tra...' : '🔍 Kiểm tra API Status'}
        </button>
        <div className="message">{message}</div>
      </div>

      <div className="auth-section">
        <h2>🔐 Authentication</h2>
        <div className="button-group">
          <button onClick={testRegister} disabled={loading}>
            {loading ? '⏳ Đang xử lý...' : '📝 Đăng ký'}
          </button>
          <button onClick={testLogin} disabled={loading}>
            {loading ? '⏳ Đang xử lý...' : '🔑 Đăng nhập'}
          </button>
        </div>
        {user && (
          <div className="user-info">
            <p>👤 Người dùng: {user.name}</p>
            <p>📧 Email: {user.email}</p>
            <p>🆔 ID: {user._id}</p>
          </div>
        )}
      </div>

      <div className="quiz-section">
        <h2>🎯 Quiz Management</h2>
        <button onClick={testCreateQuiz} disabled={loading || !token}>
          {loading ? '⏳ Đang tạo...' : '➕ Tạo Quiz Test'}
        </button>
        
        {quizzes.length > 0 && (
          <div className="quizzes-list">
            <h3>📚 Danh sách Quiz:</h3>
            {quizzes.map((quiz, index) => (
              <div key={quiz._id || index} className="quiz-item">
                <h4>{quiz.title}</h4>
                <p>{quiz.description}</p>
                <p>📝 Số câu hỏi: {quiz.questions?.length || 0}</p>
                <p>⏱️ Thời gian mỗi câu: {quiz.timePerQuestion}s</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="room-section">
        <h2>🏠 Room Management</h2>
        <button onClick={testCreateRoom} disabled={loading || !token || quizzes.length === 0}>
          {loading ? '⏳ Đang tạo...' : '🚪 Tạo Phòng'}
        </button>
        
        {rooms.length > 0 && (
          <div className="rooms-list">
            <h3>🏘️ Danh sách Phòng:</h3>
            {rooms.map((room, index) => (
              <div key={room._id || index} className="room-item">
                <h4>Phòng: {room.roomCode}</h4>
                <p>🎯 Quiz: {room.quizId}</p>
                <p>👥 Số người chơi tối đa: {room.settings?.maxPlayers}</p>
                <p>📊 Hiển thị bảng xếp hạng: {room.settings?.showLeaderboard ? 'Có' : 'Không'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="info-section">
        <h2>ℹ️ Thông tin</h2>
        <p>🌐 API Base URL: {API_BASE}</p>
        <p>📚 Swagger Docs: <a href="http://localhost:3000/api-ui" target="_blank" rel="noopener noreferrer">http://localhost:3000/api-ui</a></p>
        <p>🔌 Socket.IO: ws://localhost:3000</p>
      </div>
    </div>
  );
};

export default API_Test; 