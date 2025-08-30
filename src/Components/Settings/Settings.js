import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
    const [isNightMode, setIsNightMode] = useState(() => {
        const saved = localStorage.getItem('settings_nightMode');
        return saved === 'true';
    });
    const [emailNotifications, setEmailNotifications] = useState(() => {
        const saved = localStorage.getItem('settings_emailNotifications');
        return saved !== 'false'; // Default to true
    });
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('settings_language');
        return saved || 'Tiếng Việt'; // Default to Vietnamese
    });

    // Effect to apply/remove dark mode class and save to localStorage
    useEffect(() => {
        if (isNightMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('settings_nightMode', isNightMode);
    }, [isNightMode]);

    // Effect to save email notification setting
    useEffect(() => {
        localStorage.setItem('settings_emailNotifications', emailNotifications);
    }, [emailNotifications]);

    // Effect to save language setting
    useEffect(() => {
        localStorage.setItem('settings_language', language);
        // NOTE: This does not implement i18n. It only saves the preference.
    }, [language]);

    return (
        <div className="settings-container">
            <h1>⚙️ Cài đặt</h1>
            <div className="settings-section">
                <h2>Tài khoản</h2>
                <div className="setting-item">
                    <label>Thông báo qua email</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
            <div className="settings-section">
                <h2>Giao diện</h2>
                <div className="setting-item">
                    <label>Chế độ ban đêm</label>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isNightMode}
                            onChange={(e) => setIsNightMode(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <label>Ngôn ngữ</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option>Tiếng Việt</option>
                        <option>English</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
