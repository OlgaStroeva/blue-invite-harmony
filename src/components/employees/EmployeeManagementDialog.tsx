
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Employee, EventEmployee } from "@/types/employee";
import { Event } from "@/types/event";

interface EmployeeManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
}

// Mock data - in a real app this would come from your backend
const mockEmployees: Employee[] = [
  { id: 1, name: "Jane Cooper", email: "jane@example.com", role: "Event Manager" },
  { id: 2, name: "Robert Fox", email: "robert@example.com", role: "Coordinator" },
  { id: 3, name: "Esther Howard", email: "esther@example.com", role: "Assistant" }
];

const EmployeeManagementDialog = ({ 
  open, 
  onOpenChange, 
  event 
}: EmployeeManagementDialogProps) => {
  const [searchResult, setSearchResult] = useState<Employee | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [eventEmployees, setEventEmployees] = useState<EventEmployee[]>([
    { 
      id: 1, 
      eventId: event.id, 
      employeeId: 1, 
      employee: mockEmployees[0], 
      assignedAt: new Date().toISOString() 
    }
  ]);
  const { toast } = useToast();

  const handleSearch = (email: string) => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const employee = mockEmployees.find(emp => emp.email.toLowerCase() === email.toLowerCase());
      
      if (employee) {
        // Check if employee is already assigned to this event
        const alreadyAssigned = eventEmployees.some(ee => ee.employeeId === employee.id);
        
        if (alreadyAssigned) {
          setSearchError("This employee is already assigned to this event");
        } else {
          setSearchResult(employee);
        }
      } else {
        setSearchError("No employee found with that email");
      }
      
      setIsSearching(false);
    }, 1000);
  };

  const handleAssignEmployee = (employee: Employee) => {
    const newEventEmployee: EventEmployee = {
      id: Date.now(), // Just for mock data, in a real app this would come from the backend
      eventId: event.id,
      employeeId: employee.id,
      employee,
      assignedAt: new Date().toISOString(),
      role: employee.role
    };
    
    setEventEmployees(prev => [...prev, newEventEmployee]);
    setSearchResult(null);
    
    toast({
      title: "Employee assigned",
      description: `${employee.name} has been assigned to this event`,
    });
  };

  const handleRemoveEmployee = (eventEmployeeId: number) => {
    setEventEmployees(prev => prev.filter(ee => ee.id !== eventEmployeeId));
    
    toast({
      title: "Employee removed",
      description: "The employee has been removed from this event",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-50 border-blue-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Users className="h-5 w-5" /> 
            Manage Employees
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            Assign and manage employees for {event.title}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="assign" className="mt-4">
          <TabsList className="grid grid-cols-2 bg-blue-100">
            <TabsTrigger value="assign" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Assign Employees
            </TabsTrigger>
            <TabsTrigger value="view" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              View Assigned ({eventEmployees.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assign" className="space-y-4 py-4">
            <EmployeeSearchInput 
              onSearch={handleSearch} 
              isLoading={isSearching} 
            />
            
            {(searchResult || isSearching || searchError) && (
              <EmployeeSearchResult 
                employee={searchResult}
                isLoading={isSearching}
                error={searchError}
                onAssign={handleAssignEmployee}
              />
            )}
          </TabsContent>
          
          <TabsContent value="view" className="py-4">
            <EmployeeList 
              eventId={event.id}
              eventEmployees={eventEmployees}
              onRemoveEmployee={handleRemoveEmployee}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeManagementDialog;
