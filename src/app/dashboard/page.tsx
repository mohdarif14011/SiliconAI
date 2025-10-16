
'use client';

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROLES, type Interview } from "@/lib/data";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

function RecentInterviews() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const interviewsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, `users/${user.uid}/interviews`),
      orderBy("date", "desc"),
      limit(3)
    );
  }, [firestore, user]);

  const { data: interviews, isLoading } = useCollection<Interview>(interviewsQuery);
  
  if (isUserLoading || (user && isLoading)) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !interviews || interviews.length === 0) {
    return null; // Don't show the section if not logged in or no interviews
  }

  return (
     <section className="w-full max-w-6xl mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
           <CardFooter className="flex justify-end">
                <Button asChild variant="outline">
                    <Link href="/past-interviews">View All Interviews</Link>
                </Button>
            </CardFooter>
        </Card>
      </section>
  )
}


export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("design-engineer");

  const handleStartPractice = () => {
    if (user) {
      router.push(`/interview/${selectedRole}`);
    } else {
      router.push(`/login?redirect=/interview/${selectedRole}`);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <main className="flex flex-1 flex-col items-center p-4 md:p-8">
        <section className="w-full max-w-6xl mx-auto text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
              Ready to Ace Your Next Interview?
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              AI mock interviews with personalized practice and real-time
              analytics - everything on SiliconAI
            </p>
            <div className="mt-12">
              <Card className="max-w-xl mx-auto p-4 bg-card shadow-lg border-gray-200">
                <CardContent className="p-2">
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Design..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.slug} value={role.slug}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Search..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select Round" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      onClick={handleStartPractice}
                    >
                      START PRACTICE
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Link
                href="/report/mock"
                className="mt-8 inline-block text-primary underline"
              >
                View sample analytics
              </Link>
            </div>
          </div>
        </section>

        <RecentInterviews />

      </main>
    </div>
  );
}
