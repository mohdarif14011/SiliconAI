import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <main className="flex flex-1 flex-col items-center">
        <section className="w-full py-20 md:py-32 lg:py-40 text-center relative">
          <div
            className="absolute inset-0 bg-no-repeat bg-center bg-contain"
            style={{ backgroundImage: "url('/hero-bg.svg')", opacity: 0.1, backgroundSize: '80% 80%' }}
          ></div>

          <div className="container px-4 md:px-6 relative">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary">
              Ready to Ace Your Next Interview?
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              AI mock interviews with personalized practice and real-time
              analytics - everything on Remasto
            </p>
            <div className="mt-8">
              <Card className="max-w-4xl mx-auto p-4 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-2">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <Select defaultValue="design-engineer">
                      <SelectTrigger className="w-full md:w-auto h-12 text-base">
                        <SelectValue placeholder="Job" />
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
                      <SelectTrigger className="w-full md:w-auto h-12 text-base">
                        <SelectValue placeholder="Search position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                     <Select>
                      <SelectTrigger className="w-full md:w-auto h-12 text-base">
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
                      className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
                      asChild
                    >
                      <Link href="/interview/design-engineer">
                        START PRACTICE
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
               <Link href="#" className="mt-6 inline-block text-primary underline">
                View sample analytics
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
