
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
import { Sparkles } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

const interviewPositions = [
  { title: "Software Engineer", href: "#" },
  { title: "Business Analyst", href: "#" },
  { title: "Data Analyst", href: "#" },
  { title: "Sales Executive", href: "#" },
  { title: "Machine Learning Engineer", href: "#" },
  { title: "DevOps Engineer", href: "#" },
];

const interviewCompanies = [
  { title: "JPMorgan Chase", href: "#" },
  { title: "Netflix", href: "#" },
  { title: "HCL", href: "#" },
  { title: "NVIDIA", href: "#" },
  { title: "Cognizant", href: "#" },
  { title: "Wipro", href: "#" },
];

const otherInterviews = [
    { title: "Salary Negotiation Interview", href: "#"},
    { title: "Interviews by Job Description", href: "#"},
    { title: "Create Your Interviews", href: "#"},
    { title: "System Design Interview", href: "#"},
]

const moreInterviewLinks = [
    { title: "Performance Review Interview", href: "#"},
    { title: "MBA Admission Interview", href: "#"},
    { title: "Interview Coach", href: "#"},
    { title: "Request Role", href: "#"},
]

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
        {isClient && (
          <>
            <Sparkles className="inline-block h-4 w-4 mr-2 text-yellow-400" />
            New Feature: AI Resume Analyzer →{" "}
            <Link href="/resume-analyzer" className="underline font-semibold">
              Try it now
            </Link>
          </>
        )}
      </div>
      <div className="container flex h-16 items-center">
        <div className="mr-4 lg:mr-8 flex">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <RemastoLogo />
          </Link>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Interviews</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 lg:w-[800px] lg:grid-cols-4 gap-4 p-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">By Position</h3>
                    <ul className="space-y-2">
                      {interviewPositions.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} />
                      ))}
                    </ul>
                    <Link href="#" className="text-sm text-primary hover:underline mt-2 inline-block">Explore More »</Link>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-2">By Company</h3>
                    <ul className="space-y-2">
                      {interviewCompanies.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} />
                      ))}
                    </ul>
                     <Link href="#" className="text-sm text-primary hover:underline mt-2 inline-block">Explore More »</Link>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Other Interviews</h3>
                    <ul className="space-y-2">
                      {otherInterviews.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} />
                      ))}
                    </ul>
                  </div>
                   <div>
                    <h3 className="font-semibold text-sm mb-2">More</h3>
                    <ul className="space-y-2">
                      {moreInterviewLinks.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href} />
                      ))}
                    </ul>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
             <NavigationMenuItem>
                <Link href="/resume-analyzer" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Resume
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
             <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Jobs
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
             <NavigationMenuItem>
                <Link href="#" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Pricing
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
