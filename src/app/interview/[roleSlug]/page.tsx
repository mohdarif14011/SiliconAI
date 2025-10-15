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

type InterviewStatus =
  | "idle"
  | "starting"
  | "in_progress"
  | "recording"
  | "processing"
  | "feedback"
  | "completed";

const MOCK_QUESTIONS = [
  "Explain the difference between blocking and non-blocking assignments in Verilog.",
  "What is setup and hold time? What happens if they are violated?",
  "Describe a complex project you worked on and your specific contributions.",
];

export default function InterviewPage() {
  const router = useRouter();
  const params = useParams();
  const roleSlug = params.roleSlug as string;
  const role = ROLES.find((r) => r.slug === roleSlug) as VlsiRole;

  const [status, setStatus] = useState<InterviewStatus>("idle");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    score: number;
    text: string;
  } | null>(null);
  const [noisePlayer, setNoisePlayer] = useState<Tone.Noise | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    return () => {
      noisePlayer?.dispose();
    };
  }, [noisePlayer]);

  const handleStartInterview = () => {
    setStatus("starting");
    setTimeout(() => {
      setStatus("in_progress");
    }, 1500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setStatus("recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check your browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setStatus("processing");
      
      // Simulate AI processing
      setTimeout(() => {
        setFeedback({
          score: Math.floor(Math.random() * 31) + 70, // 70-100
          text: "That's a good answer. You covered the key points well. Consider mentioning the impact on downstream logic for a more complete explanation.",
        });
        setStatus("feedback");
      }, 3000);
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStatus("in_progress");
    } else {
      setStatus("completed");
    }
  };

  const handleEndInterview = () => {
    router.push("/report/1");
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
            <p className="text-muted-foreground mt-2">You will be asked a series of questions relevant to the {role.name} role.</p>
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
      case "in_progress":
      case "recording":
      case "processing":
      case "feedback":
        return (
          <div className="w-full max-w-3xl">
            <Progress value={((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100} className="mb-8" />
            <p className="mb-6 text-center text-sm font-medium text-muted-foreground">Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}</p>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Interviewer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{MOCK_QUESTIONS[currentQuestionIndex]}</p>
              </CardContent>
            </Card>

            {feedback && (
               <Card className="mb-6 bg-accent/50 border-accent">
                <CardHeader className="flex-row items-center gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500"/>
                  <CardTitle>Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{feedback.text}</p>
                  <div className="flex items-center gap-2">
                    <Label>Score:</Label>
                    <Badge variant="secondary">{feedback.score}/100</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center gap-4 mt-8">
              {status === 'in_progress' && (
                <Button onClick={startRecording} size="lg" className="w-48">
                  <Mic className="mr-2 h-5 w-5" /> Record Answer
                </Button>
              )}
              {status === 'recording' && (
                <Button onClick={stopRecording} size="lg" variant="destructive" className="w-48 animate-pulse">
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
                  Next Question
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
