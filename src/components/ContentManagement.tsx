import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, X, Edit2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface WebContent {
  id: string;
  key: string;
  title: string;
  content: string;
  section: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export const ContentManagement = () => {
  const { t } = useLanguage();
  const [contents, setContents] = useState<WebContent[]>([]);
  const [filteredContents, setFilteredContents] = useState<WebContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [contents, languageFilter, sectionFilter, searchQuery]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("web_content1")
        .select("*")
        .order("section", { ascending: true })
        .order("key", { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = contents;

    if (languageFilter !== "all") {
      filtered = filtered.filter((c) => c.language === languageFilter);
    }

    if (sectionFilter !== "all") {
      filtered = filtered.filter((c) => c.section === sectionFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContents(filtered);
  };

  const handleEdit = (content: WebContent) => {
    setEditingId(content.id);
    setEditContent(content.content);
  };

  const handleSave = async (id: string) => {
    try {
      setSavingId(id);
      const { error } = await supabase
        .from("web_content1")
        .update({ content: editContent, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      setContents(
        contents.map((c) =>
          c.id === id ? { ...c, content: editContent } : c
        )
      );
      setEditingId(null);
      setEditContent("");
      setSuccessId(id);
      
      // Show success toast
      toast.success("Content updated successfully!", {
        description: "Changes have been saved to the database.",
      });

      // Clear success indicator after 3 seconds
      setTimeout(() => {
        setSuccessId(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Failed to update content", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const languages = ["all", ...new Set(contents.map((c) => c.language))];
  const sections = ["all", ...new Set(contents.map((c) => c.section))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <Input
              placeholder="Search by key, title, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang === "all" ? "All Languages" : lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Section</label>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section === "all"
                      ? "All Sections"
                      : section.charAt(0).toUpperCase() + section.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : filteredContents.length === 0 ? (
        <Card className="p-8 text-center border border-border">
          <p className="text-muted-foreground">No content found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContents.map((item) => (
            <Card
              key={item.id}
              className="p-6 border border-border hover:border-foreground/50 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className="text-xs px-2 py-1 bg-foreground/10 rounded">
                        {item.language.toUpperCase()}
                      </span>
                      <span className="text-xs px-2 py-1 bg-foreground/10 rounded">
                        {item.section}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Key: {item.key}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {new Date(item.updated_at).toLocaleString()}
                    </p>
                  </div>
                  {editingId !== item.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                  )}
                </div>

                {editingId === item.id ? (
                  <div className="space-y-3 mt-4 border-t border-border pt-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[150px] bg-background border-border font-mono text-sm"
                      placeholder="Enter content..."
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                        disabled={savingId === item.id}
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(item.id)}
                        disabled={savingId === item.id}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        {savingId === item.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Saving...
                          </>
                        ) : successId === item.id ? (
                          <>
                            <CheckCircle size={16} />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-foreground/5 rounded border border-foreground/10">
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
