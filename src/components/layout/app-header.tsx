
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { useUser } from "@/firebase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { getAuth, signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLES } from "@/lib/data";

function UserNav() {
    const { user } = useUser();
    const auth = getAuth();

    const handleSignOut = () => {
        signOut(auth);
    }

    if (!user) {
        return (
            <Button asChild>
                <Link href="/login">Log In</Link>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
                        <AvatarFallback>{user.displayName?.[0] ?? user.email?.[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    )
}

export function AppHeader() {
  const mainNavLinks = [
    { href: "/past-interviews", label: "Past Interviews" },
    { href: "/resume-analyzer", label: "Resume" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-5">
        {/* Mobile Nav */}
        <div className="flex-1 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                 <Image src="https://res.cloudinary.com/donszbe80/image/upload/v1760549926/Logo_si_ygvrru.png" alt="SiliconAI Logo" width={28} height={28} className="rounded-full" />
                <span className="font-bold">SiliconAI</span>
              </Link>
              <div className="grid gap-4">
                  <Link href="/dashboard" className="flex w-full items-center py-2 text-lg font-semibold">Dashboard</Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center py-2 text-lg font-semibold text-muted-foreground">
                            Interviews <ChevronDown className="ml-2 h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        {ROLES.map(role => (
                            <DropdownMenuItem key={role.slug} asChild>
                                <Link href={`/interview/${role.slug}`}>{role.name}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {mainNavLinks.map((link) => (
                      <Link
                          key={link.href}
                          href={link.href}
                          className="flex w-full items-center py-2 text-lg font-semibold text-muted-foreground"
                      >
                          {link.label}
                      </Link>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Nav */}
        <div className="mr-4 hidden md:flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Image src="https://res.cloudinary.com/donszbe80/image/upload/v1760549926/Logo_si_ygvrru.png" alt="SiliconAI Logo" width={32} height={32} className="rounded-full" />
            <span className="font-bold">SiliconAI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                        Interviews <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {ROLES.map(role => (
                         <DropdownMenuItem key={role.slug} asChild>
                           <Link href={`/interview/${role.slug}`}>{role.name}</Link>
                         </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
             </DropdownMenu>

            {mainNavLinks.map(link => (
                <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <UserNav />
        </div>
      </div>
    </header>
  );
}
