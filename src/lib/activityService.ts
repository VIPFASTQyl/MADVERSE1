import { supabase } from "./supabaseClient";

// Helper function to get total participants across all language versions
const getTotalParticipants = async (itemName: string, activityType: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .select("current_participants")
      .eq("item_name", itemName)
      .eq("activity_type", activityType);

    if (error) {
      console.error("Error getting total participants:", error);
      return 0;
    }

    return (data || []).reduce((sum, row) => sum + (row.current_participants || 0), 0);
  } catch (error) {
    console.error("Error in getTotalParticipants:", error);
    return 0;
  }
};

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date_time: string;
  max_participants: number;
  current_participants: number;
  image_url: string;
  organizer_id: string;
  language: string; // 'en' or 'al'
  created_at: string;
  updated_at: string;
}

// Fetch all activities
export const getAllActivities = async (): Promise<Activity[]> => {
  try {
    console.log("Fetching all activities...");
    const { data, error } = await supabase
      .from("activity_content")
      .select("*");

    if (error) {
      console.error("Fetch error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }
    
    console.log("Activities fetched:", data);
    
    if (!data || data.length === 0) {
      console.log("No activities found in database");
      return [];
    }
    
    // Map database columns to Activity interface
    return data.map((row: any) => ({
      id: row.id,
      title: row.item_name,
      category: row.activity_type,
      description: row.description,
      date_time: row.date,
      image_url: row.image_url,
      location: row.link_url || "",
      max_participants: row.max_participants || 50,
      current_participants: row.current_participants || 0,
      organizer_id: row.updated_by || "",
      language: row.language,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error: any) {
    console.error("Error fetching activities:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
    });
    return [];
  }
};

// Fetch activities by language
// Simple cache for activities
let activitiesCache: { [key: string]: { data: Activity[]; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getActivitiesByLanguage = async (language: string): Promise<Activity[]> => {
  try {
    // Check cache first
    const cached = activitiesCache[language];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Single query - get everything at once
    const { data, error } = await supabase
      .from("activity_content")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;

    // Filter by language and aggregate participants in one pass
    const participantMap = new Map<string, number>();
    
    // First pass - aggregate all participant counts
    (data || []).forEach((row: any) => {
      const key = `${row.item_name}|${row.activity_type}`;
      const current = participantMap.get(key) || 0;
      participantMap.set(key, current + (row.current_participants || 0));
    });

    // Second pass - map to activities for the requested language
    const activities = (data || [])
      .filter((row: any) => row.language === language)
      .map((row: any) => {
        const key = `${row.item_name}|${row.activity_type}`;
        const totalParticipants = participantMap.get(key) || 0;
        
        return {
          id: row.id,
          title: row.item_name,
          category: row.activity_type,
          description: row.description,
          date_time: row.date,
          image_url: row.image_url,
          location: row.link_url || "",
          max_participants: row.max_participants || 50,
          current_participants: totalParticipants,
          organizer_id: row.updated_by || "",
          language: row.language,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
      });

    // Cache the result
    activitiesCache[language] = {
      data: activities,
      timestamp: Date.now(),
    };

    return activities;
  } catch (error) {
    console.error("Error fetching activities by language:", error);
    return [];
  }
};

// Fetch activities by category
export const getActivitiesByCategory = async (
  category: string
): Promise<Activity[]> => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .select("*")
      .eq("activity_type", category)
      .order("date", { ascending: true });

    if (error) throw error;
    
    // Map database columns to Activity interface
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.item_name,
      category: row.activity_type,
      description: row.description,
      date_time: row.date,
      image_url: row.image_url,
      location: row.link_url || "",
      max_participants: row.max_participants || 50,
      current_participants: row.current_participants || 0,
      organizer_id: row.updated_by || "",
      language: row.language,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching activities by category:", error);
    return [];
  }
};

// Fetch single activity
export const getActivityById = async (id: string): Promise<Activity | null> => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    
    // Map database columns to Activity interface
    return {
      id: data.id,
      title: data.item_name,
      category: data.activity_type,
      description: data.description,
      date_time: data.date,
      image_url: data.image_url,
      location: data.link_url || "",
      max_participants: data.max_participants || 50,
      current_participants: data.current_participants || 0,
      organizer_id: data.updated_by || "",
      language: data.language,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error("Error fetching activity:", error);
    return null;
  }
};

// Create activity (admin only)
export const createActivity = async (
  activity: Omit<Activity, "id" | "created_at" | "updated_at">
): Promise<Activity | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Generate unique ID
    const activityId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Map form fields to database columns
    const dbActivity = {
      id: activityId,
      item_name: activity.title,
      activity_type: activity.category,
      description: activity.description,
      date: activity.date_time,
      image_url: activity.image_url,
      language: activity.language,
      link_url: activity.location || "", // Store location as link_url
      max_participants: activity.max_participants || 50,
      updated_by: user.id,
    };

    console.log("Creating activity with data:", dbActivity);
    console.log("User ID:", user.id);

    const { data, error: insertError } = await supabase
      .from("activity_content")
      .insert(dbActivity)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error details:", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      throw new Error(`Database error: ${insertError.message}`);
    }
    
    console.log("Activity created successfully:", data);
    
    // Map response back to Activity interface
    return {
      id: data.id,
      title: data.item_name,
      category: data.activity_type,
      description: data.description,
      date_time: data.date,
      image_url: data.image_url,
      location: data.link_url || "",
      max_participants: data.max_participants || 50,
      current_participants: data.current_participants || 0,
      organizer_id: data.updated_by || "",
      language: data.language,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error: any) {
    console.error("Error creating activity:", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
    });
    throw error;
  }
};

// Update activity (admin/organizer only)
export const updateActivity = async (
  id: string,
  updates: Partial<Activity>
): Promise<Activity | null> => {
  try {
    // Map form fields to database columns
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.item_name = updates.title;
    if (updates.category) dbUpdates.activity_type = updates.category;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.date_time) dbUpdates.date = updates.date_time;
    if (updates.image_url) dbUpdates.image_url = updates.image_url;
    if (updates.language) dbUpdates.language = updates.language;
    if (updates.location !== undefined) dbUpdates.link_url = updates.location;
    if (updates.max_participants !== undefined) dbUpdates.max_participants = updates.max_participants;

    const { data, error } = await supabase
      .from("activity_content")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    // Map response back to Activity interface
    return {
      id: data.id,
      title: data.item_name,
      category: data.activity_type,
      description: data.description,
      date_time: data.date,
      image_url: data.image_url,
      location: data.link_url || "",
      max_participants: data.max_participants || 50,
      current_participants: data.current_participants || 0,
      organizer_id: data.updated_by || "",
      language: data.language,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error("Error updating activity:", error);
    return null;
  }
};

// Delete activity (admin only)
export const deleteActivity = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("activity_content")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting activity:", error);
    return false;
  }
};

// Search activities
export const searchActivities = async (query: string): Promise<Activity[]> => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .select("*")
      .or(
        `item_name.ilike.%${query}%,description.ilike.%${query}%,link_url.ilike.%${query}%`
      )
      .order("date", { ascending: true });

    if (error) throw error;
    
    // Map database columns to Activity interface
    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.item_name,
      category: row.activity_type,
      description: row.description,
      date_time: row.date,
      image_url: row.image_url,
      location: row.link_url || "",
      max_participants: row.max_participants || 50,
      current_participants: row.current_participants || 0,
      organizer_id: row.updated_by || "",
      language: row.language,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  } catch (error) {
    console.error("Error searching activities:", error);
    return [];
  }
};

// Get activity count by category
export const getActivityCountByCategory = async (
  category: string
): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("activity_content")
      .select("id", { count: "exact" })
      .eq("activity_type", category);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error getting activity count:", error);
    return 0;
  }
};
