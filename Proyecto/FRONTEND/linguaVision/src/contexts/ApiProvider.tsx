import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthData {
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

interface ApiContextType {
  authData: AuthData;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData>({});

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      setAuthData({
        token: data.token,
        user: data.user
      });
      
      localStorage.setItem('authToken', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      const data = await response.json();
      
      // Opcional: auto-login después del registro
      await login(email, password);
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    setAuthData({});
    localStorage.removeItem('authToken');
  };

  const isAuthenticated = !!authData.token;

  return (
    <ApiContext.Provider value={{ 
      authData, 
      login, 
      register,
      logout, 
      isAuthenticated 
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};