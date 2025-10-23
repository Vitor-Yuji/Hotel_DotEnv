import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Calendar, CreditCard, Settings } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bem-vindo, {user?.nome}!
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo da sua conta e atividades recentes.
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Informações do Perfil</h2>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium text-gray-900">{user?.nome}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <Mail className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>

          {user?.telefone && (
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 rounded-full p-2">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium text-gray-900">{user.telefone}</p>
              </div>
            </div>
          )}

          {user?.data_nascimento && (
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Nascimento</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.data_nascimento).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}

          {user?.cpf && (
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 rounded-full p-2">
                <CreditCard className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">CPF</p>
                <p className="font-medium text-gray-900">{user.cpf}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900 mb-1">Nova Reserva</h3>
            <p className="text-sm text-gray-600">Fazer uma nova reserva</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900 mb-1">Minhas Reservas</h3>
            <p className="text-sm text-gray-600">Ver reservas existentes</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900 mb-1">Editar Perfil</h3>
            <p className="text-sm text-gray-600">Atualizar informações</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">Conta criada</p>
              <p className="text-xs text-gray-500">
                {user?.timestamp ? new Date(user.timestamp).toLocaleDateString('pt-BR') : 'Data não disponível'}
              </p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Concluído
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Último login</p>
              <p className="text-xs text-gray-500">Hoje</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Ativo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
