'use server';

/**
 * @fileOverview Converts text to speech using a GenAI model.
 *
 * - textToSpeech - A function that takes text and returns a data URI for the audio.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

export const TextToSpeechInputSchema = z.string();
export const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});

export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async query => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('No media returned from TTS model.');
    }
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavDataUri = `data:audio/wav;base64,${await toWav(audioBuffer)}`;

    return {audioDataUri: wavDataUri};
  }
);

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', d => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
