import React, { useEffect, useState } from 'react';
import './EndGame.css';

const EndGame = ({ score, totalQuestions, onRestart }) => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        // Dữ liệu giả cho những người chơi khác
        const otherPlayers = [
            { name: 'Player A', score: 1350 },
            { name: 'Player B', score: 1180 },
            { name: 'Player C', score: 1050 },
            { name: 'Player D', score: 900 },
            { name: 'Player E', score: 850 },
            { name: 'Player F', score: 720 },
            { name: 'Player G', score: 610 },
            { name: 'Player H', score: 550 },
            { name: 'Player I', score: 480 },
            { name: 'Player J', score: 420 },
            { name: 'Player K', score: 300 },
            { name: 'Player L', score: 210 },
        ];

        // Thêm người chơi hiện tại vào danh sách
        const currentPlayer = { name: 'Bạn', score: score, isCurrentUser: true };
        const fullLeaderboard = [...otherPlayers, currentPlayer].sort((a, b) => b.score - a.score);

        setLeaderboard(fullLeaderboard);
    }, [score]);

    const getMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    return (
        <div className="end-game-container">
            <div className="summary-card">
                <h2>Chúc mừng bạn đã hoàn thành {totalQuestions} câu!</h2>
                <h3>Điểm của bạn: {score} điểm</h3>
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
                            {leaderboard.map((player, index) => {
                                const rank = index + 1;
                                const rowClasses = [];
                                if (rank <= 5) {
                                    rowClasses.push('top-rank');
                                }
                                if (player.isCurrentUser) {
                                    rowClasses.push('current-player');
                                }
                                return (
                                    <tr key={index} className={rowClasses.join(' ')}>
                                        <td className="rank">{getMedal(rank)}</td>
                                        <td>{player.name}</td>
                                        <td>{player.score}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className="restart-button" onClick={onRestart}>
                Chơi lại
            </button>
        </div>
    );
};

export default EndGame;
