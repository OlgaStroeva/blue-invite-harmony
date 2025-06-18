import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import EmployeeSearchInput from "./EmployeeSearchInput";
import EmployeeSearchResult from "./EmployeeSearchResult";
import EmployeeList from "./EmployeeList";
import { Event } from "@/types/event";
import { StaffService, StaffSearchResult } from "@/services/staffService";

interface EmployeeManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  canEdit: boolean;
}

const EmployeeManagementDialog = ({ 
  open, 
  onOpenChange, 
  event,
  canEdit
}: EmployeeManagementDialogProps) => {
  const [searchResults, setSearchResults] = useState<StaffSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [eventStaffIds, setEventStaffIds] = useState<number[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (open) {
      loadEventStaff();
    }
  }, [open, event.id]);

  const loadEventStaff = async () => {
    try {
      setIsLoadingStaff(true);
      const staffIds = await StaffService.getEventStaff(event.id);
      setEventStaffIds(staffIds);
    } catch (error) {
      console.error("Error loading event staff:", error);
      toast({
        title: "Error",
        description: "Failed to load event staff",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const handleSearch = async (emailPart: string) => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    
    try {
      const results = await StaffService.findStaff(emailPart);
      
      // Filter out staff already assigned to this event
      const filteredResults = results.filter(staff => !eventStaffIds.includes(staff.id));
      
      if (filteredResults.length === 0) {
        setSearchError("No available staff found with that email");
      } else {
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Error searching staff:", error);
      setSearchError("Failed to search for staff");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssignEmployee = async (employee: StaffSearchResult) => {
    try {
      await StaffService.assignStaff({
        eventId: event.id,
        userId: employee.id
      });
      
      setEventStaffIds(prev => [...prev, employee.id]);
      setSearchResults(prev => prev.filter(s => s.id !== employee.id));
      
      toast({
        title: "Staff assigned",
        description: `${employee.name} has been assigned to this event`,
      });
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast({
        title: "Error",
        description: "Failed to assign staff member",
        variant: "destructive",
      });
    }
  };

  const handleRemoveEmployee = async (userId: number) => {
    try {
      await StaffService.removeStaff({
        eventId: event.id,
        userId: userId
      });
      
      setEventStaffIds(prev => prev.filter(id => id !== userId));
      
      toast({
        title: "Staff removed",
        description: "The staff member has been removed from this event",
      });
    } catch (error) {
      console.error("Error removing staff:", error);
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Users className="h-5 w-5" /> 
            {canEdit ? t("manageStaff") : t("viewStaff")}
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            {canEdit ? t("searchAndAssignStaff") : `${t("viewStaff")} ${t("for")}`} {event.title}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={canEdit ? "assign" : "view"} className="mt-4">
          <TabsList className="grid grid-cols-2 bg-blue-100">
            {canEdit && (
              <TabsTrigger value="assign" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                {t("assignStaff")}
              </TabsTrigger>
            )}
            <TabsTrigger value="view" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              {canEdit ? t("viewAssigned") : t("staff")} ({eventStaffIds.length})
            </TabsTrigger>
          </TabsList>
          
          {canEdit && (
            <TabsContent value="assign" className="space-y-4 py-4">
              <EmployeeSearchInput 
                onSearch={handleSearch} 
                isLoading={isSearching} 
              />
              
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((employee) => (
                    <EmployeeSearchResult 
                      key={employee.id}
                      employee={employee}
                      isLoading={false}
                      error={null}
                      onAssign={handleAssignEmployee}
                    />
                  ))}
                </div>
              )}
              
              {(isSearching || searchError) && (
                <EmployeeSearchResult 
                  employee={null}
                  isLoading={isSearching}
                  error={searchError}
                  onAssign={handleAssignEmployee}
                />
              )}
            </TabsContent>
          )}
          
          <TabsContent value="view" className="py-4">
            <EmployeeList 
              eventId={event.id}
              staffIds={eventStaffIds}
              onRemoveEmployee={canEdit ? handleRemoveEmployee : undefined}
              isLoading={isLoadingStaff}
              canEdit={canEdit}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeManagementDialog;
