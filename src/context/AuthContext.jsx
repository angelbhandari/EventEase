import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_USER_KEY = 'eventease_user';
const REGISTERED_USERS_KEY = 'eventease_registered_users';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse auth user from localStorage:', e);
      return null;
    }
  });

  const [authNotice, setAuthNotice] = useState('');

  // Initialize registered users directory if empty
 

  const login = async (email, password, remember = true) => {
    setAuthNotice('');
    const cleanEmail = email.trim().toLowerCase();

    let users = [];
    try {
      const savedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      }
    } catch (e) {
      console.error(e);
    }

    const matched = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === password
    );

    if (matched) {
      const authData = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        phone: matched.phone || '',
        role: matched.role || 'Event Host',
        memberSince: matched.memberSince || 'October 2026',
        avatar:
          matched.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matched.name)}`,
      };

      setUser(authData);
      if (remember) {
        try {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData));
        } catch (e) {
          console.error('Failed to persist auth user:', e);
        }
      }
      return { success: true, user: authData };
    } else {
      const emailExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
     const errorMessage = emailExists
  ? 'Invalid password. Please try again.'
  : 'No account found with this email. Please sign up.';
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    setAuthNotice('');
    const cleanEmail = userData.email.trim().toLowerCase();

    let users = [];
    try {
      const savedUsers = localStorage.getItem(REGISTERED_USERS_KEY);
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      }
    } catch (e) {
      console.error(e);
    }

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.fullName.trim(),
      email: cleanEmail,
      phone: userData.phone ? userData.phone.trim() : '',
      passwordHash: userData.password,
      role: 'Event Host',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        userData.fullName.trim()
      )}`,
    };

    users.push(newUser);
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }

    // Auto-login newly created account
    const authData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      memberSince: newUser.memberSince,
      avatar: newUser.avatar,
    };

    setUser(authData);
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData));
    } catch (e) {
      console.error(e);
    }

    return { success: true, user: authData };
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    authNotice,
    setAuthNotice,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
