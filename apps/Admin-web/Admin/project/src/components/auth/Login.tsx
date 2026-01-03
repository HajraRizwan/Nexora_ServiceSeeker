import React, { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ForgotPassword from './ForgotPassword';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    
    if (!success) {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#19034d' }}>
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#05f51d' }}>
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#19034d' }}>Admin Panel</h1>
          <p className="text-gray-600 mt-1 text-sm">Sign in to manage your platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
              style={{ focusRingColor: '#05f51d' }}
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 pr-10"
                style={{ focusRingColor: '#05f51d' }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:opacity-90 focus:ring-4 focus:ring-green-200 disabled:opacity-50"
            style={{ backgroundColor: '#05f51d' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setShowForgotPassword(true)}
            className="text-xs hover:underline transition-colors" 
            style={{ color: '#19034d' }}
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">Demo Credentials:</p>
          <p className="text-xs text-gray-800 text-center font-mono mt-1">admin@gmail.com / Hem@admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;