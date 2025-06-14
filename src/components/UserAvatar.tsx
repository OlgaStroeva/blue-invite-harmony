
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

type User = {
  id: number;
  name: string;
  email: string;
  canBeStaff: boolean;
  isEmailConfirmed: boolean;
  avatar?: string;
};

const UserAvatar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("https://localhost:7291/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          console.log("User data loaded:", userData);
        } else {
          console.error("Failed to fetch user data:", response.status);
          // If unauthorized, clear token and logout
          if (response.status === 401) {
            localStorage.removeItem("token");
            logout();
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [logout]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    
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
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button 
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          aria-label={t("userMenu")}
        >
          <Avatar className="h-9 w-9 cursor-pointer">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-56 p-3">
        <div className="flex justify-center mb-2">
          <Avatar className="h-16 w-16">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="text-center mb-3">
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-sm text-muted-foreground">{user.email}</p>
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
