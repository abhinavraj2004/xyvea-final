
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, GitFork, CheckCircle, Pencil, Star } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const user = {
  displayName: "Alex Researcher",
  email: "alex.r@example.com",
  reputation: 142,
  subscriptionTier: "free",
  photoURL: "https://placehold.co/100x100.png",
};

const stats = {
  contributions: 28,
  verifiedLinks: 15,
};

const recentActivity = [
  { id: 1, type: "link", description: "Proposed a link between 'AI Development' and 'Job Market Disruption'." },
  { id: 2, type: "concept", description: "Added the concept 'Quantum Entanglement'." },
  { id: 3, type: "link", description: "Proposed a link between 'Dietary Habits' and 'Cardiovascular Health'." },
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-start gap-8">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="profile picture" />
          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow text-center sm:text-left">
          <h1 className="text-4xl font-bold">{user.displayName}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{user.email}</p>
          <div className="mt-4 flex justify-center sm:justify-start items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" size={20} />
              <span className="font-semibold text-primary">{user.reputation}</span>
              <span className="text-muted-foreground">Reputation</span>
            </div>
            <Badge variant={user.subscriptionTier === 'pro' ? 'default' : 'secondary'} className="capitalize">
              {user.subscriptionTier} Tier
            </Badge>
          </div>
        </div>
        <Link href="/settings">
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><List size={16}/> Total Contributions</span>
              <span className="font-bold text-lg">{stats.contributions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><CheckCircle size={16}/> Verified Links</span>
              <span className="font-bold text-lg">{stats.verifiedLinks}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your collection of achievements will appear here. (Placeholder)</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map(activity => (
                <li key={activity.id} className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full mt-1">
                    {activity.type === 'link' ? <GitFork className="text-primary" size={16}/> : <List className="text-primary" size={16} />}
                  </div>
                  <p className="text-muted-foreground flex-grow">{activity.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
