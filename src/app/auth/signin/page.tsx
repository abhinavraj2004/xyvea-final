import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Logo } from '@/components/layout/logo';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-67.4 64.9C331.7 100.2 292.5 82 248 82c-74.3 0-134.3 60-134.3 134s60 134 134.3 134c83.8 0 119.2-64.2 122.3-97.1H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
  </svg>
);


export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Welcome back to Xyvea.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button variant="outline" className="w-full">
            <GoogleIcon />
            Sign in with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Sign in</Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
