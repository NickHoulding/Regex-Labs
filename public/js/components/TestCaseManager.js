import { escapeHtml, evaluateRegexMatch } from '../regexHelper.js';

/**
 * TestCaseManager component
 * Manages the display and evaluation of regex test cases in the UI
 */
export class TestCaseManager {
    /**
     * Creates a new test case manager
     * 
     * @param {HTMLElement} containerElement - The DOM element to render test cases into
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.testCases = [];
    }
    
    /**
     * Sets the test cases to be managed
     * 
     * @param {Array<Object>} testCases - Array of test case objects with shouldPassOrFail and Value properties
     */
    setTestCases(testCases) {
        this.testCases = Array.isArray(testCases) ? testCases : [];
    }
    
    /**
     * Gets the current test cases
     * 
     * @returns {Array<Object>} - Current test cases
     */
    getTestCases() {
        return this.testCases;
    }
    
    /**
     * Clears all test cases and updates the display
     */
    clearTestCases() {
        this.testCases = [];
        this.renderTestCases();
    }
    
    /**
     * Renders test cases in the container with optional regex highlighting
     * 
     * Displays each test case with visual indicators for expected results,
     * highlights regex matches, and shows capture groups when a pattern is provided.
     * 
     * @param {RegExp|null} regex - Optional regex to evaluate against test cases
     */
    renderTestCases(regex = null) {
        if (!this.testCases || this.testCases.length === 0) {
            this.container.innerHTML = '<p class="test-case-placeholder">No test cases available.</p>';
            return;
        }
        
        this.container.innerHTML = '';
        
        // Create header row
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
        
        this.container.appendChild(headerRow);
        
        // Add header divider
        const headerDivider = document.createElement('div');
        headerDivider.className = 'divider';
        this.container.appendChild(headerDivider);
        
        // Render each test case
        this.testCases.forEach((testCase, index) => {
            if (!testCase) return;
            
            // Add divider between test cases
            if (index > 0) {
                const divider = document.createElement('div');
                divider.className = 'divider';
                this.container.appendChild(divider);
            }
            
            // Create test case container
            const testCaseDiv = document.createElement('div');
            testCaseDiv.className = 'test-case';
            
            const isPass = testCase.shouldPassOrFail === 'Pass';
            const testValue = testCase.Value || '';
            
            // Create pass/fail indicator
            const indicatorDiv = document.createElement('div');
            indicatorDiv.className = `expected-indicator ${isPass ? 'expected-pass' : 'expected-fail'}`;
            indicatorDiv.textContent = isPass ? 'Pass' : 'Fail';
            indicatorDiv.title = isPass ? 'Expected to match' : 'Not expected to match';
            testCaseDiv.appendChild(indicatorDiv);
            
            // Create test string display
            const testStringDiv = document.createElement('div');
            testStringDiv.className = 'test-string';
            
            // Create capture groups container
            const captureGroupsDiv = document.createElement('div');
            captureGroupsDiv.className = 'capture-groups';
            
            if (!regex) {
                // No regex provided, just display the test value
                testStringDiv.innerHTML = `<span class="no-match">${escapeHtml(testValue)}</span>`;
            } else {
                // Evaluate regex against test value
                const { matches } = evaluateRegexMatch(regex, testValue);
                
                if (matches.length === 0) {
                    // No matches found
                    testStringDiv.innerHTML = `<span class="no-match">${escapeHtml(testValue)}</span>`;
                } else {
                    // Highlight matches in the test value
                    let lastIndex = 0;
                    let html = '';
                    
                    matches.forEach(match => {
                        // Add non-matching part before this match
                        if (match.start > lastIndex) {
                            html += `<span class="no-match">${escapeHtml(testValue.substring(lastIndex, match.start))}</span>`;
                        }
                        
                        // Add matching part
                        html += `<span class="match">${escapeHtml(match.text)}</span>`;
                        
                        lastIndex = match.end;
                        
                        // Add capture groups if any
                        if (match.captureGroups.length > 0) {
                            match.captureGroups.forEach((group, groupIndex) => {
                                if (group !== undefined && group.length > 0) {
                                    const groupTag = document.createElement('span');
                                    groupTag.className = 'capture-group';
                                    groupTag.innerHTML = `<span class="capture-group-index">${groupIndex+1}:</span> ${escapeHtml(group)}`;
                                    captureGroupsDiv.appendChild(groupTag);
                                }
                            });
                        }
                    });
                    
                    // Add any remaining non-matching text
                    if (lastIndex < testValue.length) {
                        html += `<span class="no-match">${escapeHtml(testValue.substring(lastIndex))}</span>`;
                    }
                    
                    testStringDiv.innerHTML = html;
                }
            }
            
            // Assemble test case components
            testCaseDiv.appendChild(testStringDiv);
            testCaseDiv.appendChild(captureGroupsDiv);
            this.container.appendChild(testCaseDiv);
        });
    }
}
