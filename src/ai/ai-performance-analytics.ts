// This file uses server-side code.
'use server';

/**
 * @fileOverview Generates a performance report based on the mock interview.
 *
 * - generatePerformanceReport - A function that generates the performance report for a student.
 * - PerformanceReportInput - The input type for the generatePerformanceReport function.
 * - PerformanceReportOutput - The return type for the generatePerformanceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PerformanceReportInputSchema = z.object({
  interviewTranscript: z.string().describe('The complete transcript of the mock interview.'),
  selectedRole: z.string().describe('The VLSI job role selected for the interview.'),
});
export type PerformanceReportInput = z.infer<typeof PerformanceReportInputSchema>;

const PerformanceReportOutputSchema = z.object({
  strengths: z.string().describe('Key strengths demonstrated during the interview.'),
  weaknesses: z.string().describe('Areas needing improvement, with specific examples.'),
  actionableFeedback: z.string().describe('Specific, actionable steps to improve performance.'),
  overallScore: z.number().describe('The score for the whole interview'),
});
export type PerformanceReportOutput = z.infer<typeof PerformanceReportOutputSchema>;

export async function generatePerformanceReport(input: PerformanceReportInput): Promise<PerformanceReportOutput> {
  return performanceReportFlow(input);
}

const performanceReportPrompt = ai.definePrompt({
  name: 'performanceReportPrompt',
  input: {schema: PerformanceReportInputSchema},
  output: {schema: PerformanceReportOutputSchema},
  prompt: `You are an expert AI interview coach for VLSI (Very Large Scale Integration) roles. 
You will generate a performance report based on the provided interview transcript and selected role.

Analyze the interview transcript to identify the candidate's strengths and weaknesses related to the VLSI job role: {{selectedRole}}.
Provide specific, actionable feedback to help the candidate improve their interview skills and technical knowledge.

Interview Transcript:
{{interviewTranscript}}

Based on the interview generate the following. Make sure the the keys are quoted strings, and the values are strings.

Strengths: Identify and list the candidate's key strengths demonstrated during the interview.
Weaknesses: Identify and list areas needing improvement, with specific examples from the interview transcript.
Actionable Feedback: Provide specific, actionable steps the candidate can take to improve their performance.
Overall Score: The overall performance score of the interview
`,
});

const performanceReportFlow = ai.defineFlow(
  {
    name: 'performanceReportFlow',
    inputSchema: PerformanceReportInputSchema,
    outputSchema: PerformanceReportOutputSchema,
  },
  async input => {
    const {output} = await performanceReportPrompt(input);
    return output!;
  }
);
