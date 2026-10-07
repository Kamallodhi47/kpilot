import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function MetaCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Connecting your Meta account...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus(`Failed to connect: ${error}`);
      setTimeout(() => navigate('/dashboard'), 3000);
      return;
    }

    if (code) {
      const token = localStorage.getItem('token');
      fetch('/api/meta/oauth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to exchange token');
        return res.json();
      })
      .then(data => {
        setStatus(`Successfully connected as ${data.account_name}! Redirecting...`);
        setTimeout(() => navigate('/onboarding'), 2000);
      })
      .catch(err => {
        console.error(err);
        setStatus('An error occurred while connecting. Please try again.');
        setTimeout(() => navigate('/dashboard'), 3000);
      });
    } else {
      setStatus('No authorization code found.');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center text-white font-sans p-4">
      <div className="bg-[#1a1a24] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">{status}</h2>
        <p className="text-gray-400 text-sm">Please do not close this window.</p>
      </div>
    </div>
  );
}
