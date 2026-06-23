import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const setCurrentEmail = useAppStore((s) => s.setCurrentEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.toLowerCase().trim();
    if (!trimmed.endsWith('@hcltech.com')) {
      setError('Please enter your @hcltech.com email address.');
      return;
    }
    setCurrentEmail(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">BU Tracker</h1>
            <p className="text-sm text-gray-500 mt-1">Internal account tracking for HCL Tech</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Your work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@hcltech.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
                autoFocus
                required
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
