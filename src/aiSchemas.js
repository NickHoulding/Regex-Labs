import { z } from 'zod';

export const testCase = z.object({
    shouldPassOrFail: z.enum(['Pass', 'Fail']),
    Value: z.string().describe('The example string to be tested against the regex pattern. DO NOT include any other text or explanation.'),
});

export const testSuite = z.object({
    testCases: z.array(testCase),
});
