import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAuth() {
    setLoading(true);
    setError(null);

    try {
      let res;
      if (isLogin) {
        res = await supabase.auth.signInWithPassword({ email, password });
      } else {
        res = await supabase.auth.signUp({ email, password });
      }

      if (res.error) {
        setError(res.error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: 'auto', padding: 20 }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <button onClick={handleAuth} disabled={loading} style={{ width: '100%', padding: 10 }}>
        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p style={{ marginTop: 10 }}>
        {isLogin ? 'New user?' : 'Already have an account?'}
        <button onClick={() => setIsLogin(!isLogin)} style={{ marginLeft: 8, cursor: 'pointer' }}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}
