import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, CreditCard, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch('senha');

  const onSubmit = async (data) => {
    // Remove confirmação de senha dos dados enviados
    const { confirmarSenha, ...userData } = data;
    
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              faça login em uma conta existente
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Nome */}
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  className={`input-field pl-10 ${errors.nome ? 'input-error' : ''}`}
                  placeholder="Seu nome completo"
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres'
                    }
                  })}
                />
              </div>
              {errors.nome && (
                <p className="form-error">{errors.nome.message}</p>
              )}
            </div>

            {/* Pronome */}
            <div className="form-group">
              <label htmlFor="pronome" className="form-label">
                Pronome (opcional)
              </label>
              <select
                id="pronome"
                className="input-field"
                {...register('pronome')}
              >
                <option value="">Selecione um pronome</option>
                <option value="ele/dele">ele/dele</option>
                <option value="ela/dela">ela/dela</option>
                <option value="elu/delu">elu/delu</option>
                <option value="outro">outro</option>
              </select>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="seu@email.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="form-group">
              <label htmlFor="telefone" className="form-label">
                Telefone (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="telefone"
                  type="tel"
                  autoComplete="tel"
                  className={`input-field pl-10 ${errors.telefone ? 'input-error' : ''}`}
                  placeholder="(11) 99999-9999"
                  {...register('telefone', {
                    pattern: {
                      value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                      message: 'Telefone deve estar no formato (XX) XXXXX-XXXX'
                    }
                  })}
                />
              </div>
              {errors.telefone && (
                <p className="form-error">{errors.telefone.message}</p>
              )}
            </div>

            {/* Data de nascimento */}
            <div className="form-group">
              <label htmlFor="data_nascimento" className="form-label">
                Data de nascimento (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="data_nascimento"
                  type="date"
                  className={`input-field pl-10 ${errors.data_nascimento ? 'input-error' : ''}`}
                  {...register('data_nascimento')}
                />
              </div>
            </div>

            {/* CPF */}
            <div className="form-group">
              <label htmlFor="cpf" className="form-label">
                CPF (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="cpf"
                  type="text"
                  className={`input-field pl-10 ${errors.cpf ? 'input-error' : ''}`}
                  placeholder="12345678901"
                  maxLength="11"
                  {...register('cpf', {
                    pattern: {
                      value: /^\d{11}$/,
                      message: 'CPF deve ter 11 dígitos'
                    }
                  })}
                />
              </div>
              {errors.cpf && (
                <p className="form-error">{errors.cpf.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${errors.senha ? 'input-error' : ''}`}
                  placeholder="Sua senha"
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="form-error">{errors.senha.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="form-group">
              <label htmlFor="confirmarSenha" className="form-label">
                Confirmar senha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${errors.confirmarSenha ? 'input-error' : ''}`}
                  placeholder="Confirme sua senha"
                  {...register('confirmarSenha', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: value =>
                      value === password || 'As senhas não coincidem'
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="form-error">{errors.confirmarSenha.message}</p>
              )}
            </div>

            {/* Erro geral */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Botão de submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar conta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-500">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-500">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
