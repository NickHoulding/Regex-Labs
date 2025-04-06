// DOM elements
const promptInput = document.getElementById('prompt-input');
const regexInput = document.getElementById('regex-input');
const errorMessage = document.getElementById('error-message');
const testCasesContainer = document.getElementById('test-cases-container');
const copyButton = document.getElementById('copy-button');
const resultsContainer = document.getElementById('results-container');

// Get DOM elements
const actionButton = document.getElementById('action-button');

// Handle button click based on current state
actionButton.addEventListener('click', function() {
    if (actionButton.textContent === 'Gen Tests') {
        // Original generate functionality
        generateRegex();
    } else {
        // Show confirmation modal before clearing
        modal.show({
            title: 'Reset Everything?',
            message: 'This will clear your prompt, pattern, and all test cases. This action cannot be undone.',
            confirmText: 'Reset',
            cancelText: 'Cancel',
            onConfirm: clearAll
        });
    }
});

// Function to generate regex (preserve original functionality)
function generateRegex() {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    
    // Generate test cases and prepare content first
    testCases = generateTestCases(prompt);
    regexInput.value = '';
    errorMessage.style.display = 'none';
    
    // Remove hidden class and render content
    resultsContainer.classList.remove('hidden');
    renderTestCases();
    
    // Get the natural height of the content
    const height = resultsContainer.scrollHeight;
    
    // Set initial height to 0
    resultsContainer.style.height = '0';
    
    // Force a reflow
    void resultsContainer.offsetHeight;
    
    // Add visible class and set explicit height
    resultsContainer.classList.add('visible');
    resultsContainer.style.height = height + 'px';
    
    // After animation, set height to auto
    setTimeout(() => {
        resultsContainer.style.height = 'auto';
    }, 350);
    
    // Change button to Reset
    actionButton.textContent = 'Reset';
    actionButton.classList.add('clear-button');
}

// Function to update action button state
function updateActionButtonState() {
    // If the button is in "Gen Tests" mode, disable it when prompt is empty
    if (actionButton.textContent === 'Gen Tests') {
        actionButton.disabled = promptInput.value.trim() === '';
    }
}

// Function to clear all fields
function clearAll() {
    promptInput.value = '';
    regexInput.value = '';
    errorMessage.style.display = 'none';
    
    // Set explicit height before animation
    resultsContainer.style.height = resultsContainer.scrollHeight + 'px';
    
    // Force a reflow
    void resultsContainer.offsetHeight;
    
    // Animate to height 0
    resultsContainer.style.height = '0';
    resultsContainer.classList.remove('visible');
    
    // Close cheat sheet if it's open
    const cheatsheetContainer = document.getElementById('cheatsheet-container');
    const cheatsheetButton = document.getElementById('cheatsheet-button');
    const dropdownArrow = cheatsheetButton.querySelector('.dropdown-arrow');
    
    if (cheatsheetContainer.classList.contains('expanded')) {
        cheatsheetContainer.classList.remove('expanded');
        cheatsheetButton.classList.remove('expanded');
        cheatsheetButton.setAttribute('aria-expanded', 'false');
        dropdownArrow.classList.remove('open');
    }
    
    // Wait for the animation to complete before clearing test cases and adding the hidden class
    setTimeout(() => {
        // Clear test cases
        testCases = [];
        
        // Reset test cases container
        testCasesContainer.innerHTML = '<p class="test-case-placeholder">None yet.</p>';
        
        // Hide the container completely
        resultsContainer.classList.add('hidden');
        resultsContainer.style.height = '';
    }, 350);
    
    // Reset button back to Gen Tests
    actionButton.textContent = 'Gen Tests';
    actionButton.classList.remove('clear-button');
    
    // Update button state
    updateActionButtonState();
}

// Function to update copy button state
function updateCopyButtonState() {
    copyButton.disabled = regexInput.value.trim() === '';
}

// Initialize button states on page load
document.addEventListener('DOMContentLoaded', () => {
    actionButton.textContent = 'Gen Tests';
    actionButton.classList.remove('clear-button');
    
    // Set initial copy button state
    updateCopyButtonState();
    
    // Set initial action button state
    updateActionButtonState();
    
    // Make sure results container is hidden initially
    resultsContainer.classList.add('hidden');
    resultsContainer.classList.remove('visible');
});

// Cheat sheet toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const cheatsheetButton = document.getElementById('cheatsheet-button');
    const cheatsheetContainer = document.getElementById('cheatsheet-container');
    const dropdownArrow = cheatsheetButton.querySelector('.dropdown-arrow');
    
    cheatsheetButton.addEventListener('click', function() {
        // Toggle expanded state
        const isExpanded = cheatsheetContainer.classList.contains('expanded');
        
        // Update button aria-expanded attribute
        cheatsheetButton.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle dropdown arrow
        dropdownArrow.classList.toggle('open');
        
        // Toggle button border radius class
        cheatsheetButton.classList.toggle('expanded', !isExpanded);
        
        // Toggle cheatsheet visibility with animation
        if (isExpanded) {
            cheatsheetContainer.classList.remove('expanded');
        } else {
            cheatsheetContainer.classList.add('expanded');
        }
    });
});

// Remove textarea auto-resize functionality since we're now using an input element
// No need to call autoResizeTextarea for the prompt input anymore
// promptInput.addEventListener('input', () => {
//     autoResizeTextarea(promptInput);
// });
// 
// Initialize textarea height
// autoResizeTextarea(promptInput);

// We can keep the autoResizeTextarea function in case it's used elsewhere
function autoResizeTextarea(textarea) {
    // Save the current value and scrollbar visibility state
    const value = textarea.value;
    const computedStyle = window.getComputedStyle(textarea);
    const maxHeight = parseInt(computedStyle.maxHeight);
    
    // Reset the textarea and hide scrollbar initially
    textarea.style.height = 'auto';
    textarea.style.overflow = 'hidden';
    
    // Set a tiny value to get the smallest height possible
    textarea.value = '';
    const minHeight = textarea.scrollHeight;
    
    // Restore the original value
    textarea.value = value;
    
    // Get the height needed for the content
    const scrollHeight = textarea.scrollHeight;
    
    if (scrollHeight > maxHeight) {
        // Content exceeds max height, set to max and show scrollbar
        textarea.style.height = maxHeight + 'px';
        textarea.style.overflow = 'auto';
    } else {
        // Content fits within max height, auto-resize and hide scrollbar
        textarea.style.height = value ? Math.max(minHeight, scrollHeight) + 'px' : minHeight + 'px';
    }
}

// Store test cases
let testCases = [];

// Mock function to generate test cases based on prompt
function generateTestCases(prompt) {
    // In a real implementation, this would call an AI API
    // For now, we'll use mock data based on common regex scenarios
    
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('email')) {
        return [
            { text: 'user@example.com', expected: true },
            { text: 'invalid-email@', expected: false },
            { text: 'user.name@domain.co.uk', expected: true },
            { text: 'user@domain', expected: false },
            { text: 'user@.com', expected: false },
            { text: '@domain.com', expected: false },
            { text: 'user@domain..com', expected: false },
            { text: 'user@domain.c', expected: false },
            { text: 'user.name+tag@example.com', expected: true },
            { text: 'user@localhost', expected: true }
        ];
    } else if (promptLower.includes('phone') || promptLower.includes('telephone')) {
        return [
            { text: '(123) 456-7890', expected: true },
            { text: '123-456-7890', expected: true },
            { text: '(123) 45-7890', expected: false },
            { text: '(123)456-7890', expected: true },
            { text: '123.456.7890', expected: true },
            { text: '123 456 7890', expected: true },
            { text: '+1 (123) 456-7890', expected: true },
            { text: '(abc) def-ghij', expected: false },
            { text: '123-45-6789', expected: false },
            { text: '456-7890', expected: false }
        ];
    } else if (promptLower.includes('url') || promptLower.includes('website')) {
        return [
            { text: 'https://www.example.com', expected: true },
            { text: 'http://example.com', expected: true },
            { text: 'www.example.com', expected: true },
            { text: 'example.com', expected: true },
            { text: 'https://example', expected: false },
            { text: 'ftp://example.com', expected: true },
            { text: 'https://www.example.com/path?query=string', expected: true },
            { text: 'https://subdomain.example.co.uk/path', expected: true },
            { text: 'invalid url', expected: false },
            { text: 'https:/example.com', expected: false }
        ];
    } else if (promptLower.includes('date')) {
        return [
            { text: '01/01/2023', expected: true },
            { text: '2023-01-01', expected: true },
            { text: '01-Jan-2023', expected: true },
            { text: '1/1/23', expected: true },
            { text: '32/01/2023', expected: false },
            { text: '01/13/2023', expected: false },
            { text: '2023/01/01', expected: true },
            { text: 'January 1, 2023', expected: true },
            { text: '01/01/23', expected: true },
            { text: '01.01.2023', expected: true }
        ];
    } else {
        // Default test cases if the prompt doesn't match any category
        return [
            { text: 'test123', expected: true },
            { text: 'TEST', expected: true },
            { text: '123', expected: true },
            { text: 'test_123', expected: true },
            { text: 'test-123', expected: true },
            { text: 'test.123', expected: true },
            { text: 'test@123', expected: true },
            { text: '', expected: false },
            { text: 'Test 123', expected: true },
            { text: 'special$characters!', expected: false }
        ];
    }
}

// Function to evaluate regex against test cases and update UI
function evaluateRegex() {
    const regexString = regexInput.value;
    
    if (!regexString) {
        // Clear highlighting if regex is empty
        renderTestCases();
        errorMessage.style.display = 'none';
        return;
    }
    
    try {
        // Try to create a RegExp object
        const regex = new RegExp(regexString);
        errorMessage.style.display = 'none';
        renderTestCases(regex);
    } catch (e) {
        // Show error if regex is invalid
        errorMessage.style.display = 'block';
        renderTestCases();
    }
}

// Function to render test cases with highlighting
function renderTestCases(regex = null) {
    if (testCases.length === 0) {
        return;
    }
    
    testCasesContainer.innerHTML = '';
    
    // Add column headers
    const headerRow = document.createElement('div');
    headerRow.className = 'column-headers';
    
    const expectedHeader = document.createElement('div');
    expectedHeader.className = 'expected-header';
    expectedHeader.textContent = 'Expected';
    headerRow.appendChild(expectedHeader);
    
    const testCaseHeader = document.createElement('div');
    testCaseHeader.className = 'test-case-header';
    testCaseHeader.textContent = 'Value';
    headerRow.appendChild(testCaseHeader);
    
    const captureGroupsHeader = document.createElement('div');
    captureGroupsHeader.className = 'capture-groups-header';
    captureGroupsHeader.textContent = 'Capture Groups';
    headerRow.appendChild(captureGroupsHeader);
    
    testCasesContainer.appendChild(headerRow);
    
    // Add a divider after the headers
    const headerDivider = document.createElement('div');
    headerDivider.className = 'divider';
    testCasesContainer.appendChild(headerDivider);
    
    testCases.forEach((testCase, index) => {
        // Add a divider before each test case except the first one
        if (index > 0) {
            const divider = document.createElement('div');
            divider.className = 'divider';
            testCasesContainer.appendChild(divider);
        }
        
        const testCaseDiv = document.createElement('div');
        testCaseDiv.className = 'test-case';
        
        // Add pass/fail text indicator
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = `expected-indicator ${testCase.expected ? 'expected-pass' : 'expected-fail'}`;
        indicatorDiv.textContent = testCase.expected ? 'Pass' : 'Fail';
        indicatorDiv.title = testCase.expected ? 'Expected to match' : 'Not expected to match';
        testCaseDiv.appendChild(indicatorDiv);
        
        // Create container for the test string
        const testStringDiv = document.createElement('div');
        testStringDiv.className = 'test-string';
        
        // Create container for capture groups
        const captureGroupsDiv = document.createElement('div');
        captureGroupsDiv.className = 'capture-groups';
        
        if (!regex) {
            // If no regex or invalid regex, show plain text
            testStringDiv.innerHTML = `<span class="no-match">${escapeHtml(testCase.text)}</span>`;
        } else {
            // Get regex match information
            const matches = [];
            let match;
            
            // Use a non-global regex first to check if the regex has capture groups
            const regexTest = new RegExp(regex.source, regex.flags.replace('g', ''));
            const testMatch = testCase.text.match(regexTest);
            const hasCaptureGroups = testMatch && testMatch.length > 1;
            
            // Now use global regex for highlighting
            const regexWithGlobal = new RegExp(regex.source, 'g' + regex.flags.replace('g', ''));
            
            while ((match = regexWithGlobal.exec(testCase.text)) !== null) {
                const captureGroups = match.slice(1); // Extract capture groups (if any)
                
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    captureGroups: captureGroups
                });
                
                // Add capture group tags if they exist
                if (captureGroups.length > 0) {
                    for (let i = 0; i < captureGroups.length; i++) {
                        if (captureGroups[i] !== undefined && captureGroups[i].length > 0) { // Only show defined, non-empty capture groups
                            const groupTag = document.createElement('span');
                            groupTag.className = 'capture-group';
                            groupTag.innerHTML = `<span class="capture-group-index">${i+1}:</span> ${escapeHtml(captureGroups[i])}`;
                            captureGroupsDiv.appendChild(groupTag);
                        }
                    }
                }
                
                // Prevent infinite loops for zero-width matches
                if (match.index === regexWithGlobal.lastIndex) {
                    regexWithGlobal.lastIndex++;
                }
            }
            
            if (matches.length === 0) {
                // No matches
                testStringDiv.innerHTML = `<span class="no-match">${escapeHtml(testCase.text)}</span>`;
            } else {
                // We have matches - highlight them
                let lastIndex = 0;
                let html = '';
                
                matches.forEach(match => {
                    // Add non-matching part before this match
                    if (match.start > lastIndex) {
                        html += `<span class="no-match">${escapeHtml(testCase.text.substring(lastIndex, match.start))}</span>`;
                    }
                    
                    // Add matching part
                    html += `<span class="match">${escapeHtml(match.text)}</span>`;
                    
                    lastIndex = match.end;
                });
                
                // Add any remaining non-matching part
                if (lastIndex < testCase.text.length) {
                    html += `<span class="no-match">${escapeHtml(testCase.text.substring(lastIndex))}</span>`;
                }
                
                testStringDiv.innerHTML = html;
            }
        }
        
        testCaseDiv.appendChild(testStringDiv);
        testCaseDiv.appendChild(captureGroupsDiv);
        testCasesContainer.appendChild(testCaseDiv);
    });
}

// Helper function to escape HTML special characters
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')  // Fixed syntax error here - was .replace(/<//g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Modal class for confirmations
class Modal {
    constructor() {
        // Create modal elements
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'modal-backdrop';
        
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'modal';
        
        this.header = document.createElement('div');
        this.header.className = 'modal-header';
        
        this.title = document.createElement('h2');
        this.header.appendChild(this.title);
        
        this.body = document.createElement('div');
        this.body.className = 'modal-body';
        
        this.message = document.createElement('p');
        this.body.appendChild(this.message);
        
        this.footer = document.createElement('div');
        this.footer.className = 'modal-footer';
        
        this.cancelBtn = document.createElement('button');
        this.cancelBtn.className = 'modal-cancel-btn';
        this.cancelBtn.textContent = 'Cancel';
        this.cancelBtn.addEventListener('click', () => this.close());
        this.footer.appendChild(this.cancelBtn);
        
        this.confirmBtn = document.createElement('button');
        this.confirmBtn.className = 'modal-confirm-btn';
        this.confirmBtn.textContent = 'Confirm';
        this.footer.appendChild(this.confirmBtn);
        
        // Assemble modal
        this.modalElement.appendChild(this.header);
        this.modalElement.appendChild(this.body);
        this.modalElement.appendChild(this.footer);
        this.backdrop.appendChild(this.modalElement);
        
        // Add click handler to backdrop to close when clicking outside
        this.backdrop.addEventListener('click', (e) => {
            if (e.target === this.backdrop) {
                this.close();
            }
        });
        
        // Add escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        this.isOpen = false;
    }
    
    show(options) {
        this.title.textContent = options.title || 'Confirm';
        this.message.textContent = options.message || 'Are you sure?';
        
        // Remove previous confirm handler if exists
        if (this.confirmHandler) {
            this.confirmBtn.removeEventListener('click', this.confirmHandler);
        }
        
        // Set new confirm handler
        this.confirmHandler = () => {
            if (options.onConfirm) {
                options.onConfirm();
            }
            this.close();
        };
        
        this.confirmBtn.addEventListener('click', this.confirmHandler);
        this.confirmBtn.textContent = options.confirmText || 'Confirm';
        this.cancelBtn.textContent = options.cancelText || 'Cancel';
        
        document.body.appendChild(this.backdrop);
        this.isOpen = true;
        
        // Add a small delay before adding the visible class for animation
        setTimeout(() => {
            this.backdrop.classList.add('visible');
        }, 10);
    }
    
    close() {
        this.backdrop.classList.remove('visible');
        
        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            if (this.backdrop.parentNode) {
                document.body.removeChild(this.backdrop);
            }
            this.isOpen = false;
        }, 300);
    }
}

// Create a single modal instance
const modal = new Modal();

// Copy regex pattern to clipboard
copyButton.addEventListener('click', () => {
    const regexValue = regexInput.value;
    
    // Copy to clipboard
    navigator.clipboard.writeText(regexValue)
        .then(() => {
            // Visual feedback
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyButton.textContent = 'Copy';
                copyButton.classList.remove('copied');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
});

// Add event listener to evaluate regex and update copy button when input changes
regexInput.addEventListener('input', () => {
    evaluateRegex();
    updateCopyButtonState();
});

// Add event listener to handle prompt input changes
promptInput.addEventListener('input', () => {
    updateActionButtonState();
});

// Remove the separate event listener for regex input since it's now combined above
// regexInput.addEventListener('input', evaluateRegex);
