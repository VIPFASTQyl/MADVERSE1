import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Plus, Edit2, Trash2, Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  Activity,
} from "@/lib/activityService";

const CATEGORIES = [
  "Arts",
  "Culture",
  "Sports",
  "Volunteering",
  "Youth",
  "Exhibition",
];

export const ActivityManagement = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    title_en: "",
    title_al: "",
    description_en: "",
    description_al: "",
    category: "Youth",
    location: "",
    date_time: "",
    max_participants: 50,
    image_url: "",
  });

  // Load activities when language changes
  useEffect(() => {
    loadActivities();
  }, [language]);

  const loadActivities = async () => {
    setLoading(true);
    const data = await getAllActivities();
    console.log("All activities:", data);
    // Filter by current language
    const filtered = data.filter((activity: Activity) => activity.language === language);
    console.log("Filtered by language", language, ":", filtered);
    setActivities(filtered);
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({
      title_en: "",
      title_al: "",
      description_en: "",
      description_al: "",
      category: "Youth",
      location: "",
      date_time: "",
      max_participants: 50,
      image_url: "",
    });
    setEditingId(null);
  };

  const handleEdit = (activity: Activity) => {
    // When editing, fetch the activity in the current language
    setFormData({
      title_en: activity.title_en || activity.title || "",
      title_al: activity.title_al || activity.title || "",
      description_en: activity.description || "",
      description_al: activity.description || "",
      category: activity.category,
      location: activity.location || "",
      date_time: activity.date_time || "",
      max_participants: activity.max_participants || 50,
      image_url: activity.image_url || "",
    });
    setEditingId(activity.id);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title_en.trim() || !formData.title_al.trim()) {
      toast({
        title: t('error'),
        description: "Both English and Albanian titles are required",
        variant: "destructive",
      });
      return;
    }
    if (!formData.description_en.trim() || !formData.description_al.trim()) {
      toast({
        title: t('error'),
        description: "Both English and Albanian descriptions are required",
        variant: "destructive",
      });
      return;
    }
    if (!formData.date_time) {
      toast({
        title: t('error'),
        description: "Date & Time is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create/update both English and Albanian versions
      const englishActivity = {
        title: formData.title_en,
        title_en: formData.title_en,
        title_al: formData.title_al,
        description: formData.description_en,
        category: formData.category,
        location: formData.location,
        date_time: formData.date_time,
        max_participants: formData.max_participants,
        image_url: formData.image_url,
        language: 'en',
      };

      const albanianActivity = {
        title: formData.title_al,
        title_en: formData.title_en,
        title_al: formData.title_al,
        description: formData.description_al,
        category: formData.category,
        location: formData.location,
        date_time: formData.date_time,
        max_participants: formData.max_participants,
        image_url: formData.image_url,
        language: 'al',
      };

      if (editingId) {
        // Update both versions
        await updateActivity(
          editingId,
          englishActivity as Partial<Activity>
        );
        
        // Find the corresponding activity in the other language
        const allActivities = await getAllActivities();
        const currentActivity = allActivities.find(a => a.id === editingId);
        if (currentActivity) {
          const otherLangActivity = allActivities.find(
            a => a.title === currentActivity.title && 
                 a.category === currentActivity.category && 
                 a.language !== currentActivity.language
          );
          if (otherLangActivity) {
            await updateActivity(
              otherLangActivity.id,
              albanianActivity as Partial<Activity>
            );
          }
        }
        
        toast({
          title: t('Success'),
          description: t('activityUpdatedSuccess'),
        });
      } else {
        // Create both versions
        console.log("Creating both language versions");
        const engResult = await createActivity(
          englishActivity as Omit<Activity, "id" | "created_at" | "updated_at">
        );
        const albResult = await createActivity(
          albanianActivity as Omit<Activity, "id" | "created_at" | "updated_at">
        );

        if (!engResult || !albResult) {
          throw new Error("Failed to create both language versions");
        }
        
        console.log("Both activities created successfully");
        toast({
          title: t('Success'),
          description: "Program created in both English and Albanian!",
        });
      }

      handleReset();
      setIsOpen(false);
      await loadActivities();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        title: t('error'),
        description: error?.message || t('failedToSaveActivity'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('deleteActivityConfirm')))
      return;

    try {
      await deleteActivity(id);
      toast({
        title: t('Success'),
        description: t('activityDeletedSuccess'),
      });
      await loadActivities();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToDeleteActivity'),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('manageActivities')}</h2>
          <p className="text-muted-foreground">
            {t('addRemovePrograms')}
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleReset} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('addActivity')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? t('editActivity') : t('addNewActivity')}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title (English)</label>
                  <Input
                    required
                    placeholder="Enter program title in English"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titulli (Albanian)</label>
                  <Input
                    required
                    placeholder="Shkruani titullin e programit në shqip"
                    value={formData.title_al}
                    onChange={(e) =>
                      setFormData({ ...formData, title_al: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (English)</label>
                <Textarea
                  required
                  placeholder="Enter program description in English"
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, description_en: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Përshkrimi (Albanian)</label>
                <Textarea
                  required
                  placeholder="Shkruani përshkrimin e programit në shqip"
                  value={formData.description_al}
                  onChange={(e) =>
                    setFormData({ ...formData, description_al: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('activityCategory')}</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('activityLocation')}</label>
                  <Input
                    placeholder={t('activityLocationPlaceholder')}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('activityDate')}</label>
                  <div className="flex gap-2">
                    <Input
                      type="datetime-local"
                      value={formData.date_time}
                      onChange={(e) =>
                        setFormData({ ...formData, date_time: e.target.value })
                      }
                    />
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={
                            formData.date_time
                              ? new Date(formData.date_time)
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const isoString = date.toISOString().slice(0, 16);
                              setFormData({
                                ...formData,
                                date_time: isoString,
                              });
                              setShowCalendar(false);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t('activityMaxParticipants')}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.max_participants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_participants: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('activityImageUrl')}</label>
                <Input
                  placeholder={t('activityImageUrlPlaceholder')}
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('saving')}
                    </>
                  ) : (
                    t('save')
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Activities List */}
      <div className="grid gap-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                {t('noActivitiesYet')}
              </p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {activity.title}
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {activity.category}
                      </span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.location}
                      {activity.date_time && ` • ${new Date(activity.date_time).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(activity)}
                      title={t('edit')}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(activity.id)}
                      title={t('delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {t('maxParticipants')}: {activity.max_participants}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
