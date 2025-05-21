import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './MealPlanner.css';

const dietaryPreferences = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Diabetic',
  'Keto',
  'Paleo',
  'Mediterranean',
  'Low-Carb',
  'Low-Fat',
  'Balanced'
];

const MealPlanner = () => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);

  const handlePreferenceToggle = (preference) => {
    setSelectedPreferences(prev =>
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    );
  };

  const generateMealPlan = async () => {
    if (selectedPreferences.length === 0) {
      alert('Please select at least one dietary preference');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: selectedPreferences,
          userId: user.id,
        }),
      });

      const data = await response.json();
      setMealPlan(data.mealPlan);
      setShoppingList(data.shoppingList);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meal-planner-container">
      <div className="preferences-section">
        <h2>Select Your Dietary Preferences</h2>
        <div className="preferences-grid">
          {dietaryPreferences.map(preference => (
            <button
              key={preference}
              className={`preference-button ${
                selectedPreferences.includes(preference) ? 'selected' : ''
              }`}
              onClick={() => handlePreferenceToggle(preference)}
            >
              {preference}
            </button>
          ))}
        </div>
        <button
          className="generate-button"
          onClick={generateMealPlan}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>
      </div>

      {mealPlan && (
        <div className="meal-plan-section">
          <h2>Your Weekly Meal Plan</h2>
          <div className="meal-plan-grid">
            {Object.entries(mealPlan).map(([day, meals]) => (
              <div key={day} className="day-plan">
                <h3>{day}</h3>
                <div className="meals">
                  <div className="meal">
                    <h4>Breakfast</h4>
                    <p>{meals.breakfast}</p>
                  </div>
                  <div className="meal">
                    <h4>Lunch</h4>
                    <p>{meals.lunch}</p>
                  </div>
                  <div className="meal">
                    <h4>Dinner</h4>
                    <p>{meals.dinner}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {shoppingList.length > 0 && (
        <div className="shopping-list-section">
          <h2>Shopping List</h2>
          <ul className="shopping-list">
            {shoppingList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MealPlanner; 