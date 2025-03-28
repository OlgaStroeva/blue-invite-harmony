
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const EventNotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-blue-700">{t("eventNotFound")}</h1>
        <p className="text-blue-600 mt-2">{t("eventNotExist")}</p>
        <Button 
          className="mt-4 bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          {t("returnHome")}
        </Button>
      </div>
    </div>
  );
};

export default EventNotFound;
