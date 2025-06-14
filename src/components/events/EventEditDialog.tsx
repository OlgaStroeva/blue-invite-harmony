import { useState, useEffect } from "react";
import { Edit, X, Image as ImageIcon, Tag, Save, Mail, Table, Users, Upload, Trash2, Check } from "lucide-react";
import * as XLSX from 'xlsx';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import InvitationFormDialog from "@/components/invitations/InvitationFormDialog";
import ParticipantsTable from "@/components/participants/ParticipantsTable";
import EmployeeManagementDialog from "@/components/employees/EmployeeManagementDialog";

interface Event {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string;
  gradient: string;
  date?: string;
  place?: string;
  status?: 'upcoming' | 'in_progress' | 'finished';
}

interface EventEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onEventUpdated: (event: Event) => void;
  onEventDeleted?: (event: Event) => void;
  canEdit: boolean;
  canDelete: boolean;
}

const EventEditDialog = ({ 
  open, 
  onOpenChange, 
  event, 
  onEventUpdated,
  onEventDeleted,
  canEdit,
  canDelete 
}: EventEditDialogProps) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [category, setCategory] = useState(event.category);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [date, setDate] = useState(event.date || "");
  const [place, setPlace] = useState(event.place || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event.image);
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [showParticipantsTable, setShowParticipantsTable] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Get all unique categories from existing events
  const [existingCategories, setExistingCategories] = useState<string[]>([
    // Get all unique categories from existing events
  ]);

  useEffect(() => {
    fetch("https://localhost:7291/api/events/my-events", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
        .then((res) => res.json())
        .then((data) => {
          const unique = Array.from(
              new Set(
                  data
                      .map((event: any) => event.category)
                      .filter((cat) => typeof cat === "string" && cat.trim() !== "")
              )
          );
          setExistingCategories(unique);
        })
        .catch(console.error);
  }, []);


  useEffect(() => {
    setTitle(event.title);
    setDescription(event.description || "");
    setCategory(event.category);
    setDate(event.date || "");
    setPlace(event.place || "");
    setImagePreview(event.image);
    setShowTagInput(false);
    setNewTag("");
  }, [event]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleCategoryClick = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  const handleAddNewTag = () => {
    setShowTagInput(true);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!existingCategories.includes(newTag)) {
        setExistingCategories(prev => [...prev, newTag]);
      }
      setCategory(newTag);
      setNewTag("");
      setShowTagInput(false);
    } else if (e.key === 'Escape') {
      setShowTagInput(false);
      setNewTag("");
    }
  };

  const handleTagInputBlur = () => {
    if (newTag.trim()) {
      if (!existingCategories.includes(newTag)) {
        setExistingCategories(prev => [...prev, newTag]);
      }
      setCategory(newTag);
    }
    setShowTagInput(false);
    setNewTag("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please ensure you've filled in the required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`https://localhost:7291/api/events/update/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: title,
          description,
          imageBase64: imagePreview || "",
          dateTime: date || "",
          category,
          location: place,
          status: event.status
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Обновлённые данные с сервера (включая ID)
        onEventUpdated({
          ...event,
          title,
          description,
          category,
          date,
          place,
          image: imagePreview,
          status: result.status
        });

        onOpenChange(false);

        toast({
          title: "Мероприятие обновлено",
          description: "Изменения успешно сохранены.",
        });
      } else {
        toast({
          title: "Ошибка",
          description: result.message || "Не удалось обновить мероприятие",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      toast({
        title: "Ошибка сети",
        description: "Сервер не отвечает",
        variant: "destructive",
      });
    }
  };

  const handleOpenInvitationForm = () => {
    setShowInvitationForm(true);
    onOpenChange(false);
  };

  const handleOpenParticipantsTable = () => {
    setShowParticipantsTable(true);
    onOpenChange(false);
  };

  const handleOpenEmployeeManagement = () => {
    setShowEmployeeManagement(true);
    onOpenChange(false);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token || !event?.id) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`https://localhost:7291/api/events/delete/${event.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete event");
      }

      // Успешное удаление
      toast({
        title: t("eventDeleted"),
        description: t("eventDeletedSuccessfully"),
      });
      
      if (onEventDeleted) {
        onEventDeleted(event);
      }
      onOpenChange(false);

    } catch (err) {
      console.error("Error deleting event:", err);
      toast({
        title: t("error"),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <Edit className="h-5 w-5" /> {canEdit ? "Edit Event" : "View Event"}
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              {canEdit ? "Make changes to your event details" : "View event details"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-blue-700 font-medium">Event Title</Label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title..."
                    className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-blue-700 font-medium">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {existingCategories.map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        variant={category === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => canEdit && handleCategoryClick(cat)}
                        className={category === cat 
                          ? "bg-blue-600 text-white" 
                          : "border-blue-200 text-blue-700 bg-blue-50"}
                        disabled={!canEdit}
                      >
                        {cat} {category === cat && <Check className="ml-1 w-3 h-3" />}
                      </Button>
                    ))}
                    
                    {canEdit && (showTagInput ? (
                      <div className="relative">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                          onBlur={handleTagInputBlur}
                          placeholder="Add new category..."
                          className="border-blue-200 focus-visible:ring-blue-400 py-1 h-9 min-w-[150px] bg-blue-50"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddNewTag}
                        className="border-dashed border-blue-200 text-blue-600 hover:bg-blue-100 bg-blue-50"
                      >
                        <Tag className="mr-1 h-3 w-3" /> Add tag
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-blue-700 font-medium">Event Image</Label>
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 hover:bg-blue-50/50 transition-colors cursor-pointer bg-blue-100/70">
                    {canEdit && (
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    )}
                    
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Event preview" 
                          className="w-full aspect-[4/3] object-cover rounded-md"
                        />
                        {canEdit && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImage(null);
                              setImagePreview("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ) : canEdit ? (
                      <label htmlFor="image" className="flex flex-col items-center justify-center gap-2 h-48">
                        <ImageIcon className="h-10 w-10 text-blue-400" />
                        <span className="text-blue-600 font-medium">Upload an image</span>
                        <span className="text-sm text-blue-400">or drag and drop</span>
                      </label>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 h-48">
                        <ImageIcon className="h-10 w-10 text-blue-400" />
                        <span className="text-blue-600 font-medium">No image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-blue-700 font-medium">Description</Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your event..."
                    className="border-blue-200 focus-visible:ring-blue-400 min-h-[300px] bg-blue-50"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-blue-700 font-medium">Event Date</Label>
                  <Input 
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place" className="text-blue-700 font-medium">Event Location</Label>
                  <Input 
                    id="place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Enter event location..."
                    className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="gap-2 pt-4 border-t border-blue-200">
              <div className="flex items-center gap-2 w-full justify-between">
                {canDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-blue-200 bg-blue-50 hover:bg-blue-100"
                  >
                    {canEdit ? t("cancel") : t("close")}
                  </Button>
                  {canEdit && (
                    <Button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {t("saveChanges")}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteEvent")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDelete")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("deleteEvent")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showInvitationForm && (
        <InvitationFormDialog
          open={showInvitationForm}
          onOpenChange={setShowInvitationForm}
          event={event}
          onClose={() => {
            setShowInvitationForm(false);
            onOpenChange(true);
          }}
        />
      )}

      {showParticipantsTable && (
        <ParticipantsTable
          open={showParticipantsTable}
          onOpenChange={setShowParticipantsTable}
          event={event}
        />
      )}
      
      {showEmployeeManagement && (
        <EmployeeManagementDialog
          open={showEmployeeManagement}
          onOpenChange={(open) => {
            setShowEmployeeManagement(open);
            if (!open) onOpenChange(true);
          }}
          event={event}
        />
      )}
    </>
  );
};

export default EventEditDialog;
