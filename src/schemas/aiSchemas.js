import { z } from 'zod';

export const testCase = z.object({
    shouldPassOrFail: z.enum(['Pass', 'Fail']),
    Value: z.string(),
});

export const testSuite = z.object({
    testCases: z.array(testCase),
});
