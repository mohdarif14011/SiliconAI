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
import { CheckCircle, TrendingUp, TrendingDown, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { generatePerformanceReport } from "@/ai/ai-performance-analytics";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const interviewId = params.interviewId as string;

  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      if (interviewId === 'latest') {
        const transcript = localStorage.getItem("latestInterviewTranscript");
        const role = localStorage.getItem("latestInterviewRole");

        if (transcript && role) {
          try {
            const performanceData = await generatePerformanceReport({
              interviewTranscript: transcript,
              selectedRole: role,
            });
            const newReport: InterviewReport = {
              id: "latest",
              role: role,
              date: new Date().toISOString(),
              overallScore: performanceData.overallScore,
              summary: "This is an AI generated summary of your performance.",
              strengths: performanceData.strengths,
              areasForImprovement: performanceData.weaknesses,
              skillFeedback: [], 
              questionFeedback: [], 
              actionableFeedback: performanceData.actionableFeedback,
            };
            setReport(newReport);
          } catch (error) {
            console.error("Error generating performance report:", error);
            toast({
              variant: "destructive",
              title: "Report Generation Failed",
              description: "Could not generate your performance report.",
            });
            // Fallback to mock report on error
            setReport(MOCK_REPORT);
          }
        } else {
           // If no latest interview, show mock data
           setReport(MOCK_REPORT);
        }
      } else {
        // For any other ID, show mock data.
        setReport(MOCK_REPORT);
      }
      setIsLoading(false);
    };

    fetchReport();
  }, [interviewId, toast]);

  if (isLoading || !report) {
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
               <p className="text-sm">{report.actionableFeedback}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
