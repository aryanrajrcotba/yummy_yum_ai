import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return <div>{user ? <Dashboard user={user} /> : <AuthPage />}</div>;
}

export default App;
