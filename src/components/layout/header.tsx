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

export default function Header() {
  const { isLoggedIn, toggleLogin } = useAuth();
  const router = useRouter();

  const handleContributeClick = () => {
    if (isLoggedIn) {
      router.push('/contribute');
    } else {
      toggleLogin(); // This will show the login/signup page
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
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
                  <Link href="/contribute">Contribute</Link>
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
                 <Button variant="outline" onClick={handleContributeClick}>
                   Contribute
                </Button>
                <Button variant="ghost" asChild>
                   <Link href="/auth/signin">Log in</Link>
                </Button>
                <Button asChild>
                   <Link href="/auth/signup">Sign up</Link>
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
                     <nav className="flex flex-col gap-4">
                        <Link href="/contribute" onClick={handleContributeClick} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                          Contribute
                        </Link>
                    </nav>
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
