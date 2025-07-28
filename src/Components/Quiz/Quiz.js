import React from 'react';
import './Quiz.css';

const Quiz = ({ questionData, handleAnswerClick, selectedAnswer, isAnswerRevealed }) => {
    const shapes = ['triangle', 'square', 'circle', 'star'];

    const Shape = ({ type }) => {
        return <div className={`answer-shape shape-${type}`}></div>;
    };

    return (
        <div className="quiz-container">
            <div className="question-section">
                <div className="question-text">{questionData.questionText}</div>
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
