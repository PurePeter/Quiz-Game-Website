import React, { useState, useEffect } from 'react';
import Quiz from '~/Components/Quiz/Quiz.js';
import Lobby from '~/Components/Lobby/Lobby';
import CountDown from '~/Components/CountDown/CountDown.js';
import EndGame from '~/Components/EndGame/EndGame.js';

import '~/App.css';

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

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [playerName, setPlayerName] = useState('');

    useEffect(() => {
        setQuestions(mockQuestions);
    }, []);

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
        setPlayerName(name || 'Guest');
        setShowScore(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsCountingDown(true);
    };

    const handleCountdownFinish = () => {
        setIsCountingDown(false);
        setIsQuizStarted(true);
    };

    return (
        <div className="App">
            {isCountingDown ? (
                <CountDown initialCount={3} onFinish={handleCountdownFinish} />
            ) : !isQuizStarted ? (
                <Lobby onStartQuiz={startQuiz} />
            ) : showScore ? (
                <EndGame
                    score={score}
                    totalQuestions={questions.length}
                    onRestart={restartQuiz}
                    playerName={playerName}
                />
            ) : (
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
            )}
        </div>
    );
}

export default App;
