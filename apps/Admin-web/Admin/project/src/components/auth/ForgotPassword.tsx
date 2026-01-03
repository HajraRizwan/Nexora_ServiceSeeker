import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Mail } from 'lucide-react';
import SuccessModal from '../ui/SuccessModal';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      
      console.log(res.data); // { message, token }
      setShowSuccess(true);
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onBack();
  };
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#19034d' }}>
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#05f51d' }}>
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#19034d' }}>Reset Password</h1>
          <p className="text-gray-600 mt-1 text-sm">Enter your email to receive reset instructions</p>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:opacity-90 focus:ring-4 focus:ring-green-200 disabled:opacity-50"
            style={{ backgroundColor: '#05f51d' }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Email Sent"
        message="Password reset instructions have been sent to your email address."
      />
    </div>
  );
};

export default ForgotPassword;