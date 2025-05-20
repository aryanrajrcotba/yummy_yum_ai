import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import axios from 'axios';

export default function Dashboard({ user }) {
  const [diet, setDiet] = useState('vegan');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlan() {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('plan')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.log('No saved plan or error:', error.message);
      } else if (data) {
        setPlan(data.plan);
      }
    }

    fetchPlan();
  }, [user.id]);

  async function generatePlan() {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/generate-plan', { diet });
      const generatedPlan = response.data.plan;

      setPlan(generatedPlan);

      const { error } = await supabase.from('meal_plans').insert({
        user_id: user.id,
        diet,
        plan: generatedPlan,
      });

      if (error) {
        setError('Failed to save meal plan.');
      }
    } catch (err) {
      setError('Failed to generate meal plan.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Welcome, {user.email}</h2>
      <button onClick={logout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      <div>
        <label>Select your diet preference: </label>
        <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
          <option value="diabetic">Diabetic</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="paleo">Paleo</option>
        </select>
        <button onClick={generatePlan} disabled={loading} style={{ marginLeft: 10 }}>
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {plan && (
        <div style={{ whiteSpace: 'pre-wrap', marginTop: 20, background: '#f0f0f0', padding: 15, borderRadius: 8 }}>
          <h3>Your Weekly Meal Plan</h3>
          <p>{plan}</p>
        </div>
      )}
    </div>
  );
}
