/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const savedUser = localStorage.getItem('pscrm_current_user');
        if (savedUser) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCurrentUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
            }
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Look up in mock users
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('pscrm_users')) || mockUsers;
        } catch {
            users = mockUsers;
        }

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Don't save password in current user state
            const { password: _, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);
            localStorage.setItem('pscrm_current_user', JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('pscrm_current_user');
    };

    const registerCitizen = (userData) => {
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('pscrm_users')) || mockUsers;
        } catch {
            users = mockUsers;
        }

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Email already registered' };
        }

        const newUser = {
            id: `c_${Date.now()}`,
            ...userData,
            role: 'citizen'
        };

        users.push(newUser);
        localStorage.setItem('pscrm_users', JSON.stringify(users));

        // Auto login
        const { password: _, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('pscrm_current_user', JSON.stringify(userWithoutPassword));

        return { success: true, user: userWithoutPassword };
    };

    const value = {
        currentUser,
        login,
        logout,
        registerCitizen,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
