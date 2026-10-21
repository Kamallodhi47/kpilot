import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function MetaCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('Connecting your Meta account...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description') || searchParams.get('error_reason');

    if (error) {
      const displayErr = errorDescription || error || 'Authorization was cancelled or denied by user.';
      setErrorMessage(displayErr);
      setStatus('Failed to connect Meta account');
      setTimeout(() => navigate('/dashboard'), 4000);
      return;
    }

    if (!code) {
      setErrorMessage('No authorization code was returned from Meta.');
      setStatus('Connection Failed');
      setTimeout(() => navigate('/dashboard'), 4000);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('You must be signed in to connect your Meta account. Please log in first.');
      setStatus('Authentication Required');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    fetch('/api/meta/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code, state })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.detail || data.message || 'Failed to exchange Meta authorization code.');
        }
        return data;
      })
      .then((data) => {
        setIsSuccess(true);
        setStatus(`Successfully connected Meta account: ${data.account_name || 'Account'}!`);
        setTimeout(() => navigate('/dashboard'), 2000);
      })
      .catch((err: any) => {
        console.error('Meta OAuth callback error:', err);
        setErrorMessage(err.message || 'An unexpected error occurred during authorization.');
        setStatus('Connection Error');
        setTimeout(() => navigate('/dashboard'), 4500);
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center text-white font-sans p-4">
      <div className="bg-[#1a1a24] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-purple-500/20 blur-[50px] pointer-events-none" />

        {isSuccess ? (
          <div className="animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">{status}</h2>
            <p className="text-gray-400 text-sm">Redirecting you to your dashboard...</p>
          </div>
        ) : errorMessage ? (
          <div className="animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertCircle className="w-9 h-9" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-rose-300">{status}</h2>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{errorMessage}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div>
            <div className="w-14 h-14 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin mx-auto mb-5" />
            <h2 className="text-lg font-semibold mb-2">{status}</h2>
            <p className="text-gray-400 text-xs">Exchanging secure authorization code with Meta. Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
}
