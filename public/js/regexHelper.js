/**
 * Escape HTML special characters to prevent XSS
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
    
    const regexTest = new RegExp(regex.source, regex.flags.replace('g', ''));
    const testMatch = testString.match(regexTest);
    const hasCaptureGroups = testMatch && testMatch.length > 1;
    
    const regexWithGlobal = new RegExp(regex.source, 'g' + regex.flags.replace('g', ''));
    
    while ((match = regexWithGlobal.exec(testString)) !== null) {
        const captureGroups = match.slice(1);
        
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0],
            captureGroups: captureGroups
        });
        
        if (match.index === regexWithGlobal.lastIndex) {
            regexWithGlobal.lastIndex++;
        }
    }
    
    return { matches };
}
