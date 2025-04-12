import ollama from 'ollama';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { testSuite } from '../schemas/aiSchemas.js';

/**
 * Generates test cases for a regex pattern using Ollama
 * @param {string} prompt - User description of the regex use case
 * @returns {Promise<Object>} - Test cases from the AI model
 */
export async function generateRegexTestCases(prompt) {
    if (!prompt) {
        throw new Error('Prompt is required');
    }
    
    const ollamaPrompt = `Generate a comprehensive set of test cases for a regular expression based on the following user-provided use case: ${prompt}. Include examples of full matches, partial matches, and examples that do not match at all. Each test case should only include one string. Ensure the test cases are diverse and relevant to the use case. Avoid overly simplistic or repetitive strings. The test cases MUST be realistic.`;
    
    const response = await ollama.chat({
        model: 'gemma3:1b',
        messages: [
            { role: 'user', content: ollamaPrompt }
        ],
        format: zodToJsonSchema(testSuite),
    });
    
    return response.message.content.trim();
}
