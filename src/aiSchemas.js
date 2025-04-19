import { z } from 'zod';

/**
 * Zod schema definitions for AI response validation
 * These schemas ensure that the AI model returns properly formatted test cases
 */

/**
 * Schema for an individual test case
 * Each test case has a pass/fail expectation and a string value to test
 */
export const testCase = z.object({
    shouldPassOrFail: z.enum(['Pass', 'Fail'])
        .describe('Whether this test case should match the regex pattern or not'),
    Value: z.string()
        .describe('The example string to be tested against the regex pattern. DO NOT include any other text or explanation.'),
});

/**
 * Schema for the complete test suite
 * Contains an array of test cases for the regex pattern
 */
export const testSuite = z.object({
    testCases: z.array(testCase)
        .describe('An array of test cases for validating a regex pattern'),
});
