
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThirdPartyAuthButton } from "./ThirdPartyAuthButton";

interface ThirdPartyAuthProps {
  isLoading: boolean;
}

const ThirdPartyAuth = ({ isLoading }: ThirdPartyAuthProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleThirdPartyAuth = async (provider: string) => {
    setError("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // For demo purposes, we'll just simulate a successful login
      login("demo@gmail.com", "demopass");
      toast({
        title: `Signed in with ${provider}`,
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      console.error(err);
    }
  };

  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("orContinueWith")}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <ThirdPartyAuthButton 
          provider="Google" 
          onClick={() => handleThirdPartyAuth("Google")}
          disabled={isLoading}
        />
        <ThirdPartyAuthButton 
          provider="Yandex" 
          onClick={() => handleThirdPartyAuth("Yandex")}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default ThirdPartyAuth;
