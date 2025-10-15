import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { ROLES, INTERVIEWS } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Eye } from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeader title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            Choose Your Path
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((role) => {
              const roleImage = getImage(role.image);
              return (
                <Card key={role.slug} className="flex flex-col">
                  <CardHeader className="flex-row items-start gap-4">
                    <role.icon className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {roleImage && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-md">
                        <Image
                          src={roleImage.imageUrl}
                          alt={roleImage.description}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          data-ai-hint={roleImage.imageHint}
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/interview/${role.slug}`}>
                        Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            Recent Interviews
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          interview.score > 80 ? "default" : "secondary"
                        }
                        className={
                          interview.score > 80
                            ? "bg-green-600/20 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-600/30"
                            : interview.score > 60
                            ? "bg-yellow-600/20 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-600/30"
                            : "bg-red-600/20 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-600/30"
                        }
                      >
                        {interview.score}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/report/${interview.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View Report
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </main>
    </div>
  );
}
