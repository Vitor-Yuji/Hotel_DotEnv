import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Calendar, CreditCard, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      nome: user?.nome || '',
      pronome: user?.pronome || '',
      email: user?.email || '',
      telefone: user?.telefone || '',
      data_nascimento: user?.data_nascimento || '',
      cpf: user?.cpf || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put('/usuarios/profile/me', data);
      updateUser(response.data.dados.usuario);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || 'Erro ao atualizar perfil';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setLoading(true);
    try {
      await axios.put('/usuarios/profile/me', { senha: data.novaSenha });
      toast.success('Senha alterada com sucesso!');
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || 'Erro ao alterar senha';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.nome}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`input-field pl-10 ${errors.nome ? 'input-error' : ''}`}
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
              <label className="form-label">Pronome</label>
              <select className="input-field" {...register('pronome')}>
                <option value="">Selecione um pronome</option>
                <option value="ele/dele">ele/dele</option>
                <option value="ela/dela">ela/dela</option>
                <option value="elu/delu">elu/delu</option>
                <option value="outro">outro</option>
              </select>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`input-field pl-10 ${errors.email ? 'input-error' : ''}`}
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
              <label className="form-label">Telefone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
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
              <label className="form-label">Data de nascimento</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="input-field pl-10"
                  {...register('data_nascimento')}
                />
              </div>
            </div>

            {/* CPF */}
            <div className="form-group">
              <label className="form-label">CPF</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar alterações
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h2>
          
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            {/* Nova senha */}
            <div className="form-group">
              <label className="form-label">Nova senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Eye className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.novaSenha ? 'input-error' : ''}`}
                  {...register('novaSenha', {
                    required: 'Nova senha é obrigatória',
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
              {errors.novaSenha && (
                <p className="form-error">{errors.novaSenha.message}</p>
              )}
            </div>

            {/* Confirmar nova senha */}
            <div className="form-group">
              <label className="form-label">Confirmar nova senha</label>
              <input
                type="password"
                className={`input-field ${errors.confirmarNovaSenha ? 'input-error' : ''}`}
                {...register('confirmarNovaSenha', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: value =>
                    value === watch('novaSenha') || 'As senhas não coincidem'
                })}
              />
              {errors.confirmarNovaSenha && (
                <p className="form-error">{errors.confirmarNovaSenha.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Alterando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Alterar senha
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">ID da conta</p>
            <p className="font-medium text-gray-900">{user?.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Membro desde</p>
            <p className="font-medium text-gray-900">
              {user?.timestamp ? new Date(user.timestamp).toLocaleDateString('pt-BR') : 'Data não disponível'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status da conta</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Ativa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
