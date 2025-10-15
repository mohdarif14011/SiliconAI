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
import {MediaPart} from 'genkit';

const JobRoleSchema = z.enum(['Design Engineer', 'Verification Engineer', 'Physical Design Engineer']);

const ConductInterviewInputSchema = z.object({
  jobRole: JobRoleSchema.describe('The specific VLSI job role for the interview.'),
  studentResponse: z
    .string()
    .describe(
      "The student's audio response as a data URI (e.g., 'data:audio/webm;base64,...'). If it's the start of the interview, this can be 'none'."
    ),
  previousTranscript: z.string().optional().describe('The transcript of the previous interview turns.'),
});

export type ConductInterviewInput = z.infer<typeof ConductInterviewInputSchema>;

const ConductInterviewOutputSchema = z.object({
  aiResponse: z.string().describe("The AI's next question or concluding remarks."),
  feedback: z.string().describe("Feedback on the student's response, if applicable."),
  transcript: z.string().describe('The complete transcript of the interview so far.'),
});

export type ConductInterviewOutput = z.infer<typeof ConductInterviewOutputSchema>;

export async function conductInterview(input: ConductInterviewInput): Promise<ConductInterviewOutput> {
  return conductInterviewFlow(input);
}

const interviewPrompt = ai.definePrompt({
  name: 'interviewPrompt',
  input: {
    schema: z.object({
      jobRole: JobRoleSchema,
      studentResponseText: z.string(),
      previousTranscript: z.string().optional(),
    }),
  },
  output: {
    schema: ConductInterviewOutputSchema,
  },
  prompt: `You are a VLSI (Very-Large-Scale Integration) expert and an experienced interviewer. You are conducting a voice-based mock interview for the role of {{{jobRole}}}.

Your task is:
1.  Ask relevant interview questions for the specified VLSI job role.
2.  Evaluate the student's answers for technical accuracy, clarity, and communication.
3.  Provide constructive, concise feedback after each response.
4.  Maintain a conversational tone.
5.  Keep a running transcript.

Here is the job role: {{{jobRole}}}.

Previous transcript:
{{{previousTranscript}}}

Student's latest answer: {{{studentResponseText}}}

Instructions:
- If 'studentResponseText' is 'none', it's the start of the interview. Greet the student and ask the first question.
- Otherwise, provide feedback on 'studentResponseText' and then ask the next question.
- The 'aiResponse' in your output should be ONLY the next question you are asking.
- The 'feedback' should be your evaluation of the student's last answer.
- The 'transcript' should be the full conversation, including your new question. Append to the previous transcript.
- Do not repeat questions from the transcript.
`,
});

const conductInterviewFlow = ai.defineFlow(
  {
    name: 'conductInterviewFlow',
    inputSchema: ConductInterviewInputSchema,
    outputSchema: ConductInterviewOutputSchema,
  },
  async input => {
    let studentResponseText = 'none';

    if (input.studentResponse !== 'none') {
      const {text} = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: [
          {
            media: {
              url: input.studentResponse,
            },
          },
          {text: 'Transcribe this audio.'},
        ],
      });
      studentResponseText = text;
    }
    
    const promptInput = {
      jobRole: input.jobRole,
      studentResponseText: studentResponseText,
      previousTranscript: input.previousTranscript,
    };
    
    const {output} = await interviewPrompt(promptInput);

    return output!;
  }
);
