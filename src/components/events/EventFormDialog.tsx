
import { useState } from "react";
import { PlusCircle, X, Image as ImageIcon, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: (event: any) => void;
}

const EventFormDialog = ({ open, onOpenChange, onEventCreated }: EventFormDialogProps) => {
  const [step, setStep] = useState<'title' | 'details'>('title');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Wedding");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const handleContinue = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your event",
        variant: "destructive",
      });
      return;
    }
    setStep('details');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !category) {
      toast({
        title: "Missing information",
        description: "Please ensure you've filled in the required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique ID and blue gradient if no image
    const newEvent = {
      id: Date.now(),
      title,
      description,
      category,
      image: imagePreview,
      gradient: !imagePreview ? `from-blue-${Math.floor(Math.random() * 5 + 2)}00 to-blue-${Math.floor(Math.random() * 5 + 4)}00` : "",
    };

    onEventCreated(newEvent);
    
    // Reset form and close dialog
    setTitle("");
    setDescription("");
    setCategory("Wedding");
    setImage(null);
    setImagePreview("");
    setStep('title');
    onOpenChange(false);
    
    toast({
      title: "Event Created",
      description: "Your new event has been created successfully!",
    });
  };

  const categories = ["Wedding", "Birthday", "Corporate", "Party", "Formal"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === 'title' ? "Create New Event" : `Event: ${title}`}</DialogTitle>
          <DialogDescription>
            {step === 'title' 
              ? "Let's start with a title for your event"
              : "Add more details about your event"}
          </DialogDescription>
        </DialogHeader>

        {step === 'title' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-blue-700">Event Title</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title..."
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
                Continue
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-700">Description</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                className="border-blue-200 focus-visible:ring-blue-400 min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-blue-700">Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    className={category === cat 
                      ? "bg-blue-600 hover:bg-blue-700 text-white" 
                      : "hover:bg-blue-50 border-blue-200"
                    }
                    onClick={() => setCategory(cat)}
                  >
                    <Tag className="mr-1 h-4 w-4" />
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image" className="text-blue-700">Event Image</Label>
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 hover:bg-blue-50/50 transition-colors cursor-pointer">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Event preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
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
                  </div>
                ) : (
                  <label htmlFor="image" className="flex flex-col items-center justify-center gap-2 h-48">
                    <ImageIcon className="h-10 w-10 text-blue-400" />
                    <span className="text-blue-600 font-medium">Upload an image</span>
                    <span className="text-sm text-blue-400">or drag and drop</span>
                  </label>
                )}
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setStep('title')}
                className="border-blue-200"
              >
                Back
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Event
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
