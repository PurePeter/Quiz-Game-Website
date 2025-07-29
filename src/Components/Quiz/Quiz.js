import React, { useState, useEffect, useRef } from 'react';
import './Quiz.css';

const Quiz = ({ questionData, currentQuestionIndex, totalQuestions, score, onAnswer, onNext }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [timer, setTimer] = useState(15);
    const timeRef = useRef();
    const shapes = ['triangle', 'square', 'circle', 'star'];

    useEffect(() => {
        setTimer(15);
        setSelectedAnswer(null);
        setIsAnswerRevealed(false);
        if (timeRef.current) clearInterval(timeRef.current);
        timeRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev < 1) {
                    clearInterval(timeRef.current);
                    handleAnswerClick(false, null, true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timeRef.current);
        // eslint-disable-next-line
    }, [questionData]);

    const handleAnswerClick = (isCorrect, answerIndex, isTimeout = false) => {
        if (selectedAnswer !== null && !isTimeout) return; // tránh double click
        setSelectedAnswer(answerIndex);
        clearInterval(timeRef.current);
        setTimeout(() => {
            setIsAnswerRevealed(true);
            if (!isTimeout) {
                onAnswer(isCorrect, timer);
            } else {
                onAnswer(false, 0);
            }
            setTimeout(() => {
                setIsAnswerRevealed(false);
                setSelectedAnswer(null);
                onNext();
            }, 4000);
        }, 1000);
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
            {questionData.imageUrl && (
                <img src={questionData.imageUrl} alt="Question illustration" className="question-image" />
            )}
            <div className="answer-section">
                {questionData.answerOptions.map((answerOption, index) => {
                    let className = 'answer-button';
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
                            onClick={() => handleAnswerClick(answerOption.isCorrect, index)}
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
