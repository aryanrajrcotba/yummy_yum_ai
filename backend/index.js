require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate-plan', async (req, res) => {
  try {
    const { diet } = req.body;
    if (!diet) {
      return res.status(400).json({ error: 'Diet type is required' });
    }
    const prompt = `Generate a detailed 7-day meal plan for a person following a ${diet} diet. For each day, provide breakfast, lunch, and dinner with ingredients and brief recipes.`;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });

    const plan = completion.data.choices[0].message.content;
    res.json({ plan });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
