
'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, History, Menu } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function AppHeader() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">SiliconAI</span>
          </Link>
          <div className="hidden md:flex">
             <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/resume-analyzer" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Resume Analyzer
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                   <Link href="/past-interviews" legacyBehavior passHref>
                     <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Past Interviews
                     </NavigationMenuLink>
                   </Link>
                </NavigationMenuItem>
                 <NavigationMenuItem>
                   <Link href="#" legacyBehavior passHref>
                     <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "disabled:opacity-50 cursor-not-allowed")}>
                       Pricing
                     </NavigationMenuLink>
                   </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                    <div className="flex flex-col gap-4 py-4">
                        <SheetClose asChild>
                         <Link href="/resume-analyzer" className={navigationMenuTriggerStyle()}>
                            Resume Analyzer
                        </Link>
                        </SheetClose>
                        <SheetClose asChild>
                        <Link href="/past-interviews" className={navigationMenuTriggerStyle()}>
                            Past Interviews
                        </Link>
                        </SheetClose>
                        <SheetClose asChild>
                        <Link href="#" className={cn(navigationMenuTriggerStyle(), "disabled:opacity-50 cursor-not-allowed")}>
                            Pricing
                        </Link>
                        </SheetClose>
                    </div>
                    </SheetContent>
                </Sheet>
            </div>
           {(!isClient || isUserLoading) ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/past-interviews">
                      <History className="mr-2 h-4 w-4" />
                      <span>Interview History</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
        </div>
      </div>
    </header>
  );
}
