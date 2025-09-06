import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({
    isAuthenticated = false,
    user = null,
    onLogin,
    onRegister,
    onForgotPassword,
    onLogout,
    onShowProfile,
    currentPage = 'none',
    onPageChange,
}) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close mobile menu if clicked outside of the menu itself or the toggle button
            if (showMobileMenu && !event.target.closest('.nav-menu') && !event.target.closest('.mobile-toggle')) {
                setShowMobileMenu(false);
            }
            // Close user dropdown if clicked outside
            if (showUserDropdown && !event.target.closest('.user-menu')) {
                setShowUserDropdown(false);
            }
        };

        // Use mousedown to catch the event before a potential click event on another element
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMobileMenu, showUserDropdown]); // Re-run effect if state changes

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

    const handleForgotPassword = async (email) => {
        try {
            console.log('🔄 Header: Bắt đầu khôi phục mật khẩu...');
            if (onForgotPassword) {
                const result = await onForgotPassword(email);
                if (result.success) {
                    setShowForgotPasswordModal(false);
                    alert('Yêu cầu khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
                    console.log('✅ Header: Yêu cầu khôi phục mật khẩu thành công');
                } else {
                    alert(`Lỗi: ${result.message || 'Không thể gửi yêu cầu khôi phục mật khẩu.'}`);
                    console.log('❌ Header: Khôi phục mật khẩu thất bại:', result.message);
                }
                return result;
            }
        } catch (error) {
            console.error('❌ Header: Lỗi khôi phục mật khẩu:', error);
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
                            <span className="nav-icon">💡</span>
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
                            <span className="nav-icon">✏️</span>
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
                            <span className="nav-icon">🕒</span>
                            Lịch sử
                        </a>
                    </nav>

                    {/* User Section */}
                    <div className="header-user">
                        {isAuthenticated && user ? (
                            <div className="user-menu">
                                <button className="user-button" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="user-avatar"
                                        onError={(e) => {
                                            try {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    user.name || 'U',
                                                )}&background=4f46e5&color=fff`;
                                            } catch (_) {}
                                        }}
                                    />
                                    <span className="user-name">{user.name}</span>
                                    <i className={`dropdown-arrow ${showUserDropdown ? 'rotate' : ''}`}>▼</i>
                                </button>

                                {showUserDropdown && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-header">
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="dropdown-avatar"
                                                onError={(e) => {
                                                    try {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                            user.name || 'U',
                                                        )}&background=4f46e5&color=fff`;
                                                    } catch (_) {}
                                                }}
                                            />
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
                    onSwitchToForgotPassword={() => {
                        setShowLoginModal(false);
                        setShowForgotPasswordModal(true);
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

            {/* Forgot Password Modal */}
            {showForgotPasswordModal && (
                <ForgotPasswordModal
                    onForgotPassword={handleForgotPassword}
                    onClose={() => setShowForgotPasswordModal(false)}
                    onSwitchToLogin={() => {
                        setShowForgotPasswordModal(false);
                        setShowLoginModal(true);
                    }}
                />
            )}
        </>
    );
};

// Login Modal Component
const LoginModal = ({ onLogin, onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
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

                    <div className="social-login-divider">
                        <span>HOẶC</span>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="submit-btn google-btn"
                            onClick={() => {
                                alert('Chức năng đăng nhập với Google chưa được triển khai.');
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9.1818v3.4818h4.7909c-.2045 1.125-.8273 2.0782-1.7955 2.7218v2.2582h2.9091c1.7018-1.5664 2.6836-3.8736 2.6836-6.621z"
                                ></path>
                                <path
                                    fill="#34A853"
                                    d="M9.1818 18c2.43 0 4.4673-.8018 5.9564-2.1818l-2.9091-2.2582c-.8018.5436-1.8364.8718-2.9818.8718-2.31 0-4.2655-1.5664-4.9664-3.6682H1.2727v2.3318C2.7555 15.8336 5.7218 18 9.1818 18z"
                                ></path>
                                <path
                                    fill="#FBBC05"
                                    d="M4.2155 10.8982c-.11-.33-.17-.68-.17-1.04s.06-.71.17-1.04V6.4864H1.2727C.4636 8.0336 0 9.9655 0 12s.4636 3.9664 1.2727 5.5136L4.2155 14.57z"
                                ></path>
                                <path
                                    fill="#EA4335"
                                    d="M9.1818 3.6364c1.3227 0 2.5091.4545 3.4409 1.3455l2.5818-2.5818C13.6455.9655 11.6182 0 9.1818 0 5.7218 0 2.7555 2.1664 1.2727 5.1364L4.2155 7.4682c.7009-2.1018 2.6564-3.8318 4.9664-3.8318z"
                                ></path>
                            </svg>
                            <span>Đăng nhập với Google</span>
                        </button>
                    </div>

                    <div className="form-footer">
                        <p>
                            <button
                                type="button"
                                className="switch-modal-btn forgot-password"
                                onClick={onSwitchToForgotPassword}
                            >
                                Quên mật khẩu?
                            </button>
                        </p>
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
                        <label htmlFor="register-name">Tên hiển thị</label>
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
                        <label htmlFor="register-email">Email</label>
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
                        <label htmlFor="register-password">Mật khẩu</label>
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
                        <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
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

// Forgot Password Modal Component
const ForgotPasswordModal = ({ onForgotPassword, onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Vui lòng nhập email của bạn!');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ!');
            return;
        }

        setIsLoading(true);
        setError('');
        await onForgotPassword({ email });
        setIsLoading(false);
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) {
            setError('');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Quên mật khẩu</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <p className="modal-description">
                        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu!
                    </p>

                    <div className="form-group">
                        <label htmlFor="forgot-email">Email:</label>
                        <input
                            type="email"
                            id="forgot-email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            required
                            placeholder="Nhập địa chỉ email của bạn..."
                            className={error ? 'error' : ''}
                        />
                        {error && <span className="error-message">{error}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Đang gửi...' : 'Gửi liên kết'}
                        </button>
                    </div>

                    <div className="form-footer">
                        <p>
                            <button type="button" className="switch-modal-btn" onClick={onSwitchToLogin}>
                                Quay lại đăng nhập
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Header;
