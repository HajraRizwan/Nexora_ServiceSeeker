import React, { useState } from 'react';
import { LogIn, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  title: string;
  apiUrl: string;
  forgotPasswordComponent?: React.FC<{ onBack: () => void }>;
  demoCredentials?: string;
  onLoginSuccess?: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({
  title,
  apiUrl,
  forgotPasswordComponent: ForgotPassword,
  demoCredentials,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword && ForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Invalid email or password');
      } else {
        onLoginSuccess?.(data.user);
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
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
          <h1 className="text-xl font-bold" style={{ color: '#19034d' }}>{title}</h1>
          <p className="text-gray-600 mt-1 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 pr-10"
                placeholder="Enter password"
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

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:opacity-90 focus:ring-4 focus:ring-green-200 disabled:opacity-50"
            style={{ backgroundColor: '#05f51d' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {ForgotPassword && (
          <div className="mt-6 text-center">
            <button onClick={() => setShowForgotPassword(true)} className="text-xs hover:underline transition-colors" style={{ color: '#19034d' }}>
              Forgot your password?
            </button>
          </div>
        )}

        {demoCredentials && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center text-xs text-gray-800 font-mono">
            {demoCredentials}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
