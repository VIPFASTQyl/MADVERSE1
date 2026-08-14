import { supabase } from "./supabaseClient";

const METADATA_PREFIX = "madverse-page-section:";
const IMAGE_BUCKET = "activity-images";

const identifierToUuid = (identifier: string) => {
  let hash = 0;
  for (let index = 0; index < identifier.length; index += 1) {
    hash = ((hash << 5) - hash + identifier.charCodeAt(index)) | 0;
  }
  const prefix = Math.abs(hash).toString(16).padStart(8, "0").slice(0, 8);
  return `${prefix}-0000-4000-8000-000000000000`;
};

export const ACTIVITY_PAGE_TYPES = [
  "youth",
  "arts",
  "culture",
  "sports",
  "exhibition",
  "volunteering",
] as const;

export type ActivityPageType = (typeof ACTIVITY_PAGE_TYPES)[number];
export type ActivityLanguage = "en" | "al";
export type ImageSide = "left" | "right";
export type HeadingLevel = "h1" | "h2" | "h3";

interface SectionMetadata {
  version: 1;
  label: string;
  labelColor: string;
  imageSide: ImageSide;
  headingLevel: HeadingLevel;
  sortOrder: number;
  published: boolean;
}

export interface ActivityPageSection {
  id: string;
  activityType: ActivityPageType;
  language: ActivityLanguage;
  label: string;
  labelColor: string;
  heading: string;
  headingLevel: HeadingLevel;
  description: string;
  imageUrl: string;
  imageSide: ImageSide;
  sortOrder: number;
  published: boolean;
}

export type ActivityPageSectionInput = Omit<ActivityPageSection, "id">;

interface ActivityContentRow {
  id: string;
  activity_type: string;
  language: string;
  item_name: string;
  description: string;
  image_url: string;
  link_url?: string | null;
}

const encodeMetadata = (metadata: SectionMetadata) =>
  `${METADATA_PREFIX}${JSON.stringify(metadata)}`;

const decodeMetadata = (value?: string | null): SectionMetadata | null => {
  if (!value?.startsWith(METADATA_PREFIX)) return null;

  try {
    const parsed = JSON.parse(value.slice(METADATA_PREFIX.length)) as SectionMetadata;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
};

const toSection = (row: ActivityContentRow): ActivityPageSection | null => {
  const metadata = decodeMetadata(row.link_url);
  if (!metadata) return null;

  return {
    id: row.id,
    activityType: row.activity_type.toLowerCase() as ActivityPageType,
    language: row.language as ActivityLanguage,
    label: metadata.label,
    labelColor: metadata.labelColor,
    heading: row.item_name,
    headingLevel: metadata.headingLevel,
    description: row.description,
    imageUrl: row.image_url,
    imageSide: metadata.imageSide,
    sortOrder: metadata.sortOrder,
    published: metadata.published,
  };
};

export const getActivityPageSections = async (
  activityType: ActivityPageType,
  language: ActivityLanguage,
  includeDrafts = false,
) => {
  const { data, error } = await supabase
    .from("activity_content")
    .select("id, activity_type, language, item_name, description, image_url, link_url")
    .eq("activity_type", activityType)
    .eq("language", language);

  if (error) throw error;

  return ((data ?? []) as ActivityContentRow[])
    .map(toSection)
    .filter((section): section is ActivityPageSection => Boolean(section))
    .filter((section) => includeDrafts || section.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const saveActivityPageSection = async (
  input: ActivityPageSectionInput,
  userId: string,
  id?: string,
) => {
  const metadata: SectionMetadata = {
    version: 1,
    label: input.label,
    labelColor: input.labelColor,
    imageSide: input.imageSide,
    headingLevel: input.headingLevel,
    sortOrder: input.sortOrder,
    published: input.published,
  };

  const row = {
    activity_type: input.activityType,
    language: input.language,
    item_name: input.heading,
    description: input.description,
    image_url: input.imageUrl,
    link_url: encodeMetadata(metadata),
    date: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    updated_by: identifierToUuid(userId),
  };

  const query = id
    ? supabase.from("activity_content").update(row).eq("id", id)
    : supabase.from("activity_content").insert({
        ...row,
        id: `page-section-${Date.now()}-${crypto.randomUUID()}`,
      });

  const { data, error } = await query.select(
    "id, activity_type, language, item_name, description, image_url, link_url",
  ).single();

  if (error) throw error;
  return toSection(data as ActivityContentRow);
};

export const deleteActivityPageSection = async (id: string) => {
  const { error } = await supabase.from("activity_content").delete().eq("id", id);
  if (error) throw error;
};

export const uploadActivityPageImage = async (file: File) => {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be smaller than 8 MB.");

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `page-sections/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw error;
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(data.path).data.publicUrl;
};

export const subscribeToActivityPageSections = (
  activityType: ActivityPageType,
  onChange: () => void,
) => {
  const channel = supabase
    .channel(`activity-page-${activityType}-${crypto.randomUUID()}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "activity_content",
        filter: `activity_type=eq.${activityType}`,
      },
      onChange,
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
};
