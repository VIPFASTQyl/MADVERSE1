/**
 * Phase 1 Integration Examples
 * 
 * This file contains examples of how to integrate Phase 1 features
 * into different pages and components of your application.
 */

// ============ EXAMPLE 1: Activity Showcase with Favorites ============
// File: src/pages/ActivityShowcase.tsx

import { useEffect, useState } from 'react';
import ActivityCard from '@/components/ActivityCard';
import { historyService } from '@/lib/phase1Service';
import { useAuth } from '@/contexts/AuthContext';

export function ActivityShowcase() {
  const { user } = useAuth();

  // Mock activities - replace with actual API call
  const activities = [
    {
      id: 'art-001',
      title: 'Modern Art Exhibition',
      category: 'Arts',
      date: '2026-02-15',
      location: 'Downtown Gallery',
      participants: 42,
      image: '/images/art-exhibition.jpg',
      description: 'Explore contemporary art from local artists',
    },
    {
      id: 'sports-001',
      title: 'Basketball Tournament',
      category: 'Sports',
      date: '2026-02-20',
      location: 'City Sports Complex',
      participants: 128,
      image: '/images/basketball.jpg',
      description: 'Join the community basketball tournament',
    },
    // ... more activities
  ];

  const handleActivityView = async (activityId: string) => {
    if (user) {
      await historyService.trackAction(user.id, activityId, 'viewed');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {activities.map((activity) => (
        <div
          key={activity.id}
          onClick={() => handleActivityView(activity.id)}
        >
          <ActivityCard
            id={activity.id}
            title={activity.title}
            category={activity.category}
            date={activity.date}
            location={activity.location}
            participants={activity.participants}
            image={activity.image}
            description={activity.description}
            onRegisterSuccess={() => {
              console.log('User registered for activity');
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ============ EXAMPLE 2: User Dashboard with My Activities ============
// File: src/pages/Dashboard.tsx

import MyActivitiesSection from '@/components/MyActivitiesSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { historyService } from '@/lib/phase1Service';
import { useState, useEffect } from 'react';

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    const stats = await historyService.getActivityStats(user!.id);
    setStats(stats);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats?.total_viewed || 0}</div>
              <p className="text-sm text-muted-foreground">Activities Viewed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats?.total_registered || 0}</div>
              <p className="text-sm text-muted-foreground">Registered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats?.total_completed || 0}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats?.total_favorited || 0}</div>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Activities */}
      <MyActivitiesSection />
    </div>
  );
}

// ============ EXAMPLE 3: Interest-Based Activity Recommendations ============
// File: src/components/PersonalizedRecommendations.tsx

import { useEffect, useState } from 'react';
import { profileService } from '@/lib/phase1Service';
import { useAuth } from '@/contexts/AuthContext';
import ActivityCard from './ActivityCard';

export function PersonalizedRecommendations() {
  const { user } = useAuth();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    const profile = await profileService.getProfile(user!.id);
    if (profile?.interests) {
      setUserInterests(profile.interests);
      // Load activities matching user interests
      // This would typically call your activity API
      filterRecommendations(profile.interests);
    }
  };

  const filterRecommendations = (interests: string[]) => {
    // Mock implementation - replace with actual API call
    const activities = [
      {
        id: 'art-002',
        title: 'Painting Workshop',
        category: 'Arts',
        // ... other properties
      },
      {
        id: 'culture-001',
        title: 'Cultural Fest',
        category: 'Culture',
        // ... other properties
      },
    ];

    const recommended = activities.filter((activity) =>
      interests.includes(activity.category)
    );

    setRecommendations(recommended);
  };

  if (userInterests.length === 0) {
    return <p>Update your interests to get personalized recommendations!</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Activities for {userInterests.join(', ')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((activity) => (
          <ActivityCard key={activity.id} {...activity} />
        ))}
      </div>
    </div>
  );
}

// ============ EXAMPLE 4: Single Activity Page with All Features ============
// File: src/pages/ActivityDetail.tsx

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  favoriteService,
  registrationService,
  historyService,
} from '@/lib/phase1Service';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function ActivityDetail() {
  const { activityId } = useParams<{ activityId: string }>();
  const { user } = useAuth();
  const [activity, setActivity] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (activityId && user) {
      loadActivity();
      checkUserStatus();
      trackView();
    }
  }, [activityId, user]);

  const loadActivity = async () => {
    // Load activity from your API
    // setActivity(data);
  };

  const checkUserStatus = async () => {
    const favorited = await favoriteService.isFavorited(user!.id, activityId!);
    const registered = await registrationService.isRegistered(
      user!.id,
      activityId!
    );
    setIsFavorited(favorited);
    setIsRegistered(registered);
  };

  const trackView = async () => {
    await historyService.trackAction(user!.id, activityId!, 'viewed');
  };

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(user!.id, activityId!);
        setIsFavorited(false);
        toast({ description: 'Removed from favorites' });
      } else {
        await favoriteService.addFavorite(user!.id, activityId!);
        setIsFavorited(true);
        toast({ description: 'Added to favorites' });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite',
        variant: 'destructive',
      });
    }
  };

  const handleRegister = async () => {
    try {
      if (isRegistered) {
        await registrationService.cancelRegistration(user!.id, activityId!);
        setIsRegistered(false);
        toast({ description: 'Registration cancelled' });
      } else {
        await registrationService.registerForActivity(user!.id, activityId!);
        setIsRegistered(true);
        toast({ description: 'Successfully registered' });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update registration',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Activity Image with Favorite Button */}
      <div className="relative">
        <img
          src={activity?.image}
          alt={activity?.title}
          className="w-full h-96 object-cover rounded-lg"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 p-3 bg-white rounded-full hover:bg-gray-100"
        >
          <Heart
            size={24}
            className={isFavorited ? 'fill-red-500 text-red-500' : ''}
          />
        </button>
      </div>

      {/* Activity Details */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{activity?.title}</h1>
        <p className="text-lg text-muted-foreground">{activity?.description}</p>

        {/* Key Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-lg font-semibold">{activity?.date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="text-lg font-semibold">{activity?.location}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="text-lg font-semibold">{activity?.category}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="text-lg font-semibold">{activity?.participants}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleRegister}
            variant={isRegistered ? 'outline' : 'default'}
            size="lg"
          >
            {isRegistered ? 'Cancel Registration' : 'Register Now'}
          </Button>
          <Button
            onClick={handleFavorite}
            variant="outline"
            size="lg"
          >
            <Heart
              size={20}
              className={isFavorited ? 'fill-current' : ''}
            />
            {isFavorited ? 'Favorited' : 'Add to Favorites'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============ EXAMPLE 5: Export All for Easy Import ============

export {
  ActivityShowcase,
  Dashboard,
  PersonalizedRecommendations,
  ActivityDetail,
};
