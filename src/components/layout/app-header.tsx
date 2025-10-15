import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RemastoLogo } from "./remasto-logo";
import { ChevronDown, Sparkles } from "lucide-react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="w-full bg-slate-900 text-white text-center py-2 text-sm">
        <Sparkles className="inline-block h-4 w-4 mr-2 text-yellow-400" />
        Just Dropped: Our new job portal with top startup opportunities →{" "}
        <Link href="#" className="underline font-semibold">
          Explore
        </Link>
      </div>
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <RemastoLogo />
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link
            href="#"
            className="flex items-center text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Interviews <ChevronDown className="ml-1 h-4 w-4" />
          </Link>
          <Link
            href="#"
            className="flex items-center text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Resume <ChevronDown className="ml-1 h-4 w-4" />
          </Link>
          <Link
            href="#"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Jobs
          </Link>
          <Link
            href="#"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/user/40/40" />
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Mohd Arif
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      m@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
      <div className="bg-accent border-y">
        <div className="container py-3">
          <div className="relative">
            <Input
              type="search"
              placeholder="Today, I want to prepare for Data Analyst"
              className="h-12 pl-4 pr-10 bg-background"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
