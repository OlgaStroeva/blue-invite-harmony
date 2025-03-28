
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { UserPlus, User } from "lucide-react";

interface EmployeeSearchResultProps {
  employee: Employee | null;
  isLoading: boolean;
  error: string | null;
  onAssign: (employee: Employee) => void;
}

const EmployeeSearchResult = ({ 
  employee, 
  isLoading, 
  error,
  onAssign 
}: EmployeeSearchResultProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 border rounded-md bg-blue-50 border-blue-200">
        <div className="animate-pulse text-blue-600">Searching...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-md bg-red-50 border-red-200 text-red-700">
        {error}
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="p-4 border rounded-md bg-blue-50 border-blue-200 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-blue-800">{employee.name}</h4>
          <p className="text-sm text-blue-600">{employee.email}</p>
          {employee.role && <p className="text-xs text-blue-500">{employee.role}</p>}
        </div>
      </div>
      <Button 
        onClick={() => onAssign(employee)}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Assign
      </Button>
    </div>
  );
};

export default EmployeeSearchResult;
