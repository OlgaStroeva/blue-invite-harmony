
import { useState, useEffect } from "react";
import { Edit, X, Image as ImageIcon, Tag, Save } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  title: string;
  category: string;
  description?: string;
  image: string;
  gradient: string;
}

interface EventEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onEventUpdated: (event: Event) => void;
}

const EventEditDialog = ({ open, onOpenChange, event, onEventUpdated }: EventEditDialogProps) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [category, setCategory] = useState(event.category);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event.image);
  const { toast } = useToast();

  // Update state when event changes
  useEffect(() => {
    setTitle(event.title);
    setDescription(event.description || "");
    setCategory(event.category);
    setImagePreview(event.image);
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

    // Update the event with new values
    const updatedEvent = {
      ...event,
      title,
      description,
      category,
      image: imagePreview,
      gradient: !imagePreview ? event.gradient : "",
    };

    onEventUpdated(updatedEvent);
    onOpenChange(false);
  };

  const categories = ["Wedding", "Birthday", "Corporate", "Party", "Formal"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Edit className="h-5 w-5" /> Edit Event
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            Make changes to your event details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Image */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="text-blue-700 font-medium">Event Image</Label>
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 hover:bg-blue-50/50 transition-colors cursor-pointer bg-blue-100/70">
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
                        className="w-full aspect-[4/3] object-cover rounded-md"
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

              {/* Category selector - Moved above title */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-blue-700 font-medium">Category</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant={category === cat ? "default" : "outline"}
                      className={category === cat 
                        ? "bg-blue-600 hover:bg-blue-700 text-white" 
                        : "hover:bg-blue-100 border-blue-200 bg-blue-50"
                      }
                      onClick={() => setCategory(cat)}
                    >
                      <Tag className="mr-1 h-4 w-4" />
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <Card className="overflow-hidden border-blue-200 bg-blue-100/50">
                <CardContent className="p-4">
                  <div 
                    className={`aspect-[4/5] rounded-lg overflow-hidden ${
                      imagePreview 
                        ? "" 
                        : `bg-gradient-to-br ${event.gradient}`
                    } relative p-4 flex flex-col justify-between`}
                    style={imagePreview ? { backgroundImage: `url(${imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  >
                    <div className="relative z-10">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-white/80 text-blue-700 rounded-md backdrop-blur-sm">
                        {category}
                      </span>
                    </div>
                    
                    <div className="relative z-10 mt-auto">
                      <div className="bg-black/60 backdrop-blur-sm p-3 rounded-lg">
                        <h3 className="text-base font-medium text-white mb-2">
                          {title || "Event Title"}
                        </h3>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-blue-700 font-medium">Event Title</Label>
                <Input 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title..."
                  className="border-blue-200 focus-visible:ring-blue-400 bg-blue-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-blue-700 font-medium">Description</Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event..."
                  className="border-blue-200 focus-visible:ring-blue-400 min-h-[230px] bg-blue-50"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 pt-4 border-t border-blue-200">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-blue-200 bg-blue-50 hover:bg-blue-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
