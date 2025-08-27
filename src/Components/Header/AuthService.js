// Authentication Service
class AuthService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    }

    // Mock login - replace with real API call
    async login(credentials) {
        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock validation
            if (!credentials.username || !credentials.password) {
                throw new Error('Username and password are required');
            }

            // Mock user data - replace with real API response
            const mockUser = {
                id: Date.now(),
                name: credentials.username,
                email: credentials.email || `${credentials.username}@example.com`,
                avatar: `https://ui-avatars.com/api/?name=${credentials.username}&background=4f46e5&color=fff`,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                stats: {
                    totalQuizzes: 0,
                    bestScore: 0,
                    averageScore: 0,
                },
            };

            return {
                success: true,
                user: mockUser,
                token: 'mock-jwt-token-' + Date.now(),
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Mock register - replace with real API call
    async register(userData) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (!userData.username || !userData.email || !userData.password) {
                throw new Error('All fields are required');
            }

            const mockUser = {
                id: Date.now(),
                name: userData.username,
                email: userData.email,
                avatar: `https://ui-avatars.com/api/?name=${userData.username}&background=4f46e5&color=fff`,
                createdAt: new Date().toISOString(),
                stats: {
                    totalQuizzes: 0,
                    bestScore: 0,
                    averageScore: 0,
                },
            };

            return {
                success: true,
                user: mockUser,
                token: 'mock-jwt-token-' + Date.now(),
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Mock password reset
    async resetPassword(email) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            return {
                success: true,
                message: 'Password reset link sent to your email',
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Update user profile
    async updateProfile(userId, profileData) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            return {
                success: true,
                user: {
                    ...profileData,
                    avatar: `https://ui-avatars.com/api/?name=${profileData.name}&background=4f46e5&color=fff`,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Get user stats
    async getUserStats(userId) {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockStats = {
                totalQuizzes: Math.floor(Math.random() * 50) + 1,
                bestScore: Math.floor(Math.random() * 100) + 1,
                averageScore: Math.floor(Math.random() * 80) + 20,
                recentQuizzes: [
                    { id: 1, score: 85, date: '2024-01-15', topic: 'JavaScript' },
                    { id: 2, score: 92, date: '2024-01-14', topic: 'React' },
                    { id: 3, score: 78, date: '2024-01-13', topic: 'CSS' },
                ],
            };

            return {
                success: true,
                stats: mockStats,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Validate token
    validateToken(token) {
        // Mock token validation
        return token && token.startsWith('mock-jwt-token-');
    }

    // Get current user from token
    getCurrentUserFromToken(token) {
        if (!this.validateToken(token)) {
            return null;
        }

        // In real app, decode JWT token
        const savedUser = localStorage.getItem('quizUser');
        return savedUser ? JSON.parse(savedUser) : null;
    }
}

export default new AuthService();
