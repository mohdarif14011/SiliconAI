
'use client';

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { analyzeResume } from "@/ai/ai-resume-analyzer";
import type { ResumeAnalysisOutput } from "@/ai/types";
import { Loader2, Wand2, Star, Lightbulb, CheckCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResumeAnalyzerPage() {
    const { toast } = useToast();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescriptionText, setJobDescriptionText] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [resumeFileName, setResumeFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisOutput | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setResumeFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setResumeText(text);
            };
            reader.onerror = () => {
                toast({
                    variant: "destructive",
                    title: "File Read Error",
                    description: "Could not read the selected file. Please try again."
                });
                setResumeFileName('');
                setResumeText('');
            };
            reader.readAsText(file);
        }
    };

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeResume({ 
                jobTitle: jobTitle,
                jobDescription: jobDescriptionText,
                resume: resumeText 
            });
            setAnalysisResult(result);
        } catch (error) {
            console.error("Error analyzing resume:", error);
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "There was an error analyzing your resume. Please try again."
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <PageHeader title="AI Resume Analyzer" />
            <main className="flex-1 space-y-8 p-4 md:p-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Analyze Your Resume</CardTitle>
                        <CardDescription>Enter the job details and upload your resume to get an AI-powered analysis.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="job-title">Job Title</Label>
                            <Input 
                                id="job-title"
                                placeholder="e.g., Senior Verification Engineer" 
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="job-description">Job Description</Label>
                                <Textarea 
                                    id="job-description"
                                    placeholder="Paste the job description here..." 
                                    className="h-96 font-mono text-xs"
                                    value={jobDescriptionText}
                                    onChange={(e) => setJobDescriptionText(e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="resume-file">Your Resume</Label>
                                 <Input 
                                    id="resume-file"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".txt,.md,.rtf"
                                    className="pt-2 text-sm"
                                 />
                                 {resumeFileName && (
                                     <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                                         <FileText className="h-4 w-4" />
                                         <span>{resumeFileName}</span>
                                     </div>
                                 )}
                                 {!resumeText && (
                                    <div className="h-80 rounded-md border border-dashed flex items-center justify-center text-center text-muted-foreground p-4">
                                        <p>Upload your resume file to begin.<br/>(Supported formats: .txt, .md, .rtf)</p>
                                    </div>
                                 )}
                                 {resumeText && (
                                     <Textarea 
                                        readOnly
                                        value={resumeText}
                                        className="h-80 font-mono text-xs bg-muted/30"
                                     />
                                 )}
                            </div>
                        </div>
                    </CardContent>
                 </Card>

                 <div className="text-center">
                    <Button onClick={handleAnalyze} size="lg" disabled={isLoading || !resumeText || !jobDescriptionText || !jobTitle}>
                        {isLoading ? <><Loader2 className="animate-spin mr-2"/>Analyzing...</> : <><Wand2 className="mr-2"/>Analyze Resume</>}
                    </Button>
                </div>

                {isLoading && (
                    <Card>
                        <CardContent className="p-12 flex flex-col items-center justify-center gap-4 text-center">
                           <Loader2 className="h-12 w-12 animate-spin text-primary" />
                           <h3 className="text-xl font-semibold">Analyzing your documents...</h3>
                           <p className="text-muted-foreground">The AI is comparing your resume against the job description to find key insights.</p>
                        </CardContent>
                    </Card>
                )}

                {analysisResult && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Result</CardTitle>
                            <CardDescription>Here's how your resume stacks up against the job description.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-center p-6 bg-accent/50 rounded-lg">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Overall Match Score</p>
                                    <p className="text-6xl font-bold text-primary">{analysisResult.matchScore}<span className="text-3xl text-muted-foreground">/100</span></p>
                                    <p className="font-semibold mt-1">{analysisResult.matchStrength}</p>
                                </div>
                            </div>
                            
                             <div className="grid md:grid-cols-2 gap-6">
                               <Card>
                                   <CardHeader className="flex-row items-center gap-3 space-y-0">
                                       <Lightbulb className="h-6 w-6 text-primary"/>
                                       <CardTitle>AI Summary</CardTitle>
                                   </CardHeader>
                                   <CardContent>
                                        <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                                   </CardContent>
                               </Card>
                                <Card>
                                   <CardHeader className="flex-row items-center gap-3 space-y-0">
                                       <CheckCircle className="h-6 w-6 text-green-500"/>
                                       <CardTitle>Keyword Alignment</CardTitle>
                                   </CardHeader>
                                   <CardContent>
                                       <div>
                                           <h4 className="font-semibold text-sm mb-2">Keywords Found:</h4>
                                           <div className="flex flex-wrap gap-2">
                                                {analysisResult.keywords.found.map(kw => <span key={kw} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{kw}</span>)}
                                           </div>
                                       </div>
                                       <div className="mt-4">
                                           <h4 className="font-semibold text-sm mb-2">Keywords Missing:</h4>
                                           <div className="flex flex-wrap gap-2">
                                                {analysisResult.keywords.missing.map(kw => <span key={kw} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{kw}</span>)}
                                           </div>
                                       </div>
                                   </CardContent>
                               </Card>
                             </div>

                             <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3"><Star className="h-5 w-5 text-yellow-400"/>Actionable Suggestions</h3>
                                <div className="space-y-3">
                                    {analysisResult.suggestions.map((suggestion, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-md border">
                                            <div className="flex-shrink-0 bg-primary/10 text-primary h-6 w-6 flex items-center justify-center rounded-full font-bold text-sm mt-1">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}
