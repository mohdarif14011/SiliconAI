
'use client';

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INTERVIEWS } from "@/lib/data";
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
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export default function PastInterviewsPage() {

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
                  {INTERVIEWS.map((interview) => (
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
                            interview.score > 80
                              ? "default"
                              : "secondary"
                          }
                          className={
                            interview.score > 80
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {interview.score}/100
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
          </Card>
        </section>
      </main>
    </div>
  );
}
