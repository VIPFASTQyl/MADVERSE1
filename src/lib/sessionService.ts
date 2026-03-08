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

// Remove session immediately when user leaves
export const removeSession = async (): Promise<void> => {
  try {
    const sessionId = getSessionId();
    console.log(`❌ Removing session: ${sessionId}`);
    
    const { error } = await supabase
      .from('active_sessions')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error removing session:', error);
    } else {
      console.log(`✅ Session removed: ${sessionId}`);
    }
  } catch (error) {
    console.error('Error removing session:', error);
  }
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

// Get count of active sessions (users online - each tab counted separately)
export const getActiveSessionsCount = async (): Promise<number> => {
  try {
    // Count ALL sessions - each tab is a separate user
    const { data, error } = await supabase
      .from('active_sessions')
      .select('session_id', { count: 'exact' });

    if (error) {
      console.error('Error getting active sessions:', error);
      return 0;
    }

    const count = (data || []).length;
    console.log(`📊 Active tabs/users: ${count}, Your Session ID: ${getSessionId()}`);
    
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

// Setup page leave tracking
export const setupPageLeaveTracking = (): void => {
  // Remove session when page is about to unload (user closes tab/navigates away)
  window.addEventListener('beforeunload', () => {
    removeSession();
  });

  // Also clean up when component unmounts
  window.addEventListener('unload', () => {
    removeSession();
  });

  // Clean up if page loses visibility (tab goes to background)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('⏸️ Tab went to background');
      // Don't remove yet - they might come back
    } else {
      console.log('▶️ Tab is active again');
      // Refresh session when tab becomes active
      trackActiveSession();
    }
  });
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
