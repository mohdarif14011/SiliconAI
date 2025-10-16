
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_REPORT, type InterviewReport } from "@/lib/data";
import { format } from "date-fns";
import { CheckCircle, TrendingUp, TrendingDown, RefreshCw, Loader2, Star } from "lucide-react";
import Link from "next/link";
import { generatePerformanceReport } from "@/ai/ai-performance-analytics";
import { useToast } from "@/hooks/use-toast";
import { useDoc, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const interviewId = params.interviewId as string;
  
  const { user } = useUser();
  const firestore = useFirestore();

  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const interviewDocRef = useMemoFirebase(() => {
    if (!user || interviewId === 'latest' || interviewId === 'mock') return null;
    return doc(firestore, `users/${user.uid}/interviews`, interviewId);
  }, [firestore, user, interviewId]);

  const { data: firestoreReport, isLoading: isFirestoreLoading } = useDoc<InterviewReport>(interviewDocRef);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      if (interviewId === 'latest') {
        const transcript = localStorage.getItem("latestInterviewTranscript");
        const role = localStorage.getItem("latestInterviewRole");

        if (transcript && role && user) {
          try {
            const performanceData = await generatePerformanceReport({
              interviewTranscript: transcript,
              selectedRole: role,
            });

            const newReport: Omit<InterviewReport, 'id'> = {
              role: role,
              date: new Date().toISOString(),
              overallScore: performanceData.overallScore,
              summary: "This is an AI generated summary of your performance.",
              strengths: performanceData.strengths,
              areasForImprovement: performanceData.weaknesses,
              skillFeedback: [],
              questionFeedback: [],
              actionableFeedback: performanceData.actionableFeedback,
              userId: user.uid,
              transcript: transcript,
            };

            // Save to Firestore
            const docRef = await addDoc(collection(firestore, `users/${user.uid}/interviews`), newReport);
            
            // Clear local storage
            localStorage.removeItem("latestInterviewTranscript");
            localStorage.removeItem("latestInterviewRole");

            // Redirect to the newly created report page
            router.replace(`/report/${docRef.id}`);

          } catch (error) {
            console.error("Error generating or saving performance report:", error);
            toast({
              variant: "destructive",
              title: "Report Generation Failed",
              description: "Could not generate or save your performance report.",
            });
            setReport(MOCK_REPORT); // Fallback to mock
            setIsLoading(false);
          }
        } else {
           // If no latest interview data, show mock data
           toast({ title: "No interview data found", description: "Displaying a sample report."});
           setReport(MOCK_REPORT);
           setIsLoading(false);
        }
      } else if (interviewId === 'mock') {
        setReport(MOCK_REPORT);
        setIsLoading(false);
      } else {
        // For a specific ID, firestoreReport will be fetched by the useDoc hook
        if (!isFirestoreLoading) {
           if (firestoreReport) {
             setReport(firestoreReport);
           } else {
             toast({ variant: 'destructive', title: "Report not found" });
             setReport(MOCK_REPORT); // Fallback
           }
           setIsLoading(false);
        }
      }
    };

    fetchReport();
  }, [interviewId, toast, user, firestore, router, firestoreReport, isFirestoreLoading]);

  if (isLoading || isFirestoreLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <PageHeader title="Generating Report..." />
        <main className="flex flex-1 items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">Please wait while we analyze your interview...</p>
            </div>
        </main>
      </div>
    );
  }

  if (!report) {
    // This can happen if the report is not found or on error
    return (
      <div className="flex min-h-screen w-full flex-col">
        <PageHeader title="Error" />
        <main className="flex flex-1 items-center justify-center p-8 text-center">
            <div>
              <h2 className="text-2xl font-bold">Report Not Found</h2>
              <p className="text-muted-foreground mt-2">We couldn't find the report you were looking for.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
        </main>
      </div>
    )
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader title={`Report: ${report.role}`} />
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Interview Performance</h2>
                <p className="text-muted-foreground">
                    Completed on {format(new Date(report.date), "MMMM d, yyyy")}
                </p>
            </div>
            <Button asChild>
                <Link href="/dashboard">
                    <RefreshCw className="mr-2 h-4 w-4"/>
                    Start New Interview
                </Link>
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Overall Score</CardTitle>
                    <CardDescription>Your final performance score.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                    <div className="relative h-40 w-40">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                className="stroke-current text-gray-200 dark:text-gray-700"
                                strokeWidth="3"
                                fill="none"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                className="stroke-current text-primary"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${report.overallScore}, 100`}
                                strokeLinecap="round"
                                transform="rotate(-90 18 18)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{report.overallScore}</span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>AI Summary</CardTitle>
                    <CardDescription>Key takeaways from your interview.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Strengths</h4>
                            <p className="text-sm text-muted-foreground">{report.strengths}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <TrendingDown className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Areas for Improvement</h4>
                            <p className="text-sm text-muted-foreground">{report.areasForImprovement}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {report.actionableFeedback && (
          <Card>
            <CardHeader>
              <CardTitle>Actionable Feedback</CardTitle>
              <CardDescription>Specific steps you can take to improve your performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.actionableFeedback.split(/\d+\./).filter(s => s.trim()).map((item, index) => (
                   <div key={index} className="flex items-start gap-3">
                        <Star className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                        <p className="text-sm">{item.trim()}</p>
                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
