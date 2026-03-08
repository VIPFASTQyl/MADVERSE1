import { supabase } from './supabaseClient';

// Generate a unique session ID for this browser/tab
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('madverse_session_id');
  if (!sessionId) {
    // Use a shorter timestamp + random string for faster comparison
    sessionId = `${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('madverse_session_id', sessionId);
    console.log(`🆔 New session created: ${sessionId}`);
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

    if (error) {
      console.error('Error tracking session:', error);
    }
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

// Get count of active sessions (users online in last 5 minutes)
export const getActiveSessionsCount = async (): Promise<number> => {
  try {
    // Count sessions with last_seen in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('active_sessions')
      .select('session_id', { count: 'exact' })
      .gte('last_seen', fiveMinutesAgo);

    if (error) {
      console.error('Error getting active sessions:', error);
      return 0;
    }

    const count = (data || []).length;
    console.log(`📊 Active sessions (last 5 min): ${count}, Your Session ID: ${getSessionId()}`);
    
    // Log all active sessions for debugging
    if (data && data.length > 0) {
      console.log('Active session IDs:', data.map((d: any) => d.session_id));
    }
    
    return count;
  } catch (error) {
    console.error('Error getting active sessions:', error);
    return 0;
  }
};

// Cleanup old sessions (older than 1 minute) - for testing/debugging
export const cleanupOldSessions = async (): Promise<void> => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    
    const { count, error } = await supabase
      .from('active_sessions')
      .delete()
      .lt('last_seen', oneMinuteAgo);

    if (error) throw error;
    console.log(`🧹 Cleaned up ${count} old sessions`);
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
};
