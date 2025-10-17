
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
import {
  ResumeAnalysisInputSchema,
  type ResumeAnalysisInput,
  ResumeAnalysisOutputSchema,
  type ResumeAnalysisOutput,
} from './types';


export async function analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput> {
  return resumeAnalysisFlow(input);
}

const resumeAnalysisPrompt = ai.definePrompt({
  name: 'resumeAnalysisPrompt',
  input: { schema: ResumeAnalysisInputSchema },
  output: { schema: ResumeAnalysisOutputSchema },
  prompt: `You are an expert career coach and recruiter specializing in the VLSI and semiconductor industry. Your task is to analyze a candidate's resume against a specific job description and provide a detailed, constructive analysis for the job title: {{{jobTitle}}}.

  Analyze the provided resume and job description. Perform the following steps:
  1.  **Calculate Match Score**: Evaluate the resume against the job description's requirements (skills, experience, qualifications) and assign a score from 0 to 100.
  2.  **Determine Match Strength**: Based on the score, categorize the match as "Strong Match", "Good Match", or "Needs Improvement".
  3.  **Summarize Alignment**: Write a brief summary highlighting the key strengths and weaknesses of the resume in relation to the role.
  4.  **Keyword Analysis**: Identify the most critical technical and soft skills from the job description. Then, determine which of these keywords are present in the resume and which are missing.
  5.  **Provide Actionable Suggestions**: Generate a list of 3-5 specific, actionable suggestions for how the candidate can improve their resume. These suggestions should be concrete, like "Add a project that demonstrates your experience with SystemVerilog and UVM" or "Quantify your achievements in your previous role by mentioning the percentage improvement in verification coverage."

  **Job Title:**
  {{{jobTitle}}}

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
