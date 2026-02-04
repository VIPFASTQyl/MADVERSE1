import { supabase } from "./supabaseClient";

// List of admin emails - customize these 3
const ADMIN_EMAILS = [
  "klestdrancolli@gmail.com", 
  "gurigaca13@gmail.com",        
  "erijonGashi@gmail.com",        
];

export const checkIsAdmin = async (userId: string) => {
  try {
    const { data } = await supabase.from("users").select("is_admin").eq("id", userId).single();
    return data?.is_admin ?? false;
  } catch (error) {
    return false;
  }
};

export const createOrUpdateUser = async (userId: string, email: string) => {
  try {
    const isAdmin = ADMIN_EMAILS.includes(email);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const { error } = await supabase.from("users").upsert(
        {
          id: userId,
          email,
          is_admin: isAdmin,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      clearTimeout(timeoutId);

      if (error) {
        console.error("Database error:", error);
        return isAdmin;
      }
      return isAdmin;
    } catch (timeoutError) {
      clearTimeout(timeoutId);
      console.error("Database operation timeout:", timeoutError);
      return isAdmin;
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return ADMIN_EMAILS.includes(email);
  }
};
