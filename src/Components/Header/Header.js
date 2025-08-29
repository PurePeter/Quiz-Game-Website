import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({
    isAuthenticated = false,
    user = null,
    onLogin,
    onRegister,
    onLogout,
    onShowProfile,
    currentPage = 'none',
    onPageChange,
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

    const handleLogin = async (credentials) => {
        try {
            console.log('🔑 Header: Bắt đầu đăng nhập...');

            // Call onLogin from props (App.js will handle the API call)
            if (onLogin) {
                const result = await onLogin(credentials);
                if (result.success) {
                    setShowLoginModal(false);
                    console.log('✅ Header: Đăng nhập thành công');
                } else {
                    console.log('❌ Header: Đăng nhập thất bại:', result.message);
                }
            } else {
                console.log('❌ Header: onLogin function không được truyền');
            }
        } catch (error) {
            console.error('❌ Header: Lỗi đăng nhập:', error);
        }
    };

    const handleRegister = async (userData) => {
        try {
            console.log('🚀 Header: Bắt đầu đăng ký...');

            // Call onRegister from props (App.js will handle the API call)
            if (onRegister) {
                const result = await onRegister(userData);
                if (result.success) {
                    setShowRegisterModal(false);
                    console.log('✅ Header: Đăng ký thành công');
                } else {
                    console.log('❌ Header: Đăng ký thất bại:', result.message);
                }
            } else {
                console.log('❌ Header: onRegister function không được truyền');
            }
        } catch (error) {
            console.error('❌ Header: Lỗi đăng ký:', error);
        }
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
                            className={`nav-link quiz ${currentPage === 'quiz' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('quiz');
                            }}
                        >
                            <span className="box"></span>
                            Quiz
                        </a>
                        <a
                            href="#"
                            className={`nav-link create ${currentPage === 'create' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('create');
                            }}
                        >
                            <span className="box"></span>
                            Tạo Quiz
                        </a>
                        {/* Removed Leaderboard link as requested */}
                        <a
                            href="#"
                            className={`nav-link history ${currentPage === 'history' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('history');
                            }}
                        >
                            <span className="box"></span>
                            Lịch sử
                        </a>
                    </nav>

                    {/* User Section */}
                    <div className="header-user">
                        {isAuthenticated && user ? (
                            <div className="user-menu">
                                <button className="user-button" onClick={() => setShowUserDropdown(!showUserDropdown)}>
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
                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                onPageChange('edit-profile');
                                                setShowUserDropdown(false);
                                            }}
                                        >
                                            <i className="icon-user"></i>
                                            Hồ sơ của bạn
                                        </button>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                onPageChange('settings');
                                                setShowUserDropdown(false);
                                            }}
                                        >
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
                                <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                                    Đăng nhập
                                </button>
                                <button className="signup-btn" onClick={() => setShowRegisterModal(true)}>
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
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
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Đăng nhập</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Nhập địa chỉ email"
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
                        <a href="#" className="forgot-password">
                            Quên mật khẩu?
                        </a>
                        <p>
                            Chưa có tài khoản?
                            <button type="button" className="switch-modal-btn" onClick={onSwitchToRegister}>
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
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên hiển thị không được để trống';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Tên hiển thị phải có ít nhất 2 ký tự';
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
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Đăng ký tài khoản</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="register-name">Tên hiển thị *</label>
                        <input
                            type="text"
                            id="register-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên hiển thị"
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
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
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Hủy
                        </button>
                    </div>

                    <div className="form-footer">
                        <p>
                            Đã có tài khoản?
                            <button type="button" className="switch-modal-btn" onClick={onSwitchToLogin}>
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

