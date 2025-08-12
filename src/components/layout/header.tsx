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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/layout/logo';
import { useAuth } from '@/hooks/use-auth';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarVisible: boolean;
};

export default function Header({ onToggleSidebar, isSidebarVisible }: HeaderProps) {
  const { isLoggedIn, toggleLogin, user, logout } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleContribute = () => {
    router.push('/contribute');
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
    logout();
    setIsSheetOpen(false);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side for both Desktop and Mobile */}
        <div className="flex items-center gap-4">
          {/* Desktop Sidebar Toggle */}
          {isLoggedIn && (
             <Button onClick={onToggleSidebar} variant="ghost" size="icon" className="hidden md:flex">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}

          {/* Mobile Menu Sheet */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[320px] p-0">
                 <SheetHeader className="p-4 border-b">
                   <SheetTitle>
                    <div className="flex items-center gap-2">
                      <Logo />
                      <span className="text-xl font-bold">Xyvea</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                 {isLoggedIn ? (
                   <Sidebar isSheet={true} onLinkClick={() => setIsSheetOpen(false)} />
                 ) : (
                  <>
                    <div className="flex flex-col h-full p-4">
                      <div className="flex flex-col gap-4 flex-grow">
                        <Button variant="ghost" className="justify-start text-lg" onClick={handleContribute}>
                          Contribute
                        </Button>
                      </div>

                      <div className="mt-auto border-t pt-4">
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" className="w-full" onClick={handleSignIn}>
                            Log In
                          </Button>
                          <Button className="w-full" onClick={handleSignUp}>
                            Sign Up
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                 )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo and App Name */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold hidden sm:inline-block">Xyvea</span>
          </Link>
        </div>

        {/* Right side for both Desktop and Mobile */}
        <div className="flex items-center gap-2">
          {!isLoggedIn && (
            <Button variant="ghost" className="hidden md:inline-flex" onClick={handleContribute}>
              Contribute
            </Button>
          )}
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
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
            <div className='flex items-center gap-2'>
              <Button variant="ghost" className='hidden md:inline-flex' onClick={handleSignIn}>
                Log in
              </Button>
              <Button className='hidden md:inline-flex' onClick={handleSignUp}>Sign up</Button>
              <Button variant="ghost" className="md:hidden" onClick={handleSignIn}>
                Log in
              </Button>
               <Button size="sm" className="md:hidden" onClick={handleSignUp}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
