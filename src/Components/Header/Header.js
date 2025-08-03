import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ 
    isAuthenticated = false, 
    user = null, 
    onLogin, 
    onLogout, 
    onShowProfile,
    currentPage = 'quiz',
    onPageChange
}) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu') && !event.target.closest('.mobile-menu')) {
                setShowUserDropdown(false);
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogin = (credentials) => {
        // Mock login logic - replace with real authentication
        const mockUser = {
            id: 1,
            name: credentials.username || 'User',
            email: credentials.email || 'user@example.com',
            avatar: `https://ui-avatars.com/api/?name=${credentials.username || 'User'}&background=4f46e5&color=fff`
        };
        
        if (onLogin) {
            onLogin(mockUser);
        }
        setShowLoginModal(false);
        
        // Show success message
        alert('Đăng nhập thành công! Bây giờ bạn có thể chơi quiz.');
    };

    const handleRegister = (userData) => {
        // Mock register logic - replace with real authentication
        const newUser = {
            id: Date.now(),
            name: userData.username || userData.name || 'User',
            email: userData.email || 'user@example.com',
            avatar: `https://ui-avatars.com/api/?name=${userData.username || userData.name || 'User'}&background=4f46e5&color=fff`,
            createdAt: new Date().toISOString(),
            stats: {
                totalQuizzes: 0,
                bestScore: 0,
                averageScore: 0
            }
        };
        
        if (onLogin) {
            onLogin(newUser);
        }
        setShowRegisterModal(false);
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
        setShowUserDropdown(false);
    };

    const handleNavClick = (page) => {
        if (onPageChange) {
            onPageChange(page);
        }
    };

    return (
        <>
            <header className="header">
                <div className="header-container">
                    {/* Logo */}
                    <div className="header-logo">
                        <img src="/logo_quiz.png" alt="Quiz Logo" className="logo-image" />
                        <span className="logo-text">QuizMaster</span>
                    </div>

                    {/* Navigation */}
                    <nav className={`nav-menu ${showMobileMenu ? 'nav-menu-active' : ''}`}>
                        <a 
                            href="#" 
                            className={`nav-link ${currentPage === 'quiz' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('quiz');
                            }}
                        >
                            <i className="icon-quiz"></i>
                            Quiz
                        </a>
                        <a 
                            href="#" 
                            className={`nav-link ${currentPage === 'create' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('create');
                            }}
                        >
                            <i className="icon-create"></i>
                            Tạo Quiz
                        </a>
                        <a 
                            href="#" 
                            className={`nav-link ${currentPage === 'leaderboard' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('leaderboard');
                            }}
                        >
                            <i className="icon-trophy"></i>
                            Bảng xếp hạng
                        </a>
                        <a 
                            href="#" 
                            className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('history');
                            }}
                        >
                            <i className="icon-history"></i>
                            Lịch sử
                        </a>
                    </nav>

                    {/* User Section */}
                    <div className="header-user">
                        {isAuthenticated && user ? (
                            <div className="user-menu">
                                <button 
                                    className="user-button"
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                >
                                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                                    <span className="user-name">{user.name}</span>
                                    <i className={`dropdown-arrow ${showUserDropdown ? 'rotate' : ''}`}>▼</i>
                                </button>
                                
                                {showUserDropdown && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-header">
                                            <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                                            <div>
                                                <div className="dropdown-name">{user.name}</div>
                                                <div className="dropdown-email">{user.email}</div>
                                            </div>
                                        </div>
                                        <hr className="dropdown-divider" />
                                        <button className="dropdown-item" onClick={onShowProfile}>
                                            <i className="icon-user"></i>
                                            Hồ sơ cá nhân
                                        </button>
                                        <button className="dropdown-item">
                                            <i className="icon-settings"></i>
                                            Cài đặt
                                        </button>
                                        <hr className="dropdown-divider" />
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            <i className="icon-logout"></i>
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <button 
                                    className="login-btn"
                                    onClick={() => setShowLoginModal(true)}
                                >
                                    Đăng nhập
                                </button>
                                <button 
                                    className="signup-btn"
                                    onClick={() => setShowRegisterModal(true)}
                                >
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="mobile-toggle"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal 
                    onLogin={handleLogin}
                    onClose={() => setShowLoginModal(false)}
                    onSwitchToRegister={() => {
                        setShowLoginModal(false);
                        setShowRegisterModal(true);
                    }}
                />
            )}

            {/* Register Modal */}
            {showRegisterModal && (
                <RegisterModal 
                    onRegister={handleRegister}
                    onClose={() => setShowRegisterModal(false)}
                    onSwitchToLogin={() => {
                        setShowRegisterModal(false);
                        setShowLoginModal(true);
                    }}
                />
            )}
        </>
    );
};

// Login Modal Component
const LoginModal = ({ onLogin, onClose, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Đăng nhập</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên đăng nhập"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            Đăng nhập
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Hủy
                        </button>
                    </div>
                    
                    <div className="form-footer">
                        <a href="#" className="forgot-password">Quên mật khẩu?</a>
                        <p>
                            Chưa có tài khoản? 
                            <button 
                                type="button" 
                                className="switch-modal-btn"
                                onClick={onSwitchToRegister}
                            >
                                Đăng ký ngay
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Register Modal Component
const RegisterModal = ({ onRegister, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Tên đăng nhập không được để trống';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            onRegister(formData);
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Đăng ký tài khoản</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="register-username">Tên đăng nhập *</label>
                        <input
                            type="text"
                            id="register-username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên đăng nhập"
                            className={errors.username ? 'error' : ''}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-email">Email *</label>
                        <input
                            type="email"
                            id="register-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Nhập địa chỉ email"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="register-password">Mật khẩu *</label>
                        <input
                            type="password"
                            id="register-password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="register-confirm-password">Xác nhận mật khẩu *</label>
                        <input
                            type="password"
                            id="register-confirm-password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Nhập lại mật khẩu"
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Hủy
                        </button>
                    </div>
                    
                    <div className="form-footer">
                        <p>
                            Đã có tài khoản? 
                            <button 
                                type="button" 
                                className="switch-modal-btn"
                                onClick={onSwitchToLogin}
                            >
                                Đăng nhập ngay
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Header;