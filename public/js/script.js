import queryOllama from './queryOllama.js';
import { Modal } from './components/Modal.js';
import { TestCaseManager } from './components/TestCaseManager.js';
import { Loader } from './components/Loader.js';  // Add Loader import

const promptInput = document.getElementById('prompt-input');
const regexInput = document.getElementById('regex-input');
const errorMessage = document.getElementById('error-message');
const testCasesContainer = document.getElementById('test-cases-container');
const copyButton = document.getElementById('copy-button');
const resultsContainer = document.getElementById('results-container');
const actionButton = document.getElementById('action-button');

const modal = new Modal();
const testCaseManager = new TestCaseManager(testCasesContainer);

// Create a function to check if Ollama is running
async function checkOllamaStatus() {
    try {
        // Make a simple request to the Ollama API
        const response = await fetch('http://localhost:11434/api/tags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return true; // Ollama is running
    } catch (error) {
        console.error('Ollama check failed:', error);
        return false; // Ollama is not running
    }
}

// Function to show Ollama warning modal
function showOllamaWarning() {
    modal.showWarning(
        "Regex Lab requires Ollama to generate test cases using AI. " +
        "Please start the Ollama service on your system and reload this page.",
        "Ollama Not Detected"
        // Non-blocking parameter removed
    );
}

// Check Ollama status when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    actionButton.textContent = 'Create Tests';
    actionButton.classList.remove('clear-button');
    
    updateCopyButtonState();
    updateActionButtonState();
    
    resultsContainer.classList.add('hidden');
    resultsContainer.classList.remove('visible');

    // Check if Ollama is running
    const ollamaRunning = await checkOllamaStatus();
    if (!ollamaRunning) {
        showOllamaWarning();
    }
});

actionButton.addEventListener('click', async function() {
    if (actionButton.textContent === 'Create Tests') {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        // Check Ollama status before making a request
        const ollamaRunning = await checkOllamaStatus();
        if (!ollamaRunning) {
            showOllamaWarning();
            return;
        }

        try {
            actionButton.disabled = true;
            actionButton.textContent = '';

            const loader = document.createElement('loader-custom');
            actionButton.appendChild(loader);
            
            const result = await queryOllama(prompt);
            console.log('Raw API response:', result);
            
            let testSuiteData;
            if (typeof result === 'string') {
                try {
                    testSuiteData = JSON.parse(result);
                    console.log('Parsed JSON from string:', testSuiteData);
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                    testSuiteData = null;
                }
            } else {
                testSuiteData = result;
            }
            
            if (!testSuiteData) {
                console.error('Invalid response format, using fallback data');
                testSuiteData = {
                    testCases: []
                };
            }
            
            console.log('Final testSuite data:', testSuiteData);
            
            const testCases = Array.isArray(testSuiteData.testCases) ? testSuiteData.testCases : [];
            testCaseManager.setTestCases(testCases);
            
            actionButton.removeChild(loader);
            actionButton.textContent = 'Create Tests';
            actionButton.disabled = false;

            generateRegex();
        } catch (error) {
            console.error('Failed to query Ollama:', error);
            alert(`Error querying AI model: ${error.message}`);
            
            const loader = actionButton.querySelector('loader-custom');
            if (loader) {
                actionButton.removeChild(loader);
            }
            actionButton.textContent = 'Create Tests';
            actionButton.disabled = false;
            return;
        }
    } else {
        modal.showReset(
            'This will clear your prompt, pattern, and all test cases. This action cannot be undone.',
            clearAll,
            'Reset Everything?'
        );
    }
});

function generateRegex() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    
    errorMessage.style.display = 'none';
    
    resultsContainer.classList.remove('hidden');
    testCaseManager.renderTestCases();
    
    const height = resultsContainer.scrollHeight;
    resultsContainer.style.height = '0';
    
    void resultsContainer.offsetHeight;
    
    resultsContainer.classList.add('visible');
    resultsContainer.style.height = height + 'px';
    
    setTimeout(() => {
        resultsContainer.style.height = 'auto';
    }, 350);
    
    actionButton.textContent = 'Reset';
    actionButton.classList.add('clear-button');
}

function updateActionButtonState() {
    if (actionButton.textContent === 'Create Tests') {
        actionButton.disabled = promptInput.value.trim() === '';
    }
}

function clearAll() {
    promptInput.value = '';
    regexInput.value = '';
    errorMessage.style.display = 'none';
    
    resultsContainer.style.height = resultsContainer.scrollHeight + 'px';
    
    void resultsContainer.offsetHeight;
    
    resultsContainer.style.height = '0';
    resultsContainer.classList.remove('visible');
    
    const cheatsheetContainer = document.getElementById('cheatsheet-container');
    const cheatsheetButton = document.getElementById('cheatsheet-button');
    const dropdownArrow = cheatsheetButton.querySelector('.dropdown-arrow');
    
    if (cheatsheetContainer.classList.contains('expanded')) {
        cheatsheetContainer.classList.remove('expanded');
        cheatsheetButton.classList.remove('expanded');
        cheatsheetButton.setAttribute('aria-expanded', 'false');
        dropdownArrow.classList.remove('open');
    }
    
    setTimeout(() => {
        testCaseManager.clearTestCases();
        
        resultsContainer.classList.add('hidden');
        resultsContainer.style.height = '';
    }, 350);
    
    actionButton.textContent = 'Create Tests';
    actionButton.classList.remove('clear-button');
    
    updateActionButtonState();
}

function updateCopyButtonState() {
    copyButton.disabled = regexInput.value.trim() === '';
}

function evaluateRegex() {
    const regexString = regexInput.value;
    
    if (!regexString) {
        testCaseManager.renderTestCases();
        errorMessage.style.display = 'none';
        return;
    }
    
    try {
        const regex = new RegExp(regexString);
        errorMessage.style.display = 'none';
        testCaseManager.renderTestCases(regex);
    } catch (e) {
        errorMessage.style.display = 'block';
        testCaseManager.renderTestCases();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cheatsheetButton = document.getElementById('cheatsheet-button');
    const cheatsheetContainer = document.getElementById('cheatsheet-container');
    const dropdownArrow = cheatsheetButton.querySelector('.dropdown-arrow');
    
    cheatsheetButton.addEventListener('click', function() {
        const isExpanded = cheatsheetContainer.classList.contains('expanded');
        
        cheatsheetButton.setAttribute('aria-expanded', !isExpanded);
        dropdownArrow.classList.toggle('open');
        cheatsheetButton.classList.toggle('expanded', !isExpanded);
        
        if (isExpanded) {
            cheatsheetContainer.classList.remove('expanded');
        } else {
            cheatsheetContainer.classList.add('expanded');
        }
    });
});

copyButton.addEventListener('click', () => {
    const regexValue = regexInput.value;
    
    navigator.clipboard.writeText(regexValue)
        .then(() => {
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            
            setTimeout(() => {
                copyButton.textContent = 'Copy';
                copyButton.classList.remove('copied');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
});

regexInput.addEventListener('input', () => {
    evaluateRegex();
    updateCopyButtonState();
});

promptInput.addEventListener('input', () => {
    updateActionButtonState();
});
