
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface SuccessMessageProps {
  eventTitle: string;
}

const SuccessMessage = ({ eventTitle }: SuccessMessageProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-blue-700">{t("registrationComplete")}</h1>
        <p className="text-blue-600 mt-2">
          {t("thankYouRegistering").replace("{0}", eventTitle)}
        </p>
        <Button 
          className="mt-6 bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          {t("returnHome")}
        </Button>
      </div>
    </div>
  );
};

export default SuccessMessage;
