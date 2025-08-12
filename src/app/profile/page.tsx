'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, GitFork, CheckCircle, Pencil, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from '@/hooks/use-auth';
import { getUserContributions, Contribution, ContributionStats } from '@/lib/firestore';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchContributions = async () => {
        setLoading(true);
        const { contributions: userContributions, stats: userStats } = await getUserContributions(user.uid);
        setContributions(userContributions);
        setStats(userStats);
        setLoading(false);
      };
      fetchContributions();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
       <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
         <p>Please log in to view your profile.</p>
         <Link href="/auth/signin">
            <Button className="mt-4">Log In</Button>
         </Link>
       </div>
    )
  }

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
              <span className="font-semibold text-primary">{user.reputation || 0}</span>
              <span className="text-muted-foreground">Reputation</span>
            </div>
            <Badge variant={user.subscriptionTier === 'pro' ? 'default' : 'secondary'} className="capitalize">
              {user.subscriptionTier || 'free'} Tier
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
              <span className="font-bold text-lg">{stats?.totalContributions || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><CheckCircle size={16}/> Verified Links</span>
              <span className="font-bold text-lg">{stats?.verifiedLinks || 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your collection of achievements will appear here. (Coming Soon)</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {contributions.length > 0 ? (
              <ul className="space-y-4">
                {contributions.map(activity => (
                  <li key={activity.id} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      {activity.type === 'link' ? <GitFork className="text-primary" size={16}/> : <List className="text-primary" size={16} />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-muted-foreground flex-grow">{activity.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
