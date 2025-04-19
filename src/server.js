import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRegexTestCases } from './ollamaService.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        const result = await generateRegexTestCases(prompt);
        
        res.json({ result });
    } catch (error) {
        console.error('Error querying Ollama:', error);
        res.status(500).json({ error: 'Failed to query AI model' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});