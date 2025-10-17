import {z} from 'zod';

export const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voiceName: z.string().optional().describe('The name of the prebuilt voice to use.'),
});
export const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});

export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;


export const ResumeAnalysisInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job (e.g., "Senior Verification Engineer").'),
  jobDescription: z.string().describe('The full text content of the job description.'),
  resume: z.string().describe('The full text content of the candidate\'s resume.'),
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
