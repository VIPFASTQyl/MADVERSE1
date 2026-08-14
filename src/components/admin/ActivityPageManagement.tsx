import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Edit3, Eye, ImagePlus, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ACTIVITY_PAGE_TYPES,
  ActivityLanguage,
  ActivityPageSection,
  ActivityPageSectionInput,
  ActivityPageType,
  deleteActivityPageSection,
  getActivityPageSections,
  saveActivityPageSection,
  subscribeToActivityPageSections,
  uploadActivityPageImage,
} from "@/lib/activityPageSectionService";
import { translations } from "@/translations";

const PAGE_LABELS: Record<ActivityPageType, string> = {
  youth: "Youth",
  arts: "Arts",
  culture: "Culture",
  sports: "Sports",
  exhibition: "Exhibition",
  volunteering: "Volunteering",
};

interface BuiltInSectionSpec {
  labelKey: string;
  titleKey?: string;
  descriptionKey: string;
  imageUrl: string;
}

const PAGE_TITLE_KEYS: Record<ActivityPageType, string> = {
  youth: "youthTitle",
  arts: "artsTitle",
  culture: "cultureTitle",
  sports: "sportsTitle",
  exhibition: "exhibitionTitle",
  volunteering: "volunteeringTitle",
};

const PAGE_ACCENTS: Record<ActivityPageType, string> = {
  youth: "#F0A533",
  arts: "#E40A0A",
  culture: "#BA011A",
  sports: "#0B4B8B",
  exhibition: "#00CED1",
  volunteering: "#22C55E",
};

const BUILT_IN_SECTIONS: Record<ActivityPageType, BuiltInSectionSpec[]> = {
  youth: [
    { labelKey: "youthTitle", titleKey: "youthInitiative", descriptionKey: "youthInitiativeDesc", imageUrl: "/youth-mural-green.jpg" },
    { labelKey: "youthTitle", titleKey: "communityService", descriptionKey: "communityServiceDesc", imageUrl: "/youth-mural-painting.jpg" },
  ],
  arts: [
    { labelKey: "unleashingCreativity", descriptionKey: "unleashingCreativityDesc", imageUrl: "/arts-1.jpeg" },
    { labelKey: "artsTitle", titleKey: "artisticCollaboration", descriptionKey: "artisticCollaborationDesc", imageUrl: "/arts-2.jpeg" },
    { labelKey: "artsTitle", titleKey: "communityThroughArt", descriptionKey: "communityThroughArtDesc", imageUrl: "/arts-3.jpeg" },
  ],
  culture: [
    { labelKey: "culturalHeritage", descriptionKey: "culturalHeritageDesc", imageUrl: "/culture-1.jpeg" },
    { labelKey: "cultureTitle", titleKey: "culturalExchange", descriptionKey: "culturalExchangeDesc", imageUrl: "/culture-2.jpeg" },
  ],
  sports: [],
  exhibition: [],
  volunteering: [
    { labelKey: "communityImpact", descriptionKey: "communityImpactDesc", imageUrl: "/volunteering-1.jpeg" },
    { labelKey: "volunteeringTitle", titleKey: "youthEmpowerment", descriptionKey: "youthEmpowermentDesc", imageUrl: "/volunteering-2.jpeg" },
    { labelKey: "volunteeringTitle", titleKey: "socialCause", descriptionKey: "socialCauseDesc", imageUrl: "/volunteering-3.jpeg" },
    { labelKey: "volunteeringTitle", titleKey: "publicArtAction", descriptionKey: "publicArtActionDesc", imageUrl: "/volunteering-6.jpeg" },
    { labelKey: "volunteeringTitle", titleKey: "volunteerLegacy", descriptionKey: "volunteerLegacyDesc", imageUrl: "/volunteering-7.jpeg" },
  ],
};

const emptyForm = (activityType: ActivityPageType, language: ActivityLanguage): ActivityPageSectionInput => ({
  activityType,
  language,
  label: "MADVERSE activity",
  labelColor: "#F0A533",
  heading: "",
  headingLevel: "h2",
  description: "",
  imageUrl: "",
  imageSide: "right",
  sortOrder: Date.now(),
  published: true,
});

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

export const ActivityPageManagement = () => {
  const { user } = useUser();
  const [page, setPage] = useState<ActivityPageType>("youth");
  const [language, setLanguage] = useState<ActivityLanguage>("en");
  const [sections, setSections] = useState<ActivityPageSection[]>([]);
  const [form, setForm] = useState<ActivityPageSectionInput>(() => emptyForm("youth", "en"));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBuiltInKey, setEditingBuiltInKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadSections = useCallback(async () => {
    try {
      setLoading(true);
      setSections(await getActivityPageSections(page, language, true));
    } catch (error) {
      console.error(error);
      toast.error("Could not load the activity page blocks.");
    } finally {
      setLoading(false);
    }
  }, [language, page]);

  useEffect(() => {
    void loadSections();
    return subscribeToActivityPageSections(page, () => void loadSections());
  }, [loadSections, page]);

  useEffect(() => {
    setEditingId(null);
    setEditingBuiltInKey(null);
    setForm(emptyForm(page, language));
  }, [page, language]);

  const builtInSections = useMemo(() => {
    const copy = translations[language] as Record<string, string>;
    return BUILT_IN_SECTIONS[page].map((spec, index) => {
      const builtInKey = `built-in-${index}`;
      const override = sections.find((section) => section.builtInKey === builtInKey);
      return {
        builtInKey,
        override,
        section: override ?? {
          id: builtInKey,
          activityType: page,
          language,
          label: copy[spec.labelKey] ?? spec.labelKey,
          labelColor: PAGE_ACCENTS[page],
          heading: copy[spec.titleKey ?? PAGE_TITLE_KEYS[page]] ?? spec.titleKey ?? PAGE_TITLE_KEYS[page],
          headingLevel: "h2" as const,
          description: copy[spec.descriptionKey] ?? spec.descriptionKey,
          imageUrl: spec.imageUrl,
          imageSide: (index % 2 === 1 ? "left" : "right") as "left" | "right",
          sortOrder: index + 1,
          published: true,
          builtInKey,
        },
      };
    });
  }, [language, page, sections]);

  const addedSections = useMemo(
    () => sections.filter((section) => !section.builtInKey),
    [sections],
  );

  const visibleEntries = [
    ...builtInSections.map(({ builtInKey, override, section }) => ({
      section,
      builtInKey,
      override,
      isBuiltIn: true,
    })),
    ...addedSections.map((section) => ({
      section,
      builtInKey: undefined,
      override: undefined,
      isBuiltIn: false,
    })),
  ];

  const resetForm = () => {
    setEditingId(null);
    setEditingBuiltInKey(null);
    setForm({ ...emptyForm(page, language), sortOrder: builtInSections.length + addedSections.length + 1 });
  };

  const handleEdit = (section: ActivityPageSection, builtInKey?: string, overrideId?: string) => {
    setEditingId(overrideId ?? (builtInKey ? null : section.id));
    setEditingBuiltInKey(builtInKey ?? null);
    setForm({
      activityType: section.activityType,
      language: section.language,
      label: section.label,
      labelColor: section.labelColor,
      heading: section.heading,
      headingLevel: section.headingLevel,
      description: section.description,
      imageUrl: section.imageUrl,
      imageSide: section.imageSide,
      sortOrder: section.sortOrder,
      published: section.published,
      builtInKey,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImage = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const imageUrl = await uploadActivityPageImage(file);
      setForm((current) => ({ ...current, imageUrl }));
      toast.success("Image uploaded.");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!form.label.trim() || !form.heading.trim() || !form.description.trim() || !form.imageUrl) {
      toast.error("Add the colored text, heading, description, and image before publishing.");
      return;
    }

    try {
      setSaving(true);
      await saveActivityPageSection(
        {
          ...form,
          label: form.label.trim(),
          heading: form.heading.trim(),
          description: form.description.trim(),
        },
        user.id,
        editingId ?? undefined,
      );
      toast.success(form.published ? "Published to the live activity page." : "Draft saved.");
      resetForm();
      await loadSections();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Could not save this block.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (section: ActivityPageSection, revertToOriginal = false) => {
    const prompt = revertToOriginal
      ? `Revert “${section.heading}” to its original content?`
      : `Delete “${section.heading}”?`;
    if (!window.confirm(prompt)) return;
    try {
      await deleteActivityPageSection(section.id);
      if (editingId === section.id) resetForm();
      setSections((current) => current.filter((item) => item.id !== section.id));
      toast.success(revertToOriginal ? "Original activity block restored." : "Activity block deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete this block.");
    }
  };

  const PreviewHeading = form.headingLevel;
  const previewHeadingClass = useMemo(
    () =>
      form.headingLevel === "h1"
        ? "text-4xl sm:text-5xl"
        : form.headingLevel === "h2"
          ? "text-3xl sm:text-4xl"
          : "text-2xl sm:text-3xl",
    [form.headingLevel],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Page Editor</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Build image-and-text blocks and publish them directly to the live activity pages.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
          <Plus className="h-4 w-4" /> New block
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Activity page
          <select value={page} onChange={(event) => setPage(event.target.value as ActivityPageType)} className={selectClassName}>
            {ACTIVITY_PAGE_TYPES.map((type) => <option key={type} value={type}>{PAGE_LABELS[type]}</option>)}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          Content language
          <select value={language} onChange={(event) => setLanguage(event.target.value as ActivityLanguage)} className={selectClassName}>
            <option value="en">English</option>
            <option value="al">Albanian</option>
          </select>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{editingId || editingBuiltInKey ? "Edit block" : "Add a new block"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
              <label className="space-y-2 text-sm font-medium">
                Colored text
                <Input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder="e.g. Community impact" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Color
                <Input type="color" value={form.labelColor} onChange={(event) => setForm({ ...form, labelColor: event.target.value })} className="cursor-pointer p-1" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
              <label className="space-y-2 text-sm font-medium">
                Heading text
                <Input value={form.heading} onChange={(event) => setForm({ ...form, heading: event.target.value })} placeholder="Your main headline" />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Heading style
                <select value={form.headingLevel} onChange={(event) => setForm({ ...form, headingLevel: event.target.value as ActivityPageSectionInput["headingLevel"] })} className={selectClassName}>
                  <option value="h1">H1 — Largest</option>
                  <option value="h2">H2 — Large</option>
                  <option value="h3">H3 — Medium</option>
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium">
              Big description
              <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Write the full story or description here…" rows={8} />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                Image position
                <select value={form.imageSide} onChange={(event) => setForm({ ...form, imageSide: event.target.value as ActivityPageSectionInput["imageSide"] })} className={selectClassName}>
                  <option value="left">Image left · text right</option>
                  <option value="right">Image right · text left</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium">
                Display order
                <Input type="number" min="1" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) || 1 })} />
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Image</p>
              {form.imageUrl ? (
                <div className="relative overflow-hidden rounded-xl border bg-muted">
                  <img src={form.imageUrl} alt="Uploaded preview" className="h-48 w-full object-cover" />
                  <Button type="button" size="icon" variant="destructive" className="absolute right-3 top-3" onClick={() => setForm({ ...form, imageUrl: "" })} aria-label="Remove image">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm text-muted-foreground transition hover:border-foreground/40 hover:text-foreground">
                  {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                  {uploading ? "Uploading…" : "Upload JPG, PNG or WebP (max 8 MB)"}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploading} onChange={(event) => void handleImage(event.target.files?.[0])} />
                </label>
              )}
            </div>

            <label className="flex items-center gap-3 rounded-lg border p-4 text-sm">
              <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="h-4 w-4" />
              <span><strong>Publish live</strong><span className="block text-muted-foreground">Turn this off to keep the block as a draft.</span></span>
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saving || uploading} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {form.published ? "Publish to live page" : "Save draft"}
              </Button>
              {(editingId || editingBuiltInKey) && <Button type="button" variant="outline" onClick={resetForm}>Cancel edit</Button>}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit overflow-hidden bg-black text-white xl:sticky xl:top-24">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4" /> Live preview</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div className={form.imageSide === "left" ? "sm:order-1 xl:order-1 2xl:order-1" : "sm:order-2 xl:order-1 2xl:order-2"}>
                {form.imageUrl ? <img src={form.imageUrl} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-white/10 text-xs text-white/40">Your image</div>}
              </div>
              <div className={form.imageSide === "left" ? "sm:order-2 xl:order-2 2xl:order-2" : "sm:order-1 xl:order-2 2xl:order-1"}>
                <p className="mb-3 text-xs font-bold uppercase tracking-[.18em]" style={{ color: form.labelColor }}>{form.label || "Colored text"}</p>
                <PreviewHeading className={`${previewHeadingClass} font-bold leading-none tracking-tight`}>{form.heading || "Your heading"}</PreviewHeading>
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/65">{form.description || "Your large description will appear here, opposite the image."}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold">Existing {PAGE_LABELS[page]} blocks</h3>
          <p className="text-sm text-muted-foreground">Showing {language === "en" ? "English" : "Albanian"} content.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin" /></div>
        ) : visibleEntries.length === 0 ? (
          <Card><CardContent className="py-10 text-center text-muted-foreground">No blocks yet.</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleEntries.map(({ section, builtInKey, override, isBuiltIn }) => (
              <Card key={builtInKey ?? section.id} className="overflow-hidden">
                <img src={section.imageUrl} alt="" className="h-40 w-full object-cover" />
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: section.labelColor }}>{section.label}</p>
                      <h4 className="mt-1 text-lg font-bold">{section.heading}</h4>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${section.published ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"}`}>
                      {isBuiltIn ? (override ? (section.published ? "Edited" : "Draft") : "Original") : (section.published ? "Live" : "Draft")}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{section.description}</p>
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(section, builtInKey, override?.id)} className="gap-2"><Edit3 className="h-3.5 w-3.5" /> Edit</Button>
                    {isBuiltIn ? (
                      override && <Button type="button" size="sm" variant="outline" onClick={() => void handleDelete(override, true)} className="gap-2"><Trash2 className="h-3.5 w-3.5" /> Revert</Button>
                    ) : (
                      <Button type="button" size="sm" variant="destructive" onClick={() => void handleDelete(section)} className="gap-2"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
