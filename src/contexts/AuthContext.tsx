
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Sample registered users for testing purposes
const REGISTERED_USERS = [
  { email: "test@gmail.com", password: "password123" },
  { email: "user@gmail.com", password: "userpass" }
];

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registeredUsers: { email: string; password: string }[];
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
  registerUser: async () => ({ success: false }),
  registeredUsers: REGISTERED_USERS,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Check if user was previously authenticated from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });
  
  // Store registered users for our test
  const [registeredUsers, setRegisteredUsers] = useState(REGISTERED_USERS);
  
  const login = async (email: string, password: string) => {
    // Check if the user exists and password matches
    const user = registeredUsers.find(user => user.email === email);
    
    if (user && user.password === password) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return { success: true };
    } else {
      return { 
        success: false, 
        message: "Invalid email or password" 
      };
    }
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
  };
  
  const registerUser = async (email: string, password: string) => {
    // Validate email domain - allow only gmail.com
    if (!email.endsWith("@gmail.com")) {
      return { 
        success: false, 
        message: "Invalid email" 
      };
    }
    
    // Check if email already exists
    if (registeredUsers.some(user => user.email === email)) {
      return { 
        success: false, 
        message: "Email is already registered" 
      };
    }
    
    // Register the new user
    setRegisteredUsers([...registeredUsers, { email, password }]);
    return { success: true };
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout,
      registerUser,
      registeredUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};
