
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
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
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/resume-analyzer", label: "Resume Analyzer" },
    { href: "/past-interviews", label: "Past Interviews" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-lg">
            SiliconAI
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map(link => (
                 <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {link.label}
                        </NavigationMenuLink>
                    </Link>
                 </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="flex items-center font-bold text-lg">
              SiliconAI
            </Link>
            <div className="grid gap-4 py-6">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex w-full items-center py-2 text-lg font-semibold"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <UserNav />
        </div>
      </div>
    </header>
  );
}
