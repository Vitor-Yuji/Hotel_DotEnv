import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configuração do axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
axios.defaults.baseURL = API_BASE_URL;

// Estados do contexto
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Tipos de ações
const AuthActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  VERIFY_TOKEN_SUCCESS: 'VERIFY_TOKEN_SUCCESS',
  VERIFY_TOKEN_FAILURE: 'VERIFY_TOKEN_FAILURE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
    case AuthActionTypes.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case AuthActionTypes.LOGIN_SUCCESS:
    case AuthActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.LOGIN_FAILURE:
    case AuthActionTypes.REGISTER_FAILURE:
    case AuthActionTypes.VERIFY_TOKEN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AuthActionTypes.VERIFY_TOKEN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

// Contexto
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configurar token no axios
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Verificar token ao carregar a aplicação
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('/auth/verify-token');
          dispatch({
            type: AuthActionTypes.VERIFY_TOKEN_SUCCESS,
            payload: { user: response.data.dados.usuario }
          });
        } catch (error) {
          dispatch({
            type: AuthActionTypes.VERIFY_TOKEN_FAILURE,
            payload: 'Token inválido'
          });
        }
      } else {
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
      }
    };

    verifyToken();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    dispatch({ type: AuthActionTypes.LOGIN_START });
    
    try {
      const response = await axios.post('/auth/login', { email, senha });
      
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {
          user: response.data.dados.usuario,
          token: response.data.dados.token
        }
      });
      
      toast.success('Login realizado com sucesso!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || 'Erro ao fazer login';
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Função de registro
  const register = async (userData) => {
    dispatch({ type: AuthActionTypes.REGISTER_START });
    
    try {
      const response = await axios.post('/auth/register', userData);
      
      dispatch({
        type: AuthActionTypes.REGISTER_SUCCESS,
        payload: {
          user: response.data.dados.usuario,
          token: response.data.dados.token
        }
      });
      
      toast.success('Conta criada com sucesso!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || 'Erro ao criar conta';
      dispatch({
        type: AuthActionTypes.REGISTER_FAILURE,
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Função de logout
  const logout = () => {
    dispatch({ type: AuthActionTypes.LOGOUT });
    toast.success('Logout realizado com sucesso!');
  };

  // Função para limpar erros
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData) => {
    dispatch({
      type: AuthActionTypes.VERIFY_TOKEN_SUCCESS,
      payload: { user: { ...state.user, ...userData } }
    });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
