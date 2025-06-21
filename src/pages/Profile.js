import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }

        const loadUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load profile');
                }
                
                const data = await response.json();
                if (data.success) {
                    setUser(data.data);
                } else {
                    localStorage.removeItem('token');
                    navigate('/signin');
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                localStorage.removeItem('token');
                navigate('/signin');
            }
        };

        loadUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    const handleEditProfile = () => {
        // TODO: Implement edit profile functionality
        alert('Edit profile functionality coming soon!');
    };

    if (!user) {
        return (
            <div className="profile-container">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <h2>{user.name}</h2>
                <p className="text-muted">{user.email}</p>
            </div>
            
            <div className="profile-info">
                <div className="profile-info-item">
                    <div className="profile-info-label">Full Name</div>
                    <div className="profile-info-value">{user.name}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Email Address</div>
                    <div className="profile-info-value">{user.email}</div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Account Type</div>
                    <div className="profile-info-value">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </div>
                </div>
                
                <div className="profile-info-item">
                    <div className="profile-info-label">Member Since</div>
                    <div className="profile-info-value">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
            
            <div className="profile-actions">
                <button className="btn-edit-profile" onClick={handleEditProfile}>
                    Edit Profile
                </button>
                <button className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile; 