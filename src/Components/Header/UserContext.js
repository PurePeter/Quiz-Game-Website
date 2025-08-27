import React, { createContext, useContext, useReducer, useEffect } from 'react';

// User Context
const UserContext = createContext();

// Action types
const USER_ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    UPDATE_PROFILE: 'UPDATE_PROFILE',
    SET_LOADING: 'SET_LOADING',
};

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

// Reducer
const userReducer = (state, action) => {
    switch (action.type) {
        case USER_ACTIONS.LOGIN:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case USER_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case USER_ACTIONS.UPDATE_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload },
            };
        case USER_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
};

// Provider component
export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('quizUser');
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    dispatch({ type: USER_ACTIONS.LOGIN, payload: userData });
                } else {
                    dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
                }
            } catch (error) {
                console.error('Error loading user from localStorage:', error);
                dispatch({ type: USER_ACTIONS.SET_LOADING, payload: false });
            }
        };

        loadUser();
    }, []);

    // Actions
    const login = (userData) => {
        try {
            localStorage.setItem('quizUser', JSON.stringify(userData));
            dispatch({ type: USER_ACTIONS.LOGIN, payload: userData });
        } catch (error) {
            console.error('Error saving user to localStorage:', error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('quizUser');
            dispatch({ type: USER_ACTIONS.LOGOUT });
        } catch (error) {
            console.error('Error removing user from localStorage:', error);
        }
    };

    const updateProfile = (profileData) => {
        try {
            const updatedUser = { ...state.user, ...profileData };
            localStorage.setItem('quizUser', JSON.stringify(updatedUser));
            dispatch({ type: USER_ACTIONS.UPDATE_PROFILE, payload: profileData });
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    const value = {
        ...state,
        login,
        logout,
        updateProfile,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserContext;
