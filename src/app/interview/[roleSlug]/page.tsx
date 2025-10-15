"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ROLES, type VlsiRole } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Square,
  Loader2,
  CheckCircle2,
  XCircle,
  Settings2,
  Volume2,
  BrainCircuit,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/page-header";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Tone from "tone";
import { conductInterview, ConductInterviewOutput } from "@/ai/ai-role-based-interview-simulation";
import { textToSpeech } from "@/ai/ai-text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type InterviewStatus =
  | "idle"
  | "starting"
  | "speaking"
  | "listening"
  | "recording"
  | "processing"
  | "feedback"
  | "completed";

const MAX_QUESTIONS = 5;

export default function InterviewPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const roleSlug = params.roleSlug as string;
  const role = ROLES.find((r) => r.slug === roleSlug) as VlsiRole;

  const [status, setStatus] = useState<InterviewStatus>("idle");
  const [questionCount, setQuestionCount] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [currentAIResponse, setCurrentAIResponse] = useState<ConductInterviewOutput | null>(null);
  const [noisePlayer, setNoisePlayer] = useState<Tone.Noise | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    audioPlayerRef.current = new Audio();
    return () => {
      noisePlayer?.dispose();
      mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop());
    };
  }, [noisePlayer]);

  const playAudio = (audioDataUri: string) => {
    return new Promise<void>((resolve) => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioDataUri;
        audioPlayerRef.current.play();
        audioPlayerRef.current.onended = () => resolve();
      }
    });
  };

  const speakAndListen = async (text: string) => {
    setStatus("speaking");
    try {
      const { audioDataUri } = await textToSpeech(text);
      await playAudio(audioDataUri);
      setStatus("listening");
    } catch (error) {
      console.error("Error with TTS:", error);
      toast({
        variant: "destructive",
        title: "AI Voice Error",
        description: "Could not generate AI speech. Please try again.",
      });
      setStatus("idle");
    }
  };

  const handleStartInterview = async () => {
    setStatus("starting");
    try {
      // Greet the user and ask the first question
      const initialResponse = await conductInterview({ jobRole: role.name, studentResponse: "none" });
      setCurrentAIResponse(initialResponse);
      setTranscript(initialResponse.transcript);
      setQuestionCount(1);
      await speakAndListen(initialResponse.aiResponse);
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast({
        variant: "destructive",
        title: "Interview Start Failed",
        description: "There was an error starting the interview.",
      });
      setStatus("idle");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setStatus("recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please check your browser permissions and allow microphone access.",
      });
    }
  };
  
  const stopRecordingAndProcess = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const response = await conductInterview({
              jobRole: role.name,
              studentResponse: base64Audio,
              previousTranscript: transcript,
            });
            setCurrentAIResponse(response);
            setTranscript(response.transcript);
            setStatus("feedback");
          } catch (error) {
            console.error("Error processing response:", error);
            toast({
              variant: "destructive",
              title: "Processing Error",
              description: "Could not process your answer.",
            });
            setStatus("listening");
          }
        };
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setStatus("processing");
    }
  };

  const handleNextQuestion = async () => {
    if (questionCount < MAX_QUESTIONS) {
      setQuestionCount(questionCount + 1);
      if (currentAIResponse) {
        await speakAndListen(currentAIResponse.aiResponse);
      }
    } else {
      setStatus("completed");
    }
  };

  const handleEndInterview = () => {
    localStorage.setItem("latestInterviewTranscript", transcript);
    localStorage.setItem("latestInterviewRole", role.name);
    router.push(`/report/latest`);
  };

  const handleNoiseChange = (value: string) => {
    noisePlayer?.dispose();
    if (value !== "none") {
      const noise = new Tone.Noise(value as "white" | "pink" | "brown").toDestination();
      noise.volume.value = -20;
      noise.start();
      setNoisePlayer(noise);
    } else {
      setNoisePlayer(null);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "idle":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Ready for your mock interview?</h2>
            <p className="text-muted-foreground mt-2">You'll be speaking with an AI interviewer for the {role.name} role.</p>
            <Button onClick={handleStartInterview} size="lg" className="mt-8">
              Begin Interview
            </Button>
          </div>
        );
      case "starting":
        return (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Preparing your interview...</p>
          </div>
        );
      case "speaking":
      case "listening":
      case "recording":
      case "processing":
      case "feedback":
        return (
          <div className="w-full max-w-3xl">
            <Progress value={(questionCount / MAX_QUESTIONS) * 100} className="mb-8" />
            <p className="mb-6 text-center text-sm font-medium text-muted-foreground">Question {questionCount} of {MAX_QUESTIONS}</p>
            
            <Card className="mb-6">
              <CardHeader className="flex-row items-center gap-4">
                  <BrainCircuit className="h-6 w-6 text-primary"/>
                  <CardTitle>AI Interviewer</CardTitle>
              </CardHeader>
              <CardContent>
                {status === 'speaking' ? (
                   <Skeleton className="h-6 w-full" />
                ) : (
                   <p className="text-lg font-medium">{currentAIResponse?.aiResponse}</p>
                )}
              </CardContent>
            </Card>

            {status === 'feedback' && (
               <Card className="mb-6 bg-accent/50 border-accent">
                <CardHeader className="flex-row items-center gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500"/>
                  <CardTitle>Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{currentAIResponse?.feedback}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center gap-4 mt-8">
              {status === 'listening' && (
                <Button onClick={startRecording} size="lg" className="w-48">
                  <Mic className="mr-2 h-5 w-5" /> Record Answer
                </Button>
              )}
              {status === 'recording' && (
                <Button onClick={stopRecordingAndProcess} size="lg" variant="destructive" className="w-48 animate-pulse">
                  <Square className="mr-2 h-5 w-5" /> Stop Recording
                </Button>
              )}
              {status === 'processing' && (
                <Button disabled size="lg" className="w-48">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                </Button>
              )}
               {status === 'feedback' && (
                <Button onClick={handleNextQuestion} size="lg" className="w-48">
                  {questionCount < MAX_QUESTIONS ? "Next Question" : "Finish Interview"}
                </Button>
              )}
              <Button onClick={handleEndInterview} variant="outline">End Interview</Button>
            </div>
          </div>
        );
       case "completed":
        return (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-semibold">Interview Completed!</h2>
            <p className="text-muted-foreground mt-2">Well done! You've completed the mock interview.</p>
            <Button onClick={handleEndInterview} size="lg" className="mt-8">
              View Performance Report
            </Button>
          </div>
        );
    }
  };

  if (!role) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold">Role not found</h1>
        <Button asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
       <PageHeader title={`${role.name} Interview`} />
       <main className="flex flex-1 flex-col items-center justify-center p-4">
         {renderContent()}
      </main>
      <div className="absolute bottom-4 right-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings2 className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Interview Settings</SheetTitle>
              <SheetDescription>
                Personalize your interview experience.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="noise" className="text-right col-span-1 flex items-center gap-2 justify-end">
                  <Volume2 className="h-4 w-4" /> Noise
                </Label>
                <Select onValueChange={handleNoiseChange} defaultValue="none">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select background noise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="white">Office Hum (White)</SelectItem>
                    <SelectItem value="brown">Distant Chatter (Brown)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
