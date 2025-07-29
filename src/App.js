import React, { useState, useEffect } from 'react';
import Quiz from '~/Components/Quiz/Quiz.js';
import Lobby from '~/Components/Lobby/Lobby';
import CountDown from '~/Components/CountDown/CountDown.js';

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
    const [bonusScore, setBonusScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);

    useEffect(() => {
        setQuestions(mockQuestions);
    }, []);

    const handleAnswer = (isCorrect, timeLeft) => {
        if (isCorrect) {
            setScore((prev) => prev + 1);
            setBonusScore((prev) => prev + timeLeft);
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
        setBonusScore(0);
        setShowScore(false);
        setIsQuizStarted(false);
        setIsCountingDown(false);
    };

    const startQuiz = () => {
        setShowScore(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setBonusScore(0);
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
                <div className="score-section">
                    <h2>
                        Bạn đã trả lời đúng {score} trên {questions.length} câu!
                    </h2>
                    <h3>Điểm thưởng thời gian: {bonusScore}</h3>
                    <button onClick={restartQuiz}>Chơi lại</button>
                </div>
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
