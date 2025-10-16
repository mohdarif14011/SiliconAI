
'use client';

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowRight, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import type { Interview } from "@/lib/data";

export default function PastInterviewsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const interviewsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, `users/${user.uid}/interviews`),
      orderBy("date", "desc")
    );
  }, [firestore, user]);

  const { data: interviews, isLoading } = useCollection<Interview>(interviewsQuery);

  return (
    <div className="flex-1 overflow-auto">
       <PageHeader title="Past Interviews" />
      <main className="flex flex-1 flex-col items-center p-4 md:p-8">
        <section className="w-full max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Interview History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading || isUserLoading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : interviews && interviews.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Report</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">
                          {interview.role}
                        </TableCell>
                        <TableCell>
                          {format(new Date(interview.date), "MMMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              interview.overallScore > 80
                                ? "default"
                                : "secondary"
                            }
                            className={
                              interview.overallScore > 80
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {interview.overallScore}/100
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/report/${interview.id}`}>
                              View <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No interviews found.</h3>
                  <p className="text-muted-foreground mt-2">Complete an interview to see your history here.</p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard">Start an Interview</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
