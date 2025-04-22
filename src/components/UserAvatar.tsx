
import { useNavigate } from "react-router-dom";
import { 
  HoverCard,
  HoverCardTrigger,
  HoverCardContent 
} from "@/components/ui/hover-card";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock user data - in a real app, this would come from authentication context
const mockUser = {
  name: "Jane Smith",
  email: "jane.smith@example.com",
  avatar: "" // Add image URL here if available
};

const UserAvatar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Perform logout logic
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out",
    });
    navigate("/");
  };
  
  const goToAccount = () => {
    navigate("/account");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button 
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9 cursor-pointer">
            {mockUser.avatar ? (
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(mockUser.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-56 p-3">
        <div className="flex justify-center mb-2">
          <Avatar className="h-16 w-16">
            {mockUser.avatar ? (
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {getInitials(mockUser.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="text-center mb-3">
          <h4 className="font-medium">{mockUser.name}</h4>
          <p className="text-sm text-muted-foreground">{mockUser.email}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start" 
            onClick={goToAccount}
          >
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserAvatar;
