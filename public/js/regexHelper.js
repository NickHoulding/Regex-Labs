/**
 * Utility functions for regex operations and display
 */

/**
 * Escapes HTML special characters to prevent XSS in displayed content
 * 
 * @param {string} str - String to escape
 * @returns {string} - Escaped HTML string
 */
export function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Evaluates a regex against a test string and returns match information
 * 
 * Processes regex matches and extracts detailed information including
 * match positions, matched text, and any capture groups found.
 * 
 * @param {RegExp} regex - The compiled regular expression
 * @param {string} testString - String to test against the regex
 * @returns {Object} - Match information including positions and capture groups
 */
export function evaluateRegexMatch(regex, testString) {
    if (!regex || !testString) {
        return { matches: [] };
    }
    
    const matches = [];
    let match;
    
    // Create a non-global version of the regex for testing capture groups
    const regexTest = new RegExp(regex.source, regex.flags.replace('g', ''));
    const testMatch = testString.match(regexTest);
    
    // Ensure global flag is present for iteration through all matches
    const regexWithGlobal = new RegExp(regex.source, 'g' + regex.flags.replace('g', ''));
    
    while ((match = regexWithGlobal.exec(testString)) !== null) {
        const captureGroups = match.slice(1);
        
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            captureGroups: captureGroups
        });
        
        // Prevent infinite loops for zero-length matches
        if (match.index === regexWithGlobal.lastIndex) {
            regexWithGlobal.lastIndex++;
        }
    }
    
    return { matches };
}
