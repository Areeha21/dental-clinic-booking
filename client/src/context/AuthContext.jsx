import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Wrap the whole app with this so any component can ask
// "who is logged in?" without passing props everywhere.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On page load/refresh, check if we already have a saved login
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Shortcut so components can just write: const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
