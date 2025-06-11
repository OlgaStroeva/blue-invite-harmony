
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
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";



const UserAvatar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  

  type User = {
    id: number;
    name: string;
    email: string;
    canBeStaff: boolean;
    isEmailConfirmed: boolean;
  };


  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    fetch("https://localhost:7291/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
        .then(res => res.json())
        .then(data => {
          setUser(data);
          console.log("User data:", data);
        })
        .catch(err => {
          console.error("Failed to fetch user:", err);
        });
  }, []);

  const handleLogout = () => {
    // Perform logout logic
    logout();
    toast({
      title: t("loggedOutSuccessfully"),
      description: t("youHaveBeenSignedOut"),
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
          aria-label={t("userMenu")}
        >
          <Avatar className="h-9 w-9 cursor-pointer">
            {mockUser.avatar ? (
              <AvatarImage src={User.avatar} alt={User.name} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(User.name)}
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
            {t("accountSettings")}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("signOut")}
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserAvatar;
