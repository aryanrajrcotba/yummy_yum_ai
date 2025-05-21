const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const { preferences, userId } = req.body;

    const prompt = `Create a weekly meal plan for someone with the following dietary preferences: ${preferences.join(', ')}. 
    Include breakfast, lunch, and dinner for each day of the week. Also provide a shopping list for all ingredients needed.
    Format the response as a JSON object with the following structure:
    {
      "mealPlan": {
        "Monday": { "breakfast": "", "lunch": "", "dinner": "" },
        "Tuesday": { "breakfast": "", "lunch": "", "dinner": "" },
        ...
      },
      "shoppingList": ["item1", "item2", ...]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
    });

    const response = JSON.parse(completion.choices[0].message.content);
    res.json(response);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 