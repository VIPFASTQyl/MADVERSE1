import { supabase } from './supabaseClient';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title?: string;
  bio?: string;
  image_url?: string;
  language: string;
}

/**
 * Fetch team members by language
 */
export const getTeamMembersByLanguage = async (language: string = 'en'): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, role, title, bio, image_url, language')
      .eq('language', language)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getTeamMembersByLanguage:', error);
    return [];
  }
};

/**
 * Fetch all team members
 */
export const getAllTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, role, title, bio, image_url, language')
      .order('language', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching all team members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllTeamMembers:', error);
    return [];
  }
};

/**
 * Get team member by name and language
 */
export const getTeamMemberByName = async (name: string, language: string = 'en'): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, role, title, bio, image_url, language')
      .eq('name', name)
      .eq('language', language)
      .single();

    if (error) {
      console.error(`Error fetching team member ${name}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getTeamMemberByName:', error);
    return null;
  }
};

/**
 * Add a new team member
 */
export const addTeamMember = async (teamMember: Omit<TeamMember, 'id'>): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .insert([teamMember])
      .select()
      .single();

    if (error) {
      console.error('Error adding team member:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addTeamMember:', error);
    return null;
  }
};

/**
 * Update team member
 */
export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating team member:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateTeamMember:', error);
    return null;
  }
};

/**
 * Delete team member
 */
export const deleteTeamMember = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTeamMember:', error);
    return false;
  }
};
