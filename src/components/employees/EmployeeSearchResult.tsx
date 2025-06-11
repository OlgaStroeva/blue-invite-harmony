
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { StaffSearchResult } from "@/services/staffService";

interface EmployeeSearchResultProps {
  employee: StaffSearchResult | null;
  isLoading: boolean;
  error: string | null;
  onAssign: (employee: StaffSearchResult) => void;
}

const EmployeeSearchResult = ({ 
  employee, 
  isLoading, 
  error, 
  onAssign 
}: EmployeeSearchResultProps) => {
  if (isLoading) {
    return (
      <Card className="border-blue-200">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-blue-600">Searching...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center p-4">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </CardContent>
      </Card>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <Card className="border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{employee.name}</h4>
              <p className="text-sm text-gray-500">{employee.email}</p>
              {!employee.canBeStaff && (
                <p className="text-xs text-amber-600">Cannot be assigned as staff</p>
              )}
            </div>
          </div>
          <Button
            onClick={() => onAssign(employee)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!employee.canBeStaff}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Assign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeSearchResult;
