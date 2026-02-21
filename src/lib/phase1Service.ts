import { supabase } from './supabaseClient';

// ============ PROFILE SERVICE ============

export interface UserProfile {
  id: string;
  full_name: string | null;
  bio: string | null;
  interests: string[] | null;
  profile_image_url: string | null;
  date_of_birth: string | null;
  location: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('📦 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle missing profiles

      if (error) {
        console.error('❌ Profile fetch error:', error.code, error.message);
        throw error;
      }

      if (data) {
        console.log('✅ Profile found:', {
          id: data.id,
          full_name: data.full_name,
          phone: data.phone,
        });
        return data;
      } else {
        console.log('⚠️ No profile found, attempting to create default profile...');
        // Try to create an empty profile if it doesn't exist
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: userId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) {
            console.error('⚠️ Could not create profile:', createError.message);
            return null;
          }

          console.log('✅ Profile created successfully');
          return newProfile;
        } catch (createErr) {
          console.error('⚠️ Error creating profile:', createErr);
          return null;
        }
      }
    } catch (error) {
      console.error('❌ Error in getProfile:', error);
      return null;
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Upload profile image
  async uploadProfileImage(userId: string, file: File): Promise<string> {
    const fileName = `${userId}-${Date.now()}-profile`;
    const { error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },
};

// ============ FAVORITES SERVICE ============

export interface ActivityFavorite {
  id: string;
  user_id: string;
  activity_id: string;
  created_at: string;
}

export const favoriteService = {
  // Get all user favorites
  async getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('activity_favorites')
      .select('activity_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map((fav) => fav.activity_id) || [];
  },

  // Check if activity is favorited
  async isFavorited(userId: string, activityId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('activity_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  // Add to favorites
  async addFavorite(userId: string, activityId: string): Promise<ActivityFavorite> {
    const { data, error } = await supabase
      .from('activity_favorites')
      .insert({
        user_id: userId,
        activity_id: activityId,
      })
      .select()
      .single();

    if (error) throw error;

    // Track in history
    await historyService.trackAction(userId, activityId, 'favorite');
    return data;
  },

  // Remove from favorites
  async removeFavorite(userId: string, activityId: string): Promise<void> {
    const { error } = await supabase
      .from('activity_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('activity_id', activityId);

    if (error) throw error;
  },
};

// ============ REGISTRATION SERVICE ============

export interface ActivityRegistration {
  id: string;
  user_id: string;
  activity_id: string;
  status: 'registered' | 'completed' | 'cancelled';
  registered_at: string;
  completed_at: string | null;
}

export const registrationService = {
  // Get user registrations (deduplicated - removes duplicate language versions)
  async getUserRegistrations(userId: string): Promise<ActivityRegistration[]> {
    const { data, error } = await supabase
      .from('activity_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (error) throw error;
    
    if (!data || data.length === 0) return [];

    // Fetch activity details to deduplicate by item_name and activity_type
    const { data: activityDetails } = await supabase
      .from('activity_content')
      .select('id, item_name, activity_type');

    if (!activityDetails) return data;

    // Create a map of activity_id to item_name+activity_type
    const activityMap: Record<string, { itemName: string; type: string }> = {};
    activityDetails.forEach((act: any) => {
      activityMap[act.id] = { itemName: act.item_name, type: act.activity_type };
    });

    // Deduplicate: keep only the first registration for each unique activity
    const seenActivities = new Set<string>();
    const deduplicatedData: ActivityRegistration[] = [];

    for (const reg of data) {
      const activity = activityMap[reg.activity_id];
      if (activity) {
        const activityKey = `${activity.itemName}|${activity.type}`;
        if (!seenActivities.has(activityKey)) {
          seenActivities.add(activityKey);
          deduplicatedData.push(reg);
        }
      } else {
        // Include registrations without activity data
        deduplicatedData.push(reg);
      }
    }

    return deduplicatedData;
  },

  // Get registered activities for a user
  async getRegisteredActivities(userId: string, status?: string): Promise<string[]> {
    let query = supabase
      .from('activity_registrations')
      .select('activity_id')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data?.map((reg) => reg.activity_id) || [];
  },

  // Register for an activity
  async registerForActivity(userId: string, activityId: string): Promise<ActivityRegistration> {
    // Get the activity details to find all language versions
    const { data: activity } = await supabase
      .from('activity_content')
      .select('item_name, activity_type, current_participants')
      .eq('id', activityId)
      .single();

    if (!activity) throw new Error('Activity not found');

    // Find all language versions of this program (same item_name and activity_type)
    const { data: allLanguageVersions } = await supabase
      .from('activity_content')
      .select('id, current_participants')
      .eq('item_name', activity.item_name)
      .eq('activity_type', activity.activity_type);

    if (!allLanguageVersions || allLanguageVersions.length === 0) {
      throw new Error('No language versions found for this activity');
    }

    // Check if user was previously registered but cancelled (for re-registration logic)
    const { data: existingRegistration } = await supabase
      .from('activity_registrations')
      .select('status')
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .maybeSingle();

    const wasRegisteredBefore = existingRegistration?.status === 'registered';
    const wasReRegistering = existingRegistration?.status === 'cancelled';

    // Register for ALL language versions of this program
    const registrationPromises = allLanguageVersions.map((version) =>
      supabase
        .from('activity_registrations')
        .upsert({
          user_id: userId,
          activity_id: version.id,
          status: 'registered',
          registered_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,activity_id'
        })
        .select()
        .single()
    );

    const registrationResults = await Promise.all(registrationPromises);
    if (registrationResults.some(r => r.error)) {
      throw new Error('Failed to register for some language versions');
    }

    // Increment current_participants for all language versions
    // Only increment if this is a new registration or re-registration (not already registered)
    if (!wasRegisteredBefore) {
      for (const version of allLanguageVersions) {
        const newCount = (version.current_participants || 0) + 1;
        await supabase
          .from('activity_content')
          .update({ current_participants: newCount })
          .eq('id', version.id);
      }
    }

    // Track in history
    await historyService.trackAction(userId, activityId, 'registered');

    // Send email notification to admin and confirmation to user
    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle();

      const { data: activityData } = await supabase
        .from('activity_content')
        .select('item_name')
        .eq('id', activityId)
        .single();

      // Get user email from auth (optional, may fail if not authenticated)
      let userEmail = '';
      try {
        const { data: { user } } = await supabase.auth.getUser();
        userEmail = user?.email || '';
      } catch (e) {
        console.warn('Could not get user email from auth');
      }

      await supabase.functions.invoke('send-registration-email', {
        body: {
          userId,
          activityId,
          userName: userProfile?.full_name || 'User',
          programName: activityData?.item_name || 'Unknown Program',
          userEmail: userEmail,
        },
      });
    } catch (emailError) {
      console.log('Email notification skipped:', emailError);
    }

    return registrationResults[0].data;
  },

  // Cancel registration
  async cancelRegistration(userId: string, activityId: string): Promise<void> {
    // Get the activity details to find all language versions
    const { data: activity } = await supabase
      .from('activity_content')
      .select('item_name, activity_type, current_participants')
      .eq('id', activityId)
      .single();

    if (!activity) throw new Error('Activity not found');

    // Find all language versions of this program (same item_name and activity_type)
    const { data: allLanguageVersions } = await supabase
      .from('activity_content')
      .select('id, current_participants')
      .eq('item_name', activity.item_name)
      .eq('activity_type', activity.activity_type);

    if (!allLanguageVersions || allLanguageVersions.length === 0) {
      throw new Error('No language versions found for this activity');
    }

    // Cancel registration for ALL language versions
    const cancelPromises = allLanguageVersions.map((version) =>
      supabase
        .from('activity_registrations')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('activity_id', version.id)
    );

    const cancelResults = await Promise.all(cancelPromises);
    if (cancelResults.some(r => r.error)) {
      throw new Error('Failed to cancel registration for some language versions');
    }

    // Decrement current_participants for all language versions
    for (const version of allLanguageVersions) {
      if (version.current_participants > 0) {
        const newCount = version.current_participants - 1;
        await supabase
          .from('activity_content')
          .update({ current_participants: newCount })
          .eq('id', version.id);
      }
    }
  },

  // Mark activity as completed
  async markActivityCompleted(userId: string, activityId: string): Promise<ActivityRegistration> {
    const { data, error } = await supabase
      .from('activity_registrations')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .select()
      .single();

    if (error) throw error;

    // Track in history
    await historyService.trackAction(userId, activityId, 'completed');
    return data;
  },

  // Check if user is registered for an activity
  async isRegistered(userId: string, activityId: string): Promise<boolean> {
    // First, get the activity details to find all language versions
    const { data: activity } = await supabase
      .from('activity_content')
      .select('item_name, activity_type')
      .eq('id', activityId)
      .maybeSingle();

    if (!activity) {
      // Fallback: check only this specific activity ID
      const { data, error } = await supabase
        .from('activity_registrations')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_id', activityId)
        .eq('status', 'registered')
        .maybeSingle();

      if (error) throw error;
      return !!data;
    }

    // Find all language versions of this program
    const { data: allLanguageVersions } = await supabase
      .from('activity_content')
      .select('id')
      .eq('item_name', activity.item_name)
      .eq('activity_type', activity.activity_type);

    if (!allLanguageVersions || allLanguageVersions.length === 0) {
      return false;
    }

    // Check if user is registered for ANY language version of this program
    const activityIds = allLanguageVersions.map(v => v.id);
    const { data, error } = await supabase
      .from('activity_registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'registered')
      .in('activity_id', activityIds)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};

// ============ HISTORY SERVICE ============

export interface ActivityHistoryRecord {
  id: string;
  user_id: string;
  activity_id: string;
  action: 'viewed' | 'registered' | 'completed' | 'favorite';
  action_date: string;
}

export const historyService = {
  // Track user action
  async trackAction(
    userId: string,
    activityId: string,
    action: 'viewed' | 'registered' | 'completed' | 'favorite'
  ): Promise<ActivityHistoryRecord> {
    const { data, error } = await supabase
      .from('activity_history')
      .insert({
        user_id: userId,
        activity_id: activityId,
        action,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user history
  async getUserHistory(userId: string, limit = 50): Promise<ActivityHistoryRecord[]> {
    const { data, error } = await supabase
      .from('activity_history')
      .select('*')
      .eq('user_id', userId)
      .order('action_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get activity statistics
  async getActivityStats(userId: string): Promise<{
    total_viewed: number;
    total_registered: number;
    total_completed: number;
    total_favorited: number;
  }> {
    const { data, error } = await supabase
      .from('activity_history')
      .select('action')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total_viewed: 0,
      total_registered: 0,
      total_completed: 0,
      total_favorited: 0,
    };

    data?.forEach((record) => {
      const key = `total_${record.action}` as keyof typeof stats;
      stats[key]++;
    });

    return stats;
  },
};
