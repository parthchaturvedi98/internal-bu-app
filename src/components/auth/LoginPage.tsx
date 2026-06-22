import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../lib/auth';

export default function LoginPage() {
  const { instance } = useMsal();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await instance.loginPopup(loginRequest);
      const email = result.account?.username ?? '';
      if (!email.toLowerCase().endsWith('@hcltech.com')) {
        setError('Access is restricted to @hcltech.com accounts.');
        await instance.logoutPopup();
      }
    } catch {
      setError('Sign-in failed or was cancelled. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">BU Tracker</h1>
            <p className="text-sm text-gray-500 mt-1">Internal account tracking for HCL Tech</p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in with Microsoft'}
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">
            Use your @hcltech.com account
          </p>
        </div>
      </div>
    </div>
  );
}
