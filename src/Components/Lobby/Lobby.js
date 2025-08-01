import React, { useState } from 'react';
import './Lobby.css';

const Lobby = ({ onStartQuiz }) => {
    const [name, setName] = useState('');

    const handleStart = () => {
        if (name.trim() === '') {
            alert('Vui lòng nhập tên của bạn!');
            return;
        }
        onStartQuiz(name);
    };
    return (
        <div className="lobby-container">
            <h1 className="lobby-title">Chào mừng đến với Quiz Game!</h1>
            <p className="lobby-description">Hãy kiểm tra kiến thức của bạn với những câu hỏi thú vị.</p>
            <p className="lobby-title-input-name">Nhập tên của bạn để bắt đầu</p>
            <input
                type="text"
                className="name-input"
                placeholder="Tên của bạn..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            />
            <button className="start-button" onClick={handleStart}>
                Bắt đầu
            </button>
        </div>
    );
};

export default Lobby;
