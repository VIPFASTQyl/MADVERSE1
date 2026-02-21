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

export const createOrUpdateUser = async (userId: string, email: string): Promise<boolean> => {
  try {
    // The ADMIN_EMAILS list is the source of truth
    const isAdmin = ADMIN_EMAILS.includes(email);
    console.log('👑 ADMIN CHECK - Email:', email);
    console.log('👑 ADMIN CHECK - Result:', isAdmin, '(', ADMIN_EMAILS.includes(email) ? 'ADMIN' : 'USER', ')');
    
    // Return admin status immediately based on email list
    // Database update happens in background (fire and forget)
    supabase.from("users").upsert(
      {
        id: userId,
        email,
        is_admin: isAdmin,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    ).then((result) => {
      if (result.error) {
        console.error('❌ Database upsert error:', result.error);
      } else {
        console.log('✅ Database upsert success');
      }
    }).catch((error) => {
      console.error('❌ Database upsert catch error:', error);
    });
    
    return isAdmin; // Return immediately, don't wait for database
  } catch (error) {
    console.error("Error checking admin status:", error);
    // Fallback: check email list directly
    return ADMIN_EMAILS.includes(email);
  }
};
