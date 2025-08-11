'use client';

import { useState } from 'react';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/layout/logo';
import { useAuth } from '@/hooks/use-auth';
import { Menu } from 'lucide-react';

export default function Header() {
  const { isLoggedIn, toggleLogin, setLoggedIn } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleContribute = () => {
    if (isLoggedIn) {
      router.push('/contribute');
    } else {
      toggleLogin();
    }
    setIsSheetOpen(false);
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
    setIsSheetOpen(false);
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
    setIsSheetOpen(false);
  };
  
  const handleLogout = () => {
    toggleLogin();
    setIsSheetOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold">Xyvea</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" onClick={handleContribute}>
            Contribute
          </Button>
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
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={handleSignIn}>
                Log in
              </Button>
              <Button onClick={handleSignUp}>Sign up</Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[320px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 border-b pb-4">
                  <Logo />
                  <span className="text-xl font-bold">Xyvea</span>
                </div>
                <div className="flex flex-col gap-4 py-4 flex-grow">
                  <Button variant="ghost" className="justify-start text-lg" onClick={handleContribute}>
                    Contribute
                  </Button>
                  {isLoggedIn && (
                    <>
                     <Link href="/profile" onClick={() => setIsSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg">Profile</Button>
                     </Link>
                     <Link href="/settings" onClick={() => setIsSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-lg">Settings</Button>
                      </Link>
                    </>
                  )}
                </div>

                <div className="mt-auto border-t pt-4">
                  {isLoggedIn ? (
                    <Button className="w-full" onClick={handleLogout}>Log Out</Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full" onClick={handleSignIn}>
                        Log In
                      </Button>
                      <Button className="w-full" onClick={handleSignUp}>
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
