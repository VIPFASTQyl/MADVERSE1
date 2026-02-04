import { supabase } from "./supabaseClient";

export interface WebContent {
  id: string;
  key: string;
  title: string;
  content: string;
  section: string;
  language: string;
  updated_at?: string;
  updated_by?: string;
}

export interface ActivityContent {
  id: string;
  activity_type: string;
  item_name: string;
  description: string;
  date: string;
  image_url: string;
  link_url?: string;
  language: string;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

// Initialize default content if not exists
export const initializeDefaultContent = async () => {
  try {
    const defaultContent: WebContent[] = [
      // ===== HERO SECTION (HOME PAGE) =====
      // English
      {
        id: "hero-title-en",
        key: "hero_title",
        title: "Hero Section Title",
        content: "Welcome to MADVERSE",
        section: "hero",
        language: "en",
      },
      {
        id: "hero-description-en",
        key: "hero_description",
        title: "Hero Section Description",
        content: "Discover amazing activities and connect with our community",
        section: "hero",
        language: "en",
      },
      // Albanian
      {
        id: "hero-title-al",
        key: "hero_title",
        title: "Titulli i Pjesës Heroine",
        content: "Mirë se vini në MADVERSE",
        section: "hero",
        language: "al",
      },
      {
        id: "hero-description-al",
        key: "hero_description",
        title: "Përshkrimi i Pjesës Heroine",
        content: "Zbuloni aktivitete të mahnitshme dhe lidhuni me komunitetin tonë",
        section: "hero",
        language: "al",
      },

      // ===== FEATURES SECTION (HOME PAGE) =====
      // English
      {
        id: "features-title-en",
        key: "features_title",
        title: "Features Section Title",
        content: "What is MADVERSE?",
        section: "features",
        language: "en",
      },
      {
        id: "features-description-en",
        key: "features_description",
        title: "Features Section Description",
        content: "MADVERSE is a platform dedicated to bringing together youth, fostering cultural engagement, and empowering communities through innovative programs and artistic expressions.",
        section: "features",
        language: "en",
      },
      {
        id: "features-badge-en",
        key: "features_badge",
        title: "Features Section Badge",
        content: "OUR MISSION",
        section: "features",
        language: "en",
      },
      // Albanian
      {
        id: "features-title-al",
        key: "features_title",
        title: "Titulli i Seksionit të Veçorive",
        content: "Çfarë është MADVERSE?",
        section: "features",
        language: "al",
      },
      {
        id: "features-description-al",
        key: "features_description",
        title: "Përshkrimi i Seksionit të Veçorive",
        content: "MADVERSE është një platformë e dedikuar për të sjellë të rinjtë bashkë, për të nxitur angazhimin kulturor dhe për të fuqizuar komunitetet përmes programeve inovative dhe shprehjeve artistike.",
        section: "features",
        language: "al",
      },
      {
        id: "features-badge-al",
        key: "features_badge",
        title: "Titulli i Seksionit të Veçorive",
        content: "MISIONI YNË",
        section: "features",
        language: "al",
      },

      // ===== ABOUT SECTION (HOME PAGE) =====
      // English
      {
        id: "about-home-title-en",
        key: "about_home_title",
        title: "About Section Title (Home Page)",
        content: "Culture You Can Feel and Interact",
        section: "about_home",
        language: "en",
      },
      {
        id: "about-home-description-en",
        key: "about_home_description",
        title: "About Section Description (Home Page)",
        content: "From performances and art installations to workshops and community events, MADVERSE creates spaces where people of all backgrounds can engage with culture in meaningful ways.",
        section: "about_home",
        language: "en",
      },
      {
        id: "about-home-badge-en",
        key: "about_home_badge",
        title: "About Section Badge (Home Page)",
        content: "COMMUNITY",
        section: "about_home",
        language: "en",
      },
      // Albanian
      {
        id: "about-home-title-al",
        key: "about_home_title",
        title: "Titull i Seksionit për Rreth (Faqja Bazë)",
        content: "Kultura që Mund ta Ndienj dhe Ndërveprim",
        section: "about_home",
        language: "al",
      },
      {
        id: "about-home-description-al",
        key: "about_home_description",
        title: "Përshkrimi i Seksionit për Rreth (Faqja Bazë)",
        content: "Nga performancat e instalimeve të artit deri në punëtori dhe ngjarjet e komunitetit, MADVERSE krijon hapësira ku njerëzit nga të gjitha sfondet mund të angazhohen me kulturën në mënyra të domethënëse.",
        section: "about_home",
        language: "al",
      },
      {
        id: "about-home-badge-al",
        key: "about_home_badge",
        title: "Titull i Seksionit për Rreth (Faqja Bazë)",
        content: "KOMUNITETI",
        section: "about_home",
        language: "al",
      },

      // ===== ABOUT PAGE SECTIONS =====
      // English
      {
        id: "about-whatismadverse-title-en",
        key: "about_whatismadverse_title",
        title: "What is Madverse - Title",
        content: "What is MADVERSE?",
        section: "about",
        language: "en",
      },
      {
        id: "about-whatismadverse-desc-en",
        key: "about_whatismadverse_desc",
        title: "What is Madverse - Description",
        content: "MADVERSE is a cultural and community-driven platform dedicated to amplifying local voices, fostering artistic expression, and strengthening cultural engagement across the region. We believe in the power of culture to transform communities and inspire positive change.",
        section: "about",
        language: "en",
      },
      {
        id: "about-feelculture-title-en",
        key: "about_feelculture_title",
        title: "Feel Culture - Title",
        content: "Culture You Can Feel and Interact",
        section: "about",
        language: "en",
      },
      {
        id: "about-feelculture-desc-en",
        key: "about_feelculture_desc",
        title: "Feel Culture - Description",
        content: "From performances and art installations to workshops and community events, MADVERSE creates spaces where people of all backgrounds can engage with culture in meaningful ways. Our programs are designed to celebrate diversity, encourage participation, and build lasting connections within our communities.",
        section: "about",
        language: "en",
      },
      // Albanian
      {
        id: "about-whatismadverse-title-al",
        key: "about_whatismadverse_title",
        title: "Çfarë është Madverse - Titulli",
        content: "Çfarë është MADVERSE?",
        section: "about",
        language: "al",
      },
      {
        id: "about-whatismadverse-desc-al",
        key: "about_whatismadverse_desc",
        title: "Çfarë është Madverse - Përshkrimi",
        content: "MADVERSE është një platformë e drejtuar nga kultura dhe komuniteti e dedikuar për të amplifikuar zërat lokal, për të nxitur shprehjen artistike, dhe për të forcuar angazhimin kulturor në rajon.",
        section: "about",
        language: "al",
      },
      {
        id: "about-feelculture-title-al",
        key: "about_feelculture_title",
        title: "Ndjeje Kulturën - Titulli",
        content: "Kultura që Mund ta Ndienj dhe Ndërveprim",
        section: "about",
        language: "al",
      },
      {
        id: "about-feelculture-desc-al",
        key: "about_feelculture_desc",
        title: "Ndjeje Kulturën - Përshkrimi",
        content: "Nga performancat e instalimeve të artit deri në punëtori dhe ngjarjet e komunitetit, MADVERSE krijon hapësira ku njerëzit nga të gjitha sfondet mund të angazhohen me kulturën në mënyra të domethënëse.",
        section: "about",
        language: "al",
      },

      // ===== TEAM MEMBERS =====
      // English
      {
        id: "team-klest-name-en",
        key: "team_klest_name",
        title: "Klest - Name",
        content: "Klest Drançolli",
        section: "team",
        language: "en",
      },
      {
        id: "team-klest-title-en",
        key: "team_klest_title",
        title: "Klest - Title",
        content: "Founder & Chief Executive Officer (CEO)",
        section: "team",
        language: "en",
      },
      {
        id: "team-klest-bio-en",
        key: "team_klest_bio",
        title: "Klest - Biography",
        content: "Klest Drançolli is the Founder and Chief Executive Officer of MADVERSE. He is responsible for defining the organization's strategic vision, overseeing organizational development, and leading innovation across all operational areas. Through his leadership, MADVERSE advances its mission to empower local talent, strengthen community engagement, and deliver sustainable cultural initiatives.",
        section: "team",
        language: "en",
      },
      {
        id: "team-guri-name-en",
        key: "team_guri_name",
        title: "Guri - Name",
        content: "Guri Gacaferi",
        section: "team",
        language: "en",
      },
      {
        id: "team-guri-title-en",
        key: "team_guri_title",
        title: "Guri - Title",
        content: "Chief Financial Administrator",
        section: "team",
        language: "en",
      },
      {
        id: "team-guri-bio-en",
        key: "team_guri_bio",
        title: "Guri - Biography",
        content: "Guri Gacaferi serves as the Chief Financial Administrator at MADVERSE, overseeing financial operations and ensuring the organization's financial stability. He is responsible for budgeting, financial planning, and resource optimization, contributing directly to the sustainable growth and long-term development of the organization.",
        section: "team",
        language: "en",
      },
      {
        id: "team-erion-name-en",
        key: "team_erion_name",
        title: "Erijon - Name",
        content: "Erijon Gashi",
        section: "team",
        language: "en",
      },
      {
        id: "team-erion-title-en",
        key: "team_erion_title",
        title: "Erijon - Title",
        content: "Head of Research & Innovation",
        section: "team",
        language: "en",
      },
      {
        id: "team-erion-bio-en",
        key: "team_erion_bio",
        title: "Erijon - Biography",
        content: "Erijon Gashi is the Head of Research and Innovation at MADVERSE, responsible for exploring emerging technologies and future trends. He identifies strategic opportunities that support the advancement of projects and the overall vision of the organization.",
        section: "team",
        language: "en",
      },
      // Albanian
      {
        id: "team-klest-name-al",
        key: "team_klest_name",
        title: "Klest - Emri",
        content: "Klest Drançolli",
        section: "team",
        language: "al",
      },
      {
        id: "team-klest-title-al",
        key: "team_klest_title",
        title: "Klest - Titull",
        content: "Themelues & Drejtor Ekzekutiv (CEO)",
        section: "team",
        language: "al",
      },
      {
        id: "team-klest-bio-al",
        key: "team_klest_bio",
        title: "Klest - Biografi",
        content: "Klest Drançolli është Themelusi dhe Drejtor Ekzekutiv i MADVERSE. Ai është përgjegjës për përcaktimin e vizionit strategjik të organizatës, mbikëqyrjen e zhvillimit organizativ dhe udhëheqjen e inovacionit në të gjithë fushat operacionale.",
        section: "team",
        language: "al",
      },
      {
        id: "team-guri-name-al",
        key: "team_guri_name",
        title: "Guri - Emri",
        content: "Guri Gacaferi",
        section: "team",
        language: "al",
      },
      {
        id: "team-guri-title-al",
        key: "team_guri_title",
        title: "Guri - Titull",
        content: "Përgjegjës i Administratës Financiare",
        section: "team",
        language: "al",
      },
      {
        id: "team-guri-bio-al",
        key: "team_guri_bio",
        title: "Guri - Biografi",
        content: "Guri Gacaferi shërben si Përgjegjës i Administratës Financiare në MADVERSE, duke mbikëqyrë operacionet financiare dhe duke siguruar stabilitetin financiar të organizatës.",
        section: "team",
        language: "al",
      },
      {
        id: "team-erion-name-al",
        key: "team_erion_name",
        title: "Erijon - Emri",
        content: "Erijon Gashi",
        section: "team",
        language: "al",
      },
      {
        id: "team-erion-title-al",
        key: "team_erion_title",
        title: "Erijon - Titull",
        content: "Shef i Kërkimit & Inovacionit",
        section: "team",
        language: "al",
      },
      {
        id: "team-erion-bio-al",
        key: "team_erion_bio",
        title: "Erijon - Biografi",
        content: "Erijon Gashi është Shef i Kërkimit dhe Inovacionit në MADVERSE, përgjegjës për eksplorimin e teknologjive në rritje dhe tendencave të ardhshme.",
        section: "team",
        language: "al",
      },
    ];

    // Check if table exists and has data
    const { data: existingData, error: fetchError } = await supabase
      .from("web_content1")
      .select("*")
      .limit(1);

    // If table doesn't exist or there's an error, log it
    if (fetchError) {
      console.warn("Web content table error:", fetchError);
      return;
    }

    // If data already exists, don't reinitialize
    if (existingData && existingData.length > 0) {
      console.log("Content already initialized");
      return;
    }

    // Insert default content
    const { error: insertError } = await supabase
      .from("web_content1")
      .insert(defaultContent);

    if (insertError) {
      console.error("Error inserting default content:", insertError);
      return;
    }

    console.log("Default content initialized successfully");
  } catch (error) {
    console.error("Error initializing content:", error);
  }
};

export const getContent = async (key?: string) => {
  try {
    let query = supabase.from("web_content1").select("*");
    
    if (key) {
      query = query.eq("key", key);
      const { data, error } = await query.single();
      if (error) throw error;
      return data as WebContent;
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WebContent[];
  } catch (error) {
    console.error("Error fetching content:", error);
    return key ? null : [];
  }
};

export const updateContent = async (
  key: string,
  content: string,
  userId: string,
  language: string = "en"
) => {
  try {
    const { data, error } = await supabase
      .from("web_content1")
      .update({
        content,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq("key", key)
      .eq("language", language)
      .select();

    if (error) throw error;
    return data?.[0] as WebContent;
  } catch (error) {
    console.error("Error updating content:", error);
    throw error;
  }
};

export const getAllContent = async () => {
  try {
    const { data, error } = await supabase
      .from("web_content1")
      .select("*")
      .order("language", { ascending: true })
      .order("section", { ascending: true });

    if (error) throw error;
    return data as WebContent[];
  } catch (error) {
    console.error("Error fetching all content:", error);
    return [];
  }
};

export const getContentByLanguage = async (language: string) => {
  try {
    const { data, error } = await supabase
      .from("web_content1")
      .select("*")
      .eq("language", language)
      .order("section", { ascending: true });

    if (error) throw error;
    return data as WebContent[];
  } catch (error) {
    console.error("Error fetching content by language:", error);
    return [];
  }
};

// Activity Content Functions
export const getAllActivityContent = async () => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .select("*")
      .order("activity_type", { ascending: true })
      .order("language", { ascending: true });

    if (error) throw error;
    return data as ActivityContent[];
  } catch (error) {
    console.error("Error fetching activity content:", error);
    return [];
  }
};

export const getActivityContentByType = async (activityType: string, language: string) => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .select("*")
      .eq("activity_type", activityType)
      .eq("language", language)
      .order("item_name", { ascending: true });

    if (error) throw error;
    return data as ActivityContent[];
  } catch (error) {
    console.error("Error fetching activity content:", error);
    return [];
  }
};

export const updateActivityContent = async (
  id: string,
  updates: Partial<ActivityContent>,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        updated_by: userId,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data?.[0] as ActivityContent;
  } catch (error) {
    console.error("Error updating activity content:", error);
    throw error;
  }
};

export const createActivityContent = async (
  activityData: Omit<ActivityContent, "created_at" | "updated_at" | "updated_by">,
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from("activity_content")
      .insert([
        {
          ...activityData,
          updated_at: new Date().toISOString(),
          updated_by: userId,
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0] as ActivityContent;
  } catch (error) {
    console.error("Error creating activity content:", error);
    throw error;
  }
};

export const deleteActivityContent = async (id: string) => {
  try {
    const { error } = await supabase
      .from("activity_content")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting activity content:", error);
    throw error;
  }
};
