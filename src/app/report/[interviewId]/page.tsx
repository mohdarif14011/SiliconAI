"use client";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_REPORT } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { CheckCircle, ArrowRight, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function ReportPage() {
  const chartData = MOCK_REPORT.skillFeedback.map(item => ({ name: item.skill, score: item.score }));
  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader title={`Report: ${MOCK_REPORT.role}`} />
      <main className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Interview Performance</h2>
                <p className="text-muted-foreground">
                    Completed on {format(new Date(MOCK_REPORT.date), "MMMM d, yyyy")}
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
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                className="stroke-current text-gray-200 dark:text-gray-700"
                                strokeWidth="3"
                                fill="none"
                            />
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                className="stroke-current text-primary"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${MOCK_REPORT.overallScore}, 100`}
                                strokeLinecap="round"
                                transform="rotate(-90 18 18)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{MOCK_REPORT.overallScore}</span>
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
                            <p className="text-sm text-muted-foreground">{MOCK_REPORT.strengths}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <TrendingDown className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">Areas for Improvement</h4>
                            <p className="text-sm text-muted-foreground">{MOCK_REPORT.areasForImprovement}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Skill Breakdown</CardTitle>
                <CardDescription>Your performance across key skill areas.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis />
                            <Tooltip cursor={{fill: "hsl(var(--muted))"}} content={<ChartTooltipContent />} />
                            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question by Question Feedback</CardTitle>
            <CardDescription>Detailed analysis of each of your answers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {MOCK_REPORT.questionFeedback.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between pr-4">
                        <span className="text-left font-medium">Q{index+1}: {item.question}</span>
                        <Badge variant={item.score > 7 ? "default" : "secondary"}>{item.score}/10</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-1">Your Answer (transcribed)</h4>
                        <p className="text-sm text-muted-foreground italic">"{item.answer}"</p>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-1">Feedback</h4>
                        <p className="text-sm">{item.feedback}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
