import ollama from 'ollama';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { testSuite } from './aiSchemas.js';

/**
 * Generates test cases for a regex pattern using Ollama AI
 * 
 * Uses the specified AI model to generate diverse and relevant test cases
 * for a given regex use case described in natural language.
 * 
 * @param {string} prompt - User description of the regex use case
 * @returns {Promise<string>} - JSON string of test cases from the AI model
 * @throws {Error} - If prompt is empty or API call fails
 */
export async function generateRegexTestCases(prompt) {
    if (!prompt) {
        throw new Error('Prompt is required');
    }
    
    const enhancedPrompt = `Generate a comprehensive set of test cases for a regular expression based on the following user-provided use case: ${prompt}. Include examples of full matches, partial matches, and examples that do not match at all. Each test case should only include one string. Ensure the test cases are diverse and relevant to the use case. Avoid overly simplistic or repetitive strings. The test cases MUST be realistic.`;
    
    const response = await ollama.chat({
        model: 'gemma3:1b',
        messages: [
            { role: 'user', content: enhancedPrompt }
        ],
        format: zodToJsonSchema(testSuite),
    });
    
    return response.message.content.trim();
}
