import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Quiz.css';
import Chart from '../Chart/Chart';

const Quiz = ({ questionData, currentQuestionIndex, totalQuestions, score, onAnswer, onNext }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [timer, setTimer] = useState(15);
    const [showChart, setShowChart] = useState(false);
    const [chartData, setChartData] = useState([5, 8, 2, 10]);
    const [answerTime, setAnswerTime] = useState(0);
    const timeRef = useRef(null);
    const nextQuestionTimeoutRef = useRef(null);
    const shapes = ['triangle', 'square', 'circle', 'star'];

    const processAndRevealAnswer = useCallback(() => {
        setIsAnswerRevealed(true);

        const correctIndex = questionData.answerOptions.findIndex((a) => a.isCorrect);
        const isCorrect = selectedAnswer !== null && selectedAnswer === correctIndex;

        const finalScore = isCorrect ? 100 + answerTime * 13 : 0;
        onAnswer(isCorrect, finalScore);

        // Show chart
        setShowChart(true);
        setChartData([
            Math.floor(Math.random() * 10) + 1,
            Math.floor(Math.random() * 10) + 1,
            Math.floor(Math.random() * 10) + 1,
            Math.floor(Math.random() * 10) + 1,
        ]);

        nextQuestionTimeoutRef.current = setTimeout(() => {
            onNext();
        }, 4000);
    }, [questionData, selectedAnswer, answerTime, onAnswer, onNext]);

    useEffect(() => {
        if (nextQuestionTimeoutRef.current) clearTimeout(nextQuestionTimeoutRef.current);
        if (timeRef.current) clearInterval(timeRef.current);

        setTimer(15);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
        setShowChart(false);
        setAnswerTime(0);

        timeRef.current = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            clearInterval(timeRef.current);
            if (nextQuestionTimeoutRef.current) clearTimeout(nextQuestionTimeoutRef.current);
        };
    }, [questionData]);

    useEffect(() => {
        if (timer === 0 && !isAnswerRevealed) {
            clearInterval(timeRef.current);

            const revealTimeout = setTimeout(() => {
                processAndRevealAnswer();
            }, 1000);

            return () => clearTimeout(revealTimeout);
        }
    }, [timer, isAnswerRevealed, processAndRevealAnswer]);

    const handleAnswerClick = (answerIndex) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answerIndex);
        setAnswerTime(timer);
    };

    const Shape = ({ type }) => {
        return <div className={`answer-shape shape-${type}`}></div>;
    };

    return (
        <div className="quiz-container">
            <div className="header-quiz">
                <div className="header-info">
                    <div>
                        Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
                    </div>
                    <div>Điểm: {score}</div>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>
            <div className="question-section">
                <div className="question-text">{questionData.questionText}</div>
            </div>
            <div className="timer-bar-wrapper">
                <div className="timer-bar-bg">
                    <div
                        className="timer-bar-fill"
                        style={{ width: `${(timer / 15) * 100}%`, transition: 'width 1s linear' }}
                    ></div>
                    <span className="timer-bar-text">{timer}s</span>
                </div>
            </div>
            {showChart ? (
                <Chart
                    data={chartData}
                    correctIndex={questionData.answerOptions.findIndex((a) => a.isCorrect)}
                    shapes={shapes}
                />
            ) : (
                questionData.imageUrl && (
                    <img src={questionData.imageUrl} alt="Question illustration" className="question-image" />
                )
            )}
            <div className="answer-section">
                {questionData.answerOptions.map((answerOption, index) => {
                    let className = `answer-button answer-color-${index}`;
                    if (isAnswerRevealed) {
                        if (answerOption.isCorrect) {
                            className += ' correct';
                        } else {
                            className += ' wrong';
                        }
                    }
                    if (selectedAnswer === index) {
                        className += ' selected';
                    }
                    return (
                        <button
                            key={index}
                            className={className}
                            onClick={() => handleAnswerClick(index)}
                            disabled={selectedAnswer !== null}
                        >
                            <Shape type={shapes[index % shapes.length]} />
                            <span>{answerOption.answerText}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Quiz;
