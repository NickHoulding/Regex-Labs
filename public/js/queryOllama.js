/**
 * Query the Ollama API through our server endpoint
 * @param {string} prompt - User prompt for regex generation
 * @returns {Promise<Object|string>} - The test suite with regex pattern and test cases
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
