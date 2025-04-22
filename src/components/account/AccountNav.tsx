
import { useNavigate } from "react-router-dom";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, User, Lock, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/App";
import { useToast } from "@/hooks/use-toast";

interface AccountNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AccountNav = ({ activeTab, onTabChange }: AccountNavProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out",
    });
    navigate("/");
  };

  return (
    <div className="w-full md:w-64 mb-6 md:mb-0">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="md:hidden mb-4"
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex w-full justify-between items-center">
            <span>Account Settings</span>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <NavItems activeTab={activeTab} onTabChange={onTabChange} onLogout={handleLogout} />
        </CollapsibleContent>
      </Collapsible>

      <div className="hidden md:block">
        <h3 className="font-medium text-lg mb-3">Account Settings</h3>
        <NavItems activeTab={activeTab} onTabChange={onTabChange} onLogout={handleLogout} />
      </div>
    </div>
  );
};

interface NavItemsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const NavItems = ({ activeTab, onTabChange, onLogout }: NavItemsProps) => {
  const isActive = (tab: string) => activeTab === tab;

  return (
    <nav className="flex flex-col space-y-1">
      <NavButton 
        icon={<User className="h-4 w-4 mr-2" />}
        label="Personal Info"
        active={isActive("personal")}
        onClick={() => onTabChange("personal")}
      />
      <NavButton 
        icon={<Lock className="h-4 w-4 mr-2" />}
        label="Password"
        active={isActive("password")}
        onClick={() => onTabChange("password")}
      />
      <NavButton 
        icon={<Settings className="h-4 w-4 mr-2" />}
        label="Preferences"
        active={isActive("preferences")}
        onClick={() => onTabChange("preferences")}
      />
      <div className="pt-4 mt-4 border-t">
        <NavButton 
          icon={<LogOut className="h-4 w-4 mr-2" />}
          label="Logout"
          onClick={onLogout}
          variant="destructive"
        />
      </div>
    </nav>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  variant?: "default" | "destructive";
}

const NavButton = ({ icon, label, onClick, active = false, variant = "default" }: NavButtonProps) => {
  const baseClasses = "flex items-center text-sm px-3 py-2 rounded-md transition-colors";
  
  let className = "";
  if (variant === "destructive") {
    className = `${baseClasses} text-red-600 hover:bg-red-100 hover:text-red-700`;
  } else if (active) {
    className = `${baseClasses} bg-primary/10 text-primary font-medium`;
  } else {
    className = `${baseClasses} hover:bg-muted text-muted-foreground hover:text-foreground`;
  }
  
  return (
    <button className={className} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
};

export default AccountNav;
