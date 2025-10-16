
'use server';
/**
 * @fileOverview A Genkit flow for analyzing a resume against a job description.
 *
 * It provides a match score, summary, keyword analysis, and actionable suggestions
 * for improvement.
 *
 * @exports {
 *   analyzeResume: (input: ResumeAnalysisInput) => Promise<ResumeAnalysisOutput>;
 *   ResumeAnalysisInput: z.infer<typeof ResumeAnalysisInputSchema>;
 *   ResumeAnalysisOutput: z.infer<typeof ResumeAnalysisOutputSchema>;
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ResumeAnalysisInputSchema = z.object({
  resume: z.string().describe('The full text content of the candidate\'s resume.'),
  jobDescription: z.string().describe('The full text content of the job description.'),
});
export type ResumeAnalysisInput = z.infer<typeof ResumeAnalysisInputSchema>;

export const ResumeAnalysisOutputSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0-100 representing how well the resume matches the job description.'),
  matchStrength: z.string().describe('A short description of the match strength (e.g., "Strong Match", "Good Match", "Needs Improvement").'),
  summary: z
    .string()
    .describe('A concise summary of how the resume aligns with the key requirements of the job description.'),
  keywords: z.object({
    found: z.array(z.string()).describe('A list of important keywords from the job description that were found in the resume.'),
    missing: z.array(z.string()).describe('A list of important keywords from the job description that were missing from the resume.'),
  }),
  suggestions: z
    .array(z.string())
    .describe('A list of specific, actionable suggestions for how the user can improve their resume to better match this job description.'),
});
export type ResumeAnalysisOutput = z.infer<typeof ResumeAnalysisOutputSchema>;


export async function analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
  return resumeAnalysisFlow(input);
}

const resumeAnalysisPrompt = ai.definePrompt({
  name: 'resumeAnalysisPrompt',
  input: { schema: ResumeAnalysisInputSchema },
  output: { schema: ResumeAnalysisOutputSchema },
  prompt: `You are an expert career coach and recruiter specializing in the VLSI and semiconductor industry. Your task is to analyze a candidate's resume against a specific job description and provide a detailed, constructive analysis.

  Analyze the provided resume and job description. Perform the following steps:
  1.  **Calculate Match Score**: Evaluate the resume against the job description's requirements (skills, experience, qualifications) and assign a score from 0 to 100.
  2.  **Determine Match Strength**: Based on the score, categorize the match as "Strong Match", "Good Match", or "Needs Improvement".
  3.  **Summarize Alignment**: Write a brief summary highlighting the key strengths and weaknesses of the resume in relation to the role.
  4.  **Keyword Analysis**: Identify the most critical technical and soft skills from the job description. Then, determine which of these keywords are present in the resume and which are missing.
  5.  **Provide Actionable Suggestions**: Generate a list of 3-5 specific, actionable suggestions for how the candidate can improve their resume. These suggestions should be concrete, like "Add a project that demonstrates your experience with SystemVerilog and UVM" or "Quantify your achievements in your previous role by mentioning the percentage improvement in verification coverage."

  **Job Description:**
  {{{jobDescription}}}

  **Resume:**
  {{{resume}}}

  Produce a JSON object with your complete analysis.
  `,
});

const resumeAnalysisFlow = ai.defineFlow(
  {
    name: 'resumeAnalysisFlow',
    inputSchema: ResumeAnalysisInputSchema,
    outputSchema: ResumeAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await resumeAnalysisPrompt(input);
    return output!;
  }
);
