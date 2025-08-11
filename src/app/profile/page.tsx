import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  // Mock user data
  const user = {
    displayName: "Alex Researcher",
    email: "alex.r@example.com",
    reputation: 142,
    subscriptionTier: "free",
    photoURL: "https://placehold.co/100x100.png",
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="profile picture" />
          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold">{user.displayName}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{user.email}</p>
          <div className="mt-4 flex justify-center sm:justify-start items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">{user.reputation}</span>
              <span className="text-muted-foreground">Reputation</span>
            </div>
            <Badge variant={user.subscriptionTier === 'pro' ? 'default' : 'secondary'} className="capitalize">
              {user.subscriptionTier} Tier
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your collection of achievements will appear here. (Placeholder)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
