import React, { useState, useEffect } from 'react';
import './History.css';

const History = ({ isAuthenticated, user }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with real API call
        const mockHistory = [
            {
                id: 1,
                quizTitle: 'Kiến thức Công nghệ',
                score: 85,
                totalQuestions: 10,
                date: '2024-01-15T10:30:00',
                timeSpent: 450,
            },
            {
                id: 2,
                quizTitle: 'Lịch sử Việt Nam',
                score: 92,
                totalQuestions: 15,
                date: '2024-01-14T14:20:00',
                timeSpent: 720,
            },
            {
                id: 3,
                quizTitle: 'Địa lý Thế giới',
                score: 78,
                totalQuestions: 12,
                date: '2024-01-13T09:15:00',
                timeSpent: 600,
            },
        ];

        setTimeout(() => {
            setHistoryData(mockHistory);
            setLoading(false);
        }, 1000);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="history-container">
                <div className="auth-required">
                    <div className="auth-icon">🔐</div>
                    <h2>Đăng nhập để xem lịch sử</h2>
                    <p>Vui lòng đăng nhập để xem lịch sử chơi quiz của bạn.</p>
                    <button
                        className="login-btn-primary"
                        onClick={() => {
                            const loginBtn = document.querySelector('.login-btn');
                            if (loginBtn) loginBtn.click();
                        }}
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <div className="history-header">
                <h1>📚 Lịch sử chơi Quiz</h1>
                <p>Xem lại các lần chơi quiz của bạn</p>
            </div>

            <div className="history-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Đang tải lịch sử...</p>
                    </div>
                ) : historyData.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>Chưa có lịch sử</h3>
                        <p>Bạn chưa có lịch sử chơi quiz nào. Hãy bắt đầu chơi ngay!</p>
                    </div>
                ) : (
                    <div className="history-items">
                        {historyData.map((item, index) => (
                            <div key={item.id} className="history-item">
                                <div className="history-item-header">
                                    <h4>{item.quizTitle}</h4>
                                    <div className="history-score">{item.score}%</div>
                                </div>
                                <div className="history-item-details">
                                    <div className="detail-item">
                                        <span>Ngày chơi:</span>
                                        <span>{formatDate(item.date)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Số câu hỏi:</span>
                                        <span>{item.totalQuestions}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Thời gian:</span>
                                        <span>
                                            {Math.floor(item.timeSpent / 60)}:
                                            {String(item.timeSpent % 60).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
