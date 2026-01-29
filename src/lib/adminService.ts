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

    const { error } = await supabase.from("users").upsert(
      {
        id: userId,
        email,
        is_admin: isAdmin,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) throw error;
    return isAdmin;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return false;
  }
};
