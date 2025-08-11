'use client';

import Link from 'next/link';
import { useState } from 'react';
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
import { Menu, X } from 'lucide-react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Explore' },
  { href: '/contribute', label: 'Contribute' },
  { href: '/gopro', label: 'Go Pro' },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  // This function is for demonstrating the logged-in state without a full auth system.
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex">
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={toggleLogin}>
                Log In
              </Button>
              <Button onClick={toggleLogin}>Sign Up</Button>
            </div>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col gap-4 p-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-4">
              {isLoggedIn ? (
                <div className="flex flex-col gap-4">
                    <Link href="/profile" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                    <Link href="/settings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
                    <Button variant="ghost" onClick={() => { toggleLogin(); setIsMobileMenuOpen(false); }}>Log Out</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" onClick={() => { toggleLogin(); setIsMobileMenuOpen(false); }}>Log In</Button>
                  <Button onClick={() => { toggleLogin(); setIsMobileMenuOpen(false); }}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
