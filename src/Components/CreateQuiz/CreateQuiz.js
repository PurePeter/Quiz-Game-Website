import React, { useState } from 'react';
import './CreateQuiz.css';

const CreateQuiz = ({ isAuthenticated, user }) => {
    // API Configuration
    const API_BASE = 'http://localhost:3000/api/v1';

    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        category: 'general',
        difficulty: 'medium',
        timeLimit: 30,
        questions: [],
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        imageUrl: '',
        answerOptions: [
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
        ],
    });

    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { value: 'general', label: 'Tổng hợp' },
        { value: 'technology', label: 'Công nghệ' },
        { value: 'science', label: 'Khoa học' },
        { value: 'history', label: 'Lịch sử' },
        { value: 'geography', label: 'Địa lý' },
        { value: 'literature', label: 'Văn học' },
        { value: 'sports', label: 'Thể thao' },
        { value: 'entertainment', label: 'Giải trí' },
    ];

    const difficulties = [
        { value: 'easy', label: 'Dễ' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'hard', label: 'Khó' },
    ];

    const handleQuizDataChange = (field, value) => {
        setQuizData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleQuestionChange = (field, value) => {
        setCurrentQuestion((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAnswerOptionChange = (index, field, value) => {
        setCurrentQuestion((prev) => ({
            ...prev,
            answerOptions: prev.answerOptions.map((option, i) =>
                i === index ? { ...option, [field]: value } : option,
            ),
        }));
    };

    const handleCorrectAnswerChange = (index) => {
        setCurrentQuestion((prev) => ({
            ...prev,
            answerOptions: prev.answerOptions.map((option, i) => ({
                ...option,
                isCorrect: i === index,
            })),
        }));
    };

    const addQuestion = () => {
        if (!currentQuestion.questionText.trim()) {
            alert('Vui lòng nhập nội dung câu hỏi!');
            return;
        }

        const hasCorrectAnswer = currentQuestion.answerOptions.some((option) => option.isCorrect);
        if (!hasCorrectAnswer) {
            alert('Vui lòng chọn ít nhất một đáp án đúng!');
            return;
        }

        const hasValidAnswers = currentQuestion.answerOptions.every((option) => option.answerText.trim());
        if (!hasValidAnswers) {
            alert('Vui lòng điền đầy đủ tất cả các đáp án!');
            return;
        }

        if (editingQuestionIndex >= 0) {
            // Edit existing question
            const updatedQuestions = [...quizData.questions];
            updatedQuestions[editingQuestionIndex] = { ...currentQuestion };
            setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
            setEditingQuestionIndex(-1);
        } else {
            // Add new question
            setQuizData((prev) => ({
                ...prev,
                questions: [...prev.questions, { ...currentQuestion }],
            }));
        }

        // Reset form
        setCurrentQuestion({
            questionText: '',
            imageUrl: '',
            answerOptions: [
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
                { answerText: '', isCorrect: false },
            ],
        });
        setShowQuestionForm(false);
    };

    const editQuestion = (index) => {
        setCurrentQuestion({ ...quizData.questions[index] });
        setEditingQuestionIndex(index);
        setShowQuestionForm(true);
    };

    const deleteQuestion = (index) => {
        if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
            setQuizData((prev) => ({
                ...prev,
                questions: prev.questions.filter((_, i) => i !== index),
            }));
        }
    };

    const saveQuiz = async () => {
        if (!quizData.title.trim()) {
            alert('Vui lòng nhập tiêu đề quiz!');
            return;
        }

        if (quizData.questions.length < 1) {
            alert('Vui lòng thêm ít nhất một câu hỏi!');
            return;
        }

        setIsLoading(true);

        try {
            // Get token from localStorage
            const token = localStorage.getItem('quiz_token');
            if (!token) {
                alert('Vui lòng đăng nhập lại!');
                return;
            }

            const quizPayload = {
                title: quizData.title,
                description: quizData.description,
                // Map to backend expected fields
                timePerQuestion: quizData.timeLimit,
                questions: quizData.questions.map((q) => {
                    const options = q.answerOptions.map((o) => o.answerText);
                    const correctIdx = q.answerOptions.findIndex((o) => o.isCorrect);
                    return {
                        text: q.questionText,
                        options,
                        correctAnswer: Math.max(0, correctIdx),
                    };
                }),
            };

            console.log('🚀 Gửi quiz data:', quizPayload);

            const response = await fetch(`${API_BASE}/quiz/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(quizPayload),
            });

            const data = await response.json();
            console.log('📥 Quiz response:', data);

            if (data.success) {
                alert('✅ Quiz đã được lưu thành công!');

                // Reset form
                setQuizData({
                    title: '',
                    description: '',
                    category: 'general',
                    difficulty: 'medium',
                    timeLimit: 30,
                    questions: [],
                });
            } else {
                alert(`❌ Lỗi: ${data.message}`);
            }
        } catch (error) {
            console.error('❌ Lỗi tạo quiz:', error);
            alert('❌ Lỗi kết nối server');
        } finally {
            setIsLoading(false);
        }
    };

    const publishQuiz = async () => {
        if (!quizData.title.trim()) {
            alert('Vui lòng nhập tiêu đề quiz!');
            return;
        }

        if (quizData.questions.length < 1) {
            alert('Vui lòng thêm ít nhất một câu hỏi!');
            return;
        }

        setIsLoading(true);

        try {
            // Get token from localStorage
            const token = localStorage.getItem('quiz_token');
            if (!token) {
                alert('Vui lòng đăng nhập lại!');
                return;
            }

            const quizPayload = {
                title: quizData.title,
                description: quizData.description,
                timePerQuestion: quizData.timeLimit,
                questions: quizData.questions.map((q) => {
                    const options = q.answerOptions.map((o) => o.answerText);
                    const correctIdx = q.answerOptions.findIndex((o) => o.isCorrect);
                    return {
                        text: q.questionText,
                        options,
                        correctAnswer: Math.max(0, correctIdx),
                    };
                }),
            };

            console.log('🚀 Xuất bản quiz:', quizPayload);

            const response = await fetch(`${API_BASE}/quiz/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(quizPayload),
            });

            const data = await response.json();
            console.log('📥 Publish response:', data);

            if (data.success) {
                alert('✅ Quiz đã được xuất bản thành công!');

                // Reset form
                setQuizData({
                    title: '',
                    description: '',
                    category: 'general',
                    difficulty: 'medium',
                    timeLimit: 30,
                    questions: [],
                });
            } else {
                alert(`❌ Lỗi: ${data.message}`);
            }
        } catch (error) {
            console.error('❌ Lỗi xuất bản quiz:', error);
            alert('❌ Lỗi kết nối server');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="create-quiz-container">
                <div className="auth-required">
                    <div className="auth-icon">🔐</div>
                    <h2>Đăng nhập để tạo Quiz</h2>
                    <p>Vui lòng đăng nhập để sử dụng tính năng tạo Quiz.</p>
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
        <div className="create-quiz-container">
            <div className="create-quiz-header">
                <h1>Tạo Quiz Mới</h1>
                <p>Tạo quiz của riêng bạn và chia sẻ với cộng đồng</p>
            </div>

            <div className="create-quiz-content">
                {/* Quiz Information */}
                <div className="quiz-info-section">
                    <h2>Thông tin Quiz</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="quiz-title">Tiêu đề Quiz *</label>
                            <input
                                type="text"
                                id="quiz-title"
                                value={quizData.title}
                                onChange={(e) => handleQuizDataChange('title', e.target.value)}
                                placeholder="Nhập tiêu đề quiz..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quiz-description">Mô tả</label>
                            <textarea
                                id="quiz-description"
                                value={quizData.description}
                                onChange={(e) => handleQuizDataChange('description', e.target.value)}
                                placeholder="Mô tả về quiz của bạn..."
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quiz-category">Danh mục</label>
                            <select
                                id="quiz-category"
                                value={quizData.category}
                                onChange={(e) => handleQuizDataChange('category', e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="quiz-difficulty">Độ khó</label>
                            <select
                                id="quiz-difficulty"
                                value={quizData.difficulty}
                                onChange={(e) => handleQuizDataChange('difficulty', e.target.value)}
                            >
                                {difficulties.map((diff) => (
                                    <option key={diff.value} value={diff.value}>
                                        {diff.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="quiz-time-limit">Thời gian (giây)</label>
                            <input
                                type="number"
                                id="quiz-time-limit"
                                value={quizData.timeLimit}
                                onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e.target.value))}
                                min="10"
                                max="300"
                            />
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="questions-section">
                    <div className="questions-header">
                        <h2>❓ Câu hỏi ({quizData.questions.length})</h2>
                        <button className="add-question-btn" onClick={() => setShowQuestionForm(true)}>
                            + Thêm câu hỏi
                        </button>
                    </div>

                    {/* Question Form */}
                    {showQuestionForm && (
                        <div className="question-form">
                            <h3>{editingQuestionIndex >= 0 ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</h3>

                            <div className="form-group">
                                <label htmlFor="question-text">Nội dung câu hỏi *</label>
                                <textarea
                                    id="question-text"
                                    value={currentQuestion.questionText}
                                    onChange={(e) => handleQuestionChange('questionText', e.target.value)}
                                    placeholder="Nhập nội dung câu hỏi..."
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="question-image">URL hình ảnh (tùy chọn)</label>
                                <input
                                    type="url"
                                    id="question-image"
                                    value={currentQuestion.imageUrl}
                                    onChange={(e) => handleQuestionChange('imageUrl', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="answer-options">
                                <label>Đáp án *</label>
                                {currentQuestion.answerOptions.map((option, index) => (
                                    <div key={index} className="answer-option">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={option.isCorrect}
                                            onChange={() => handleCorrectAnswerChange(index)}
                                            id={`correct-${index}`}
                                        />
                                        <input
                                            type="text"
                                            value={option.answerText}
                                            onChange={(e) =>
                                                handleAnswerOptionChange(index, 'answerText', e.target.value)
                                            }
                                            placeholder={`Đáp án ${index + 1}...`}
                                            required
                                        />
                                        <label htmlFor={`correct-${index}`} className="correct-label">
                                            Đúng
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="question-actions">
                                <button type="button" className="save-question-btn" onClick={addQuestion}>
                                    {editingQuestionIndex >= 0 ? 'Cập nhật' : 'Thêm câu hỏi'}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setShowQuestionForm(false);
                                        setEditingQuestionIndex(-1);
                                        setCurrentQuestion({
                                            questionText: '',
                                            imageUrl: '',
                                            answerOptions: [
                                                { answerText: '', isCorrect: false },
                                                { answerText: '', isCorrect: false },
                                                { answerText: '', isCorrect: false },
                                                { answerText: '', isCorrect: false },
                                            ],
                                        });
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Questions List */}
                    <div className="questions-list">
                        {quizData.questions.map((question, index) => (
                            <div key={index} className="question-item">
                                <div className="question-header">
                                    <span className="question-number">Câu {index + 1}</span>
                                    <div className="question-actions">
                                        <button className="edit-btn" onClick={() => editQuestion(index)}>
                                            ✏️
                                        </button>
                                        <button className="delete-btn" onClick={() => deleteQuestion(index)}>
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <div className="question-content">
                                    <p className="question-text">{question.questionText}</p>
                                    {question.imageUrl && (
                                        <img
                                            src={question.imageUrl}
                                            alt="Question"
                                            className="question-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <div className="answer-list">
                                        {question.answerOptions.map((option, optIndex) => (
                                            <div
                                                key={optIndex}
                                                className={`answer-item ${option.isCorrect ? 'correct' : ''}`}
                                            >
                                                {option.answerText}
                                                {option.isCorrect && <span className="correct-badge">✓</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Actions */}
                <div className="save-actions">
                    <button
                        className="save-draft-btn"
                        onClick={saveQuiz}
                        disabled={quizData.questions.length === 0 || isLoading}
                    >
                        {isLoading ? 'Đang lưu...' : '💾 Lưu bản nháp'}
                    </button>
                    <button
                        className="publish-btn"
                        onClick={publishQuiz}
                        disabled={quizData.questions.length === 0 || isLoading}
                    >
                        {isLoading ? 'Đang xuất bản...' : '🚀 Xuất bản'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuiz;
