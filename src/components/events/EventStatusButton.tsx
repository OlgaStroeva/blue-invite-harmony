
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Event } from "@/types/event";
import { Play, Square, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EventStatusButtonProps {
  event: Event;
  onStatusChange: (event: Event, newStatus: 'upcoming' | 'in_progress' | 'finished') => void;
}

const EventStatusButton = ({ event, onStatusChange }: EventStatusButtonProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { t } = useLanguage();
  
  const handleStatusChange = () => {
    if (event.status === 'upcoming') {
      onStatusChange(event, 'in_progress');
    } else if (event.status === 'in_progress') {
      onStatusChange(event, 'finished');
    }
    setShowConfirmDialog(false);
  };

  const getButtonContent = () => {
    switch (event.status) {
      case 'upcoming':
        return {
          text: t('start'),
          icon: <Play className="h-4 w-4 mr-2" />,
          className: "bg-green-600 hover:bg-green-700"
        };
      case 'in_progress':
        return {
          text: t('finish'),
          icon: <Square className="h-4 w-4 mr-2" />,
          className: "bg-blue-600 hover:bg-blue-700"
        };
      case 'finished':
        return {
          text: t('finished'),
          icon: <Check className="h-4 w-4 mr-2" />,
          className: "bg-gray-500 cursor-not-allowed"
        };
      default:
        return null;
    }
  };

  const buttonContent = getButtonContent();
  
  // If we don't have button content or the event has no status, don't render anything
  if (!buttonContent || !event.status) return null;

  return (
    <>
      <Button
        size="sm"
        onClick={() => event.status !== 'finished' && setShowConfirmDialog(true)}
        className={`text-white ${buttonContent.className}`}
        disabled={event.status === 'finished'}
      >
        {buttonContent.icon}
        {buttonContent.text}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmEventStatusChange")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("areYouSureStatus")} {event.status === 'upcoming' ? t('start') : t('finish')} {t("thisEvent")}
              {event.status === 'in_progress' && ` ${t("actionCannotBeUndone")}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>{t("confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventStatusButton;
