import { escapeHtml, evaluateRegexMatch } from '../regexHelper.js';

export class TestCaseManager {
    constructor(containerElement) {
        this.container = containerElement;
        this.testCases = [];
    }
    
    /**
     * Set the test cases to be managed
     * @param {Array} testCases - Array of test case objects
     */
    setTestCases(testCases) {
        if (!Array.isArray(testCases)) {
            this.testCases = [];
        } else {
            this.testCases = testCases;
        }
    }
    
    /**
     * Get the current test cases
     * @returns {Array} - Current test cases
     */
    getTestCases() {
        return this.testCases;
    }
    
    /**
     * Clear all test cases
     */
    clearTestCases() {
        this.testCases = [];
        this.renderTestCases();
    }
    
    /**
     * Render test cases with optional regex highlighting
     * @param {RegExp|null} regex - Optional regex to evaluate against test cases
     */
    renderTestCases(regex = null) {
        if (!this.testCases || this.testCases.length === 0) {
            this.container.innerHTML = '<p class="test-case-placeholder">No test cases available.</p>';
            return;
        }
        
        this.container.innerHTML = '';
        
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
        
        const headerDivider = document.createElement('div');
        headerDivider.className = 'divider';
        this.container.appendChild(headerDivider);
        
        this.testCases.forEach((testCase, index) => {
            if (!testCase) return;
            
            if (index > 0) {
                const divider = document.createElement('div');
                divider.className = 'divider';
                this.container.appendChild(divider);
            }
            
            const testCaseDiv = document.createElement('div');
            testCaseDiv.className = 'test-case';
            
            const isPass = testCase.shouldPassOrFail === 'Pass';
            const testValue = testCase.Value || '';
            
            const indicatorDiv = document.createElement('div');
            indicatorDiv.className = `expected-indicator ${isPass ? 'expected-pass' : 'expected-fail'}`;
            indicatorDiv.textContent = isPass ? 'Pass' : 'Fail';
            indicatorDiv.title = isPass ? 'Expected to match' : 'Not expected to match';
            testCaseDiv.appendChild(indicatorDiv);
            
            const testStringDiv = document.createElement('div');
            testStringDiv.className = 'test-string';
            
            const captureGroupsDiv = document.createElement('div');
            captureGroupsDiv.className = 'capture-groups';
            
            if (!regex) {
                testStringDiv.innerHTML = `<span class="no-match">${escapeHtml(testValue)}</span>`;
            } else {
                const { matches } = evaluateRegexMatch(regex, testValue);
                
                if (matches.length === 0) {
                    testStringDiv.innerHTML = `<span class="no-match">${escapeHtml(testValue)}</span>`;
                } else {
                    let lastIndex = 0;
                    let html = '';
                    
                    matches.forEach(match => {
                        if (match.start > lastIndex) {
                            html += `<span class="no-match">${escapeHtml(testValue.substring(lastIndex, match.start))}</span>`;
                        }
                        
                        html += `<span class="match">${escapeHtml(match.text)}</span>`;
                        
                        lastIndex = match.end;
                        
                        if (match.captureGroups.length > 0) {
                            for (let i = 0; i < match.captureGroups.length; i++) {
                                if (match.captureGroups[i] !== undefined && match.captureGroups[i].length > 0) {
                                    const groupTag = document.createElement('span');
                                    groupTag.className = 'capture-group';
                                    groupTag.innerHTML = `<span class="capture-group-index">${i+1}:</span> ${escapeHtml(match.captureGroups[i])}`;
                                    captureGroupsDiv.appendChild(groupTag);
                                }
                            }
                        }
                    });
                    
                    if (lastIndex < testValue.length) {
                        html += `<span class="no-match">${escapeHtml(testValue.substring(lastIndex))}</span>`;
                    }
                    
                    testStringDiv.innerHTML = html;
                }
            }
            
            testCaseDiv.appendChild(testStringDiv);
            testCaseDiv.appendChild(captureGroupsDiv);
            this.container.appendChild(testCaseDiv);
        });
    }
}
