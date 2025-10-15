
'use client';

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ResumeAnalyzerPage() {
    const [resumeText, setResumeText] = useState('');
    const [jobDescriptionText, setJobDescriptionText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = async () => {
        // Placeholder for AI analysis logic
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        setAnalysisResult({
            score: 88,
            match: "Strong match",
            keywords: "React, Node.js, TypeScript, Next.js",
            summary: "The resume shows strong alignment with the job description, particularly in front-end technologies."
        });
        setIsLoading(false);
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <PageHeader title="AI Resume Analyzer" />
            <main className="flex-1 space-y-8 p-4 md:p-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Resume</CardTitle>
                            <CardDescription>Paste the text from your resume below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                placeholder="Paste your resume here..." 
                                className="h-96"
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Job Description</CardTitle>
                            <CardDescription>Paste the text from the job description.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                placeholder="Paste the job description here..." 
                                className="h-96"
                                value={jobDescriptionText}
                                onChange={(e) => setJobDescriptionText(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>
                 <div className="text-center">
                    <Button onClick={handleAnalyze} size="lg" disabled={isLoading || !resumeText || !jobDescriptionText}>
                        {isLoading ? "Analyzing..." : "Analyze Resume"}
                    </Button>
                </div>

                {analysisResult && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Result</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Overall Score: {analysisResult.score}/100</h3>
                                <p className="text-sm text-muted-foreground">This score represents how well your resume matches the job description.</p>
                            </div>
                             <div>
                                <h3 className="font-semibold">Match Strength: {analysisResult.match}</h3>
                            </div>
                            <div>
                                <h3 className="font-semibold">Keywords Alignment</h3>
                                <p className="text-sm text-muted-foreground">{analysisResult.keywords}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">AI Summary</h3>
                                <p className="text-sm">{analysisResult.summary}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}
