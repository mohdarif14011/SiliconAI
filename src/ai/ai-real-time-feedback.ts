'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing real-time feedback during a mock interview.
 *
 * It takes the student's response and the VLSI job role as input, and returns feedback on technical accuracy,
 * clarity, and communication skills.
 *
 * @exports {
 *   realTimeFeedback: (input: RealTimeFeedbackInput) => Promise<RealTimeFeedbackOutput>;
 *   RealTimeFeedbackInput: z.infer<typeof RealTimeFeedbackInputSchema>;
 *   RealTimeFeedbackOutput: z.infer<typeof RealTimeFeedbackOutputSchema>;
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeFeedbackInputSchema = z.object({
  studentResponse: z.string().describe('The student\'s answer to the interview question.'),
  vlsiRole: z.string().describe('The specific VLSI job role (e.g., Design Engineer, Verification Engineer).'),
  interviewQuestion: z.string().describe('The interview question asked by the interviewer.'),
});
export type RealTimeFeedbackInput = z.infer<typeof RealTimeFeedbackInputSchema>;

const RealTimeFeedbackOutputSchema = z.object({
  technicalAccuracy: z.string().describe('Feedback on the technical accuracy of the response.'),
  clarity: z.string().describe('Feedback on the clarity of the response.'),
  communicationSkills: z.string().describe('Feedback on the communication skills demonstrated in the response.'),
  overallFeedback: z.string().describe('Overall feedback on the student\'s response with suggestions for improvement.'),
});
export type RealTimeFeedbackOutput = z.infer<typeof RealTimeFeedbackOutputSchema>;


export async function realTimeFeedback(input: RealTimeFeedbackInput): Promise<RealTimeFeedbackOutput> {
  return realTimeFeedbackFlow(input);
}

const realTimeFeedbackPrompt = ai.definePrompt({
  name: 'realTimeFeedbackPrompt',
  input: {schema: RealTimeFeedbackInputSchema},
  output: {schema: RealTimeFeedbackOutputSchema},
  prompt: `You are an AI-powered interview coach specializing in VLSI job roles. A student is practicing for an interview and has just answered a question.

  Based on the student's response, provide feedback on the following aspects:

  1. Technical Accuracy: Assess the technical correctness of the information provided in the response. Identify any inaccuracies or misunderstandings.
  2. Clarity: Evaluate how clearly the student articulated their answer. Was the explanation easy to understand?
  3. Communication Skills: Provide feedback on the student's communication skills, including their ability to articulate technical concepts and maintain a professional demeanor.
  4. Overall Feedback: Give an overall assessment of the student's response, highlighting strengths and weaknesses. Provide specific suggestions for improvement.

  Consider the VLSI role the student is interviewing for: {{{vlsiRole}}}.
  The interview question asked was: {{{interviewQuestion}}}.
  The student's response was: {{{studentResponse}}}.

  Format your response as a JSON object matching the following schema:
  { 
   technicalAccuracy: string,
   clarity: string,
   communicationSkills: string,
   overallFeedback: string
  }
  `,
});

const realTimeFeedbackFlow = ai.defineFlow(
  {
    name: 'realTimeFeedbackFlow',
    inputSchema: RealTimeFeedbackInputSchema,
    outputSchema: RealTimeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await realTimeFeedbackPrompt(input);
    return output!;
  }
);
