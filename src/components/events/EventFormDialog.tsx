
import { useState, useEffect } from "react";
import { PlusCircle, X, Image as ImageIcon, Tag, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import EventEditDialog from "./EventEditDialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: (event: any) => void;
}

const EventFormDialog = ({ open, onOpenChange, onEventCreated }: EventFormDialogProps) => {
  const [Name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [tempEvent, setTempEvent] = useState<any>(null);
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Get all unique categories from existing events
  const [existingCategories, setExistingCategories] = useState<string[]>([
    "Wedding", "Birthday", "Corporate", "Party", "Formal"
  ]);

  const handleContinue = async () => {
    if (!Name.trim()) {
      toast({
        title: t("titleRequired"),
        description: t("pleaseEnterTitle"),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://158.160.171.159:7291/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ Name : Name })
      });

      const result = await response.json();

      if (response.ok) {
        const newEvent = {
          id: result.eventId,
          title: Name,
          description: "",
          image: "",
          date: "",
          time: "",
          location: "",
          category: "",
          status: 'upcoming' as const,
          createdBy: 0
        };
        setTempEvent(newEvent);
        onOpenChange(false);
        setShowEditDialog(true);
      } else {
        toast({
          title: t("error"),
          description: result.message || t("failedToCreateEvent"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка создания мероприятия:", error);
      toast({
        title: t("networkError"),
        description: t("serverNotResponding"),
        variant: "destructive",
      });
    }
  };

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

  const handleEventUpdated = (updatedEvent: any) => {
    // Pass the updated event to parent component
    onEventCreated(updatedEvent);
    
    // Reset the state
    resetForm();
  };
  
  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setNewTag("");
    setShowTagInput(false);
    setImage(null);
    setImagePreview("");
    setTempEvent(null);
  };
  
  const handleEditDialogClose = (open: boolean) => {
    setShowEditDialog(open);
    if (!open && !tempEvent) {
      // If the edit dialog is closed without creating an event, reopen the title dialog
      onOpenChange(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("createNewEvent")}</DialogTitle>
            <DialogDescription>
              {t("startWithEventTitle")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-blue-700">{t("eventTitle")}</Label>
              <Input 
                id="title"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("enterEventTitle")}
                className="border-blue-200 focus-visible:ring-blue-400"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button 
                type="button"
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t("continue")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {tempEvent && (
        <EventEditDialog 
          open={showEditDialog}
          onOpenChange={handleEditDialogClose}
          event={tempEvent}
          onEventUpdated={handleEventUpdated}
          canEdit={true}
          canDelete={false}
        />
      )}
    </>
  );
};

export default EventFormDialog;
