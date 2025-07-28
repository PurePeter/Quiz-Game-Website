import React from 'react';
import './Lobby.css';

const Lobby = ({ onStartQuiz }) => {
    return (
        <div className="lobby-container">
            <h1 className="lobby-title">Chào mừng đến với Quiz Game!</h1>
            <p className="lobby-description">Hãy kiểm tra kiến thức của bạn với những câu hỏi thú vị.</p>
            <button className="start-quiz-button" onClick={onStartQuiz}>
                Bắt đầu
            </button>
        </div>
    );
};

export default Lobby;
