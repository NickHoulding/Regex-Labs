import queryOllama from './queryOllama.js';
import { Modal } from './components/Modal.js';
import { TestCaseManager } from './components/TestCaseManager.js';
import { Loader } from './components/Loader.js';

/**
 * Regex Labs - Main Application Script
 * 
 * Handles user interactions, test case generation, and regex evaluation
 * for the Regex Labs application interface.
 */

// DOM Element references
const promptInput = document.getElementById('prompt-input');
const regexInput = document.getElementById('regex-input');
const errorMessage = document.getElementById('error-message');
const testCasesContainer = document.getElementById('test-cases-container');
const copyButton = document.getElementById('copy-button');
const resultsContainer = document.getElementById('results-container');
const actionButton = document.getElementById('action-button');

// Component instances
const modal = new Modal();
const testCaseManager = new TestCaseManager(testCasesContainer);

/**
 * Checks if the Ollama service is running locally
 * 
 * @returns {Promise<boolean>} - True if Ollama is running, false otherwise
 */
async function checkOllamaStatus() {
    try {
        const response = await fetch('http://localhost:11434/api/tags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Ollama check failed:', error);
        return false;
    }
}

/**
 * Shows a warning modal if Ollama is not detected
 */
function showOllamaWarning() {
    modal.showWarning(
        "Regex Lab requires Ollama to generate test cases using AI. " +
        "Please start the Ollama service on your system and reload this page.",
        "Ollama Not Detected"
    );
}

/**
 * Displays generated regex test cases and transitions the UI
 */
function showTestCaseResults() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    
    errorMessage.style.display = 'none';
    
    resultsContainer.classList.remove('hidden');
    testCaseManager.renderTestCases();
    
    // Animate height transition
    const height = resultsContainer.scrollHeight;
    resultsContainer.style.height = '0';
    
    void resultsContainer.offsetHeight; // Force reflow
    
    resultsContainer.classList.add('visible');
    resultsContainer.style.height = height + 'px';
    
    setTimeout(() => {
        resultsContainer.style.height = 'auto';
    }, 350);
    
    // Change action button to reset mode
    actionButton.textContent = 'Reset';
    actionButton.classList.add('clear-button');
}

/**
 * Updates the action button's enabled state based on input
 */
function updateActionButtonState() {
    if (actionButton.textContent === 'Create Tests') {
        actionButton.disabled = promptInput.value.trim() === '';
    }
}

/**
 * Clears all inputs and resets the UI to initial state
 */
function clearAll() {
    promptInput.value = '';
    regexInput.value = '';
    errorMessage.style.display = 'none';
    
    // Animate results container collapse
    resultsContainer.style.height = resultsContainer.scrollHeight + 'px';
    
    void resultsContainer.offsetHeight; // Force reflow
    
    resultsContainer.style.height = '0';
    resultsContainer.classList.remove('visible');
    
    // Collapse cheatsheet if expanded
    const cheatsheetContainer = document.getElementById('cheatsheet-container');
    const cheatsheetButton = document.getElementById('cheatsheet-button');
    const dropdownArrow = cheatsheetButton.querySelector('.dropdown-arrow');
    
    if (cheatsheetContainer.classList.contains('expanded')) {
        cheatsheetContainer.classList.remove('expanded');
        cheatsheetButton.classList.remove('expanded');
        cheatsheetButton.setAttribute('aria-expanded', 'false');
        dropdownArrow.classList.remove('open');
    }
    
    // Complete UI reset after animation
    setTimeout(() => {
        testCaseManager.clearTestCases();
        
        resultsContainer.classList.add('hidden');
        resultsContainer.style.height = '';
    }, 350);
    
    // Reset action button
    actionButton.textContent = 'Create Tests';
    actionButton.classList.remove('clear-button');
    
    updateActionButtonState();
}

/**
 * Updates the copy button's enabled state based on regex input
 */
function updateCopyButtonState() {
    copyButton.disabled = regexInput.value.trim() === '';
}

/**
 * Evaluates the current regex pattern against test cases
 * Updates display with matches and capture groups
 */
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

/**
 * Toggles the cheatsheet dropdown visibility
 * 
 * @param {HTMLElement} cheatsheetContainer - The cheatsheet content container
 * @param {HTMLElement} cheatsheetButton - The toggle button
 * @param {HTMLElement} dropdownArrow - The dropdown indicator element
 */
function toggleCheatsheet(cheatsheetContainer, cheatsheetButton, dropdownArrow) {
    const isExpanded = cheatsheetContainer.classList.contains('expanded');
    
    cheatsheetButton.setAttribute('aria-expanded', !isExpanded);
    dropdownArrow.classList.toggle('open');
    cheatsheetButton.classList.toggle('expanded', !isExpanded);
    
    if (isExpanded) {
        cheatsheetContainer.classList.remove('expanded');
    } else {
        cheatsheetContainer.classList.add('expanded');
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    actionButton.textContent = 'Create Tests';
    actionButton.classList.remove('clear-button');
    
    updateCopyButtonState();
    updateActionButtonState();
    
    resultsContainer.classList.add('hidden');
    resultsContainer.classList.remove('visible');

    // Set up cheatsheet toggle
    const cheatsheetButton = document.getElementById('cheatsheet-button');
    const cheatsheetContainer = document.getElementById('cheatsheet-container');
    const dropdownArrow = cheatsheetButton.querySelector('.dropdown-arrow');
    
    cheatsheetButton.addEventListener('click', () => {
        toggleCheatsheet(cheatsheetContainer, cheatsheetButton, dropdownArrow);
    });

    // Check if Ollama is running
    const ollamaRunning = await checkOllamaStatus();
    if (!ollamaRunning) {
        showOllamaWarning();
    }
});

// Event listeners
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
            // Show loading indicator
            actionButton.disabled = true;
            actionButton.textContent = '';
            const loader = document.createElement('loader-custom');
            actionButton.appendChild(loader);
            
            // Query AI model for test cases
            const result = await queryOllama(prompt);
            console.log('Raw API response:', result);
            
            // Process the response
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
            
            // Fall back to empty test suite if response is invalid
            if (!testSuiteData) {
                console.error('Invalid response format, using fallback data');
                testSuiteData = { testCases: [] };
            }
            
            console.log('Final testSuite data:', testSuiteData);
            
            // Update test cases in the manager
            const testCases = Array.isArray(testSuiteData.testCases) ? testSuiteData.testCases : [];
            testCaseManager.setTestCases(testCases);
            
            // Reset button state
            actionButton.removeChild(loader);
            actionButton.textContent = 'Create Tests';
            actionButton.disabled = false;

            // Show test case results
            showTestCaseResults();
        } catch (error) {
            console.error('Failed to query Ollama:', error);
            alert(`Error querying AI model: ${error.message}`);
            
            // Reset button state on error
            const loader = actionButton.querySelector('loader-custom');
            if (loader) {
                actionButton.removeChild(loader);
            }
            actionButton.textContent = 'Create Tests';
            actionButton.disabled = false;
        }
    } else {
        // Show reset confirmation
        modal.showReset(
            'This will clear your prompt, pattern, and all test cases. This action cannot be undone.',
            clearAll,
            'Reset Everything?'
        );
    }
});

// Copy button click handler
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

// Input change event handlers
regexInput.addEventListener('input', () => {
    evaluateRegex();
    updateCopyButtonState();
});

promptInput.addEventListener('input', () => {
    updateActionButtonState();
});
