import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Special case for test user
      if (formData.email === 'admin@30praum.com') {
        await login(formData.email);
      } else {
        await login(formData.email, formData.password);
      }

      // Redirect to the attempted URL or dashboard
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Falha no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="px-6 pt-8">
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Bem-vindo de volta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Por favor, faça login na sua conta
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Digite seu e-mail"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Digite sua senha"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Lembrar-me
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            Esqueceu a senha?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full rounded-lg bg-purple-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="border-t bg-gray-50 px-6 py-4">
        <p className="text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <a
            href="#"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;