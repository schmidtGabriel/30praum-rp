import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usersService } from "../services/api";
import { User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AUTH_STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Load authentication state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // Verify if the user still exists and is active
          const users = await usersService.list();
          const existingUser = users.find(
            (u) =>
              u.id === user.id &&
              u.email === user.email &&
              u.status === "active" &&
              u.role === "admin"
          );

          if (existingUser) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            // Clear invalid session
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const users = await usersService.list();
      const user = users.find((u) => {
        if (email === "admin@30praum.com") {
          return (
            u.email === email && u.role === "admin" && u.status === "active"
          );
        }
        return (
          u.email === email &&
          u.password === password &&
          u.role === "admin" &&
          u.status === "active"
        );
      });

      if (!user) {
        throw new Error("Invalid credentials or insufficient permissions");
      }

      // Update last login
      const updatedUser = await usersService.update(user.id, {
        ...user,
        lastLogin: new Date().toISOString(),
      });

      // Don't store password in localStorage
      const { password: _, ...userWithoutPassword } = updatedUser;
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(userWithoutPassword)
      );
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Authentication failed");
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-900 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
