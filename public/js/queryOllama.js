/**
 * Client-side service for querying the Ollama API through server endpoints
 * Handles communication with the backend for regex test case generation
 * 
 * @param {string} prompt - User prompt describing the regex use case
 * @returns {Promise<Object|string>} - Test cases response from the Ollama model
 * @throws {Error} - If the server request fails or returns an error
 */
async function queryOllama(prompt) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response data:', data);
        
        return data.result;
    } catch (error) {
        console.error('Error querying Ollama API:', error);
        throw error;
    }
}

export default queryOllama;
