'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/layout/logo';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import HistorySidebar from './history-sidebar';

export default function Header() {
  const { isLoggedIn, toggleLogin } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/signin');
  }

  const handleSignUp = () => {
    router.push('/auth/signup');
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                  <span className="sr-only">Toggle History</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                 <HistorySidebar />
              </SheetContent>
            </Sheet>
          )}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold">Xyvea</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="profile avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User</p>
                    <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleLogin}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={handleSignIn}>
                   Log in
                </Button>
                <Button onClick={handleSignUp}>
                   Sign up
                </Button>
              </div>
            </>
          )}
           <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 pt-8">
                    {!isLoggedIn && (
                       <div className="flex flex-col gap-2 pt-4 border-t">
                        <Button variant="outline" asChild>
                           <Link href="/auth/signin">Log in</Link>
                        </Button>
                        <Button asChild>
                           <Link href="/auth/signup">Sign up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
