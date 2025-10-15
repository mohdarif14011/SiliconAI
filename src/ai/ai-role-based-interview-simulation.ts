'use server';

/**
 * @fileOverview Simulates voice-based mock interviews for VLSI job roles.
 *
 * - conductInterview - A function that conducts the interview and provides feedback.
 * - ConductInterviewInput - The input type for the conductInterview function, including the job role and the student's audio response.
 * - ConductInterviewOutput - The return type for the conductInterview function, including the AI's response, feedback, and updated interview state.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const JobRoleSchema = z.enum([
  'Design Engineer',
  'Verification Engineer',
  'Physical Design Engineer',
]);

const ConductInterviewInputSchema = z.object({
  jobRole: JobRoleSchema.describe('The specific VLSI job role for the interview.'),
  studentResponse: z.string().describe(
    'The student\'s audio response to the AI\'s question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected description
  ),
  previousTranscript: z.string().optional().describe('The transcript of the previous interview turns.'),
});

export type ConductInterviewInput = z.infer<typeof ConductInterviewInputSchema>;

const ConductInterviewOutputSchema = z.object({
  aiResponse: z.string().describe('The AI\'s next question or concluding remarks.'),
  feedback: z.string().describe('Feedback on the student\'s response, including technical accuracy, clarity, and communication skills.'),
  transcript: z.string().describe('The complete transcript of the interview so far, including student and AI responses.'),
});

export type ConductInterviewOutput = z.infer<typeof ConductInterviewOutputSchema>;

export async function conductInterview(input: ConductInterviewInput): Promise<ConductInterviewOutput> {
  return conductInterviewFlow(input);
}

const interviewPrompt = ai.definePrompt({
  name: 'interviewPrompt',
  input: {
    schema: ConductInterviewInputSchema,
  },
  output: {
    schema: ConductInterviewOutputSchema,
  },
  prompt: `You are a VLSI (Very-Large-Scale Integration) expert and an experienced interviewer. You are conducting a voice-based mock interview for the role of {{{jobRole}}}.\n\nYour task is to:\n1.  Pose interview questions relevant to the specified VLSI job role.\n2.  Evaluate the student\'s answers based on technical accuracy, clarity, and communication skills.\n3.  Provide constructive feedback to the student after each response. Be specific about areas of improvement, and explain why those areas need improvement, and cite best-practices for the student to follow. The student needs clear and actionable advice.\n4.  Maintain a conversational tone and adapt the difficulty of questions based on the student\'s performance.\n5.  Conclude the interview when appropriate, providing a summary of the student\'s strengths and weaknesses.\n\nHere is the job role: {{{jobRole}}}.\n\nPrevious transcript: {{{previousTranscript}}}\n\nStudent\'s response:  The student response is in audio format and is not available for you to review directly, therefore base your next question on the previousTranscript.  When generating your response, use newlines to separate the AI's question, and the feedback to the student.  Do not begin with "AI:" or "Feedback:".  It is not necessary to be verbose, it is more important to maintain a realistic interviewing pace.  Do not ever ask the student for clarification of their audio, or suggest that you were not able to understand their answer.  This is a voice-based interview, so after asking a question, await their response.\n\nAI:`, // Corrected prompt to be more concise and direct
});

const conductInterviewFlow = ai.defineFlow(
  {
    name: 'conductInterviewFlow',
    inputSchema: ConductInterviewInputSchema,
    outputSchema: ConductInterviewOutputSchema,
  },
  async input => {
    const {output} = await interviewPrompt(input);
    return output!;
  }
);
