import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import MealPlanner from './components/MealPlanner';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);

        const { data: { subscription }, error: subscriptionError } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        if (subscriptionError) throw subscriptionError;
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="App">
      {!session ? (
        <Auth />
      ) : (
        <div className="app-container">
          <header className="app-header">
            <h1>AI Meal Planner</h1>
            <button
              className="sign-out-button"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </header>
          <MealPlanner />
        </div>
      )}
    </div>
  );
}

export default App; 