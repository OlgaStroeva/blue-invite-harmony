
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
import { Event } from "@/types/event";

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
  const [place, setPlace] = useState(event.location || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event.image || "");
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const [showParticipantsTable, setShowParticipantsTable] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Get all unique categories from existing events
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://158.160.171.159:7291/api/events/my-events", {
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
                      .filter((cat: any) => typeof cat === "string" && cat.trim() !== "")
              )
          ) as string[];
          setExistingCategories(unique);
        })
        .catch(console.error);
  }, []);


  useEffect(() => {
    setTitle(event.title);
    setDescription(event.description || "");
    setCategory(event.category);
    setDate(event.date || "");
    setPlace(event.location || "");
    setImagePreview(event.image || "");
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
        title: t("missingInformation"),
        description: t("pleaseEnsureRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://158.160.171.159:7291/api/events/update/${event.id}`, {
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
          location: place,
          image: imagePreview,
          status: result.status,
          time: event.time,
          createdBy: event.createdBy
        });

        onOpenChange(false);

        toast({
          title: t("eventUpdated"),
          description: t("changesSavedSuccessfully"),
        });
      } else {
        toast({
          title: t("error"),
          description: result.message || t("failedToUpdateEvent"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      toast({
        title: t("networkError"),
        description: t("serverNotResponding"),
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

      const response = await fetch(`http://158.160.171.159:7291/api/events/delete/${event.id}`, {
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

    } catch (err: any) {
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
              <Edit className="h-5 w-5" /> {canEdit ? t("editEvent") : t("viewEvent")}
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              {canEdit ? t("makeChangesToEventDetails") : t("viewEventDetails")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-blue-700 font-medium">{t("eventTitle")}</Label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("enterEventTitle")}
                    className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-blue-700 font-medium">{t("category")}</Label>
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
                          placeholder={t("addNewCategory")}
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
                        <Tag className="mr-1 h-3 w-3" /> {t("addTag")}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-blue-700 font-medium">{t("eventImage")}</Label>
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
                          alt={t("eventPreview")} 
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
                        <span className="text-blue-600 font-medium">{t("uploadImage")}</span>
                        <span className="text-sm text-blue-400">{t("orDragAndDrop")}</span>
                      </label>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 h-48">
                        <ImageIcon className="h-10 w-10 text-blue-400" />
                        <span className="text-blue-600 font-medium">{t("noImage")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-blue-700 font-medium">{t("eventDescription")}</Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("describeYourEvent")}
                    className="border-blue-200 focus-visible:ring-blue-400 min-h-[300px] bg-blue-50"
                    disabled={!canEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-blue-700 font-medium">{t("eventDate")}</Label>
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
                  <Label htmlFor="place" className="text-blue-700 font-medium">{t("eventLocation")}</Label>
                  <Input 
                    id="place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder={t("enterEventLocation")}
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
          canEdit={canEdit}
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
          canEdit={canEdit}
        />
      )}
    </>
  );
};

export default EventEditDialog;
