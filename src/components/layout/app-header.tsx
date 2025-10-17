
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Settings } from "lucide-react";
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
import { cn } from "@/lib/utils";
import React from "react";


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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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


export function AppHeader() {
  const mainNavLinks = [
    { href: "/past-interviews", label: "Past Interviews" },
    { href: "/resume-analyzer", label: "Resume" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="https://res.cloudinary.com/donszbe80/image/upload/v1760549926/Logo_si_ygvrru.png" alt="SiliconAI Logo" width={32} height={32} className="rounded-full" />
            <span className="font-bold">SiliconAI</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Interviews</NavigationMenuTrigger>
                    <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {ROLES.map((role) => (
                        <ListItem
                            key={role.name}
                            title={role.name}
                            href={`/interview/${role.slug}`}
                        >
                            {role.description}
                        </ListItem>
                        ))}
                    </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

              {mainNavLinks.map(link => (
                 <NavigationMenuItem key={link.href}>
                    <Link href={link.href} passHref>
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
        <div className="flex-1 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2">
                 <Image src="https://res.cloudinary.com/donszbe80/image/upload/v1760549926/Logo_si_ygvrru.png" alt="SiliconAI Logo" width={28} height={28} className="rounded-full" />
                <span className="font-bold">SiliconAI</span>
              </Link>
              <div className="grid gap-4 py-6">
                  <Link href="/dashboard" className="flex w-full items-center py-2 text-lg font-semibold">Dashboard</Link>
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
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5"/></Button>
            <UserNav />
        </div>
      </div>
    </header>
  );
}
