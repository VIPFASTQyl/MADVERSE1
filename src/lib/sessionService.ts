import { supabase } from './supabaseClient';

// Generate a unique session ID for this browser
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('madverse_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('madverse_session_id', sessionId);
  }
  return sessionId;
};

// Track user session (call this when user is browsing)
export const trackActiveSession = async (): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const now = new Date().toISOString();

    // Insert or update session - records that this user is currently online
    const { error } = await supabase
      .from('active_sessions')
      .upsert({
        session_id: sessionId,
        last_seen: now,
        updated_at: now,
      }, {
        onConflict: 'session_id'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

// Get count of active sessions (users online in last 5 minutes)
export const getActiveSessionsCount = async (): Promise<number> => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('active_sessions')
      .select('session_id')
      .gte('last_seen', fiveMinutesAgo);

    if (error) throw error;

    return (data || []).length;
  } catch (error) {
    console.error('Error getting active sessions:', error);
    return 0;
  }
};
