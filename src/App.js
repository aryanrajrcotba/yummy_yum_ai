import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement API call to get recipes
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Yummy Yum AI</h1>
        <p>Your AI-powered recipe assistant</p>
      </header>
      
      <main className="App-main">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to cook today?"
            className="search-input"
          />
          <button type="submit" className="search-button">
            {loading ? 'Searching...' : 'Find Recipes'}
          </button>
        </form>

        <div className="recipes-container">
          {recipes.length === 0 ? (
            <p className="no-recipes">Enter ingredients or a dish name to get started!</p>
          ) : (
            recipes.map((recipe, index) => (
              <div key={index} className="recipe-card">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 