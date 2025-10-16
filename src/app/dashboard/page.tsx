
'use client';

import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/data";
import { useUser } from "@/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
              <Card className="max-w-4xl mx-auto p-4 bg-card shadow-lg border-gray-200">
                <CardContent className="p-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-full h-12 text-base">
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
                      <SelectTrigger className="w-full h-12 text-base">
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
                      <SelectTrigger className="w-full h-12 text-base">
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
      </main>
    </div>
  );
}
