
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  canBeStaff: boolean;
  isEmailConfirmed: boolean;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  registerUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  registerUser: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      try {
        const response = await fetch(import.meta.env.VITE_API_URL +"/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
          console.log("Auth check successful:", userData);
        } else {
          console.error("Auth check failed:", response.status);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    if (localStorage.getItem("token")) {
      checkAuth();
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL +"/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          setIsAuthenticated(true);
          // Fetch user data after successful login
          const userResponse = await fetch(import.meta.env.VITE_API_URL +"/api/auth/me", {
            headers: {
              Authorization: `Bearer ${data.token}`,
              "Content-Type": "application/json"
            }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          }
          return { success: true };
        }
      }
      
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || "Login failed" 
      };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: "Network error. Please try again." 
      };
    }
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.setItem("isAuthenticated", false);
    setIsAuthenticated(false);
    setUser(null);
  };
  
  const registerUser = async (email: string, password: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL +"/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        return { success: true };
      }
      
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.message || "Registration failed" 
      };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        message: "Network error. Please try again." 
      };
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user,
      login, 
      logout,
      registerUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
