import React, { useState, useEffect } from 'react';
import './EditProfile.css';

const EditProfile = ({ user, onUpdateUser, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

    useEffect(() => {
        // Reset form data if user prop changes
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setAvatarPreview(user?.avatar || '');
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Gọi API backend để cập nhật thông tin user
        try {
            const token = localStorage.getItem('quiz_token');
            const formDataToSend = new FormData();
            formDataToSend.append('userId', user._id);
            formDataToSend.append('name', formData.name);
            if (avatarFile) {
                formDataToSend.append('profilePicture', avatarFile);
            }

            const response = await fetch('http://localhost:3000/api/v1/user/update', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });
            const data = await response.json();
            if (data.success && data.userData) {
                // Lưu lại vào localStorage
                const updatedUser = { ...user, ...data.userData, avatar: data.userData.profilePicture ? `http://localhost:3000${data.userData.profilePicture}` : user.avatar };
                localStorage.setItem('quizUser', JSON.stringify(updatedUser));
                onUpdateUser(updatedUser);
                setIsEditing(false);
                onClose && onClose(); // Đóng form chỉnh sửa nếu có hàm onClose
            } else {
                alert(data.message || 'Cập nhật thất bại!');
            }
        } catch (error) {
            alert('Lỗi kết nối server!');
        }
    };

    const handleCancel = () => {
        // Reset changes
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
        });
        setAvatarPreview(user?.avatar || '');
        setAvatarFile(null);
        setIsEditing(false);
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-content">
                <div className="edit-profile-header">
                    <h2>{isEditing ? 'Chỉnh sửa hồ sơ' : 'Hồ sơ của bạn'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                {isEditing ? (
                    // Edit Mode
                    <form onSubmit={handleSubmit} className="edit-profile-form">
                        <div className="avatar-section">
                            <img src={avatarPreview} alt="Avatar" className="avatar-preview" />
                            <input type="file" id="avatarUpload" onChange={handleFileChange} accept="image/*" />
                            <label htmlFor="avatarUpload" className="upload-btn">
                                Thay đổi avatar
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Tên</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                readOnly // Email is not editable
                                style={{ cursor: 'not-allowed', backgroundColor: '#f0f0f0' }}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                Lưu thay đổi
                            </button>
                            <button type="button" className="cancel-btn" onClick={handleCancel}>
                                Hủy
                            </button>
                        </div>
                    </form>
                ) : (
                    // View Mode
                    <div className="view-profile">
                        <div className="avatar-section">
                            <img src={user?.avatar} alt="Avatar" className="avatar-preview" />
                        </div>
                        <div className="info-group">
                            <label>Tên</label>
                            <p>{user?.name}</p>
                        </div>
                        <div className="info-group">
                            <label>Email</label>
                            <p>{user?.email}</p>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="submit-btn" onClick={() => setIsEditing(true)}>
                                Chỉnh sửa hồ sơ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfile;
