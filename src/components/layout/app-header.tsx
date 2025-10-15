
'use client';

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
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AppHeader() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full bg-slate-900 text-white text-center py-2 text-sm">
        <Sparkles className="inline-block h-4 w-4 mr-2 text-yellow-400" />
        New Feature: AI Resume Analyzer →{" "}
        <Link href="#" className="underline font-semibold">
          Try it now
        </Link>
      </div>
      <div className="container flex h-16 items-center">
        <div className="mr-4 lg:mr-8 flex">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <RemastoLogo />
          </Link>
        </div>
        <nav className="hidden items-center space-x-2 lg:space-x-6 text-sm font-medium md:flex">
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
        <div className="flex flex-1 items-center justify-end space-x-2 lg:space-x-4">
          <nav className="flex items-center space-x-2">
            {isClient && (isUserLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || `https://picsum.photos/seed/user/40/40`} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
