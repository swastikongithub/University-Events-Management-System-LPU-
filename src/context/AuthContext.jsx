import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock users database
const MOCK_USERS = {
  '12000001': { id: '1', role: 'student', name: 'Rahul Kumar', regNo: '12000001' },
  '12000002': { id: '2', role: 'student', name: 'Priya Singh', regNo: '12000002' },
  'ORG001': { id: '3', role: 'organizer', name: 'Cultural Board', regNo: 'ORG001' },
  'EMP001': { id: '4', role: 'teacher', name: 'Dr. Anita Sharma', regNo: 'EMP001' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent mock session
    const stored = localStorage.getItem('lpu_event_session');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (regNo, password) => {
    // Mock login logic - accept any password for demo, just check user exists
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS[regNo];
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('lpu_event_session', JSON.stringify(foundUser));
          resolve(foundUser);
        } else {
          reject(new Error('Invalid Registration Number / Uni ID'));
        }
      }, 500); // Fake network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lpu_event_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
