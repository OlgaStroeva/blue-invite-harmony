
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, User, Loader2 } from "lucide-react";
import { StaffService, StaffSearchResult } from "@/services/staffService";
import { useToast } from "@/hooks/use-toast";

interface EmployeeListProps {
  eventId: number;
  staffIds: number[];
  onRemoveEmployee: (userId: number) => void;
  isLoading: boolean;
}

const EmployeeList = ({ eventId, staffIds, onRemoveEmployee, isLoading }: EmployeeListProps) => {
  const [staffMembers, setStaffMembers] = useState<StaffSearchResult[]>([]);
  const [loadingStaffDetails, setLoadingStaffDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (staffIds.length > 0) {
      loadStaffDetails();
    } else {
      setStaffMembers([]);
    }
  }, [staffIds]);

  const loadStaffDetails = async () => {
    try {
      setLoadingStaffDetails(true);
      // Since we don't have a bulk user details endpoint, we'll simulate it
      // In a real app, you'd want a /api/users/bulk endpoint
      const staffDetails: StaffSearchResult[] = staffIds.map(id => ({
        id,
        name: `Staff Member ${id}`,
        email: `staff${id}@example.com`,
        canBeStaff: true
      }));
      setStaffMembers(staffDetails);
    } catch (error) {
      console.error("Error loading staff details:", error);
      toast({
        title: "Error",
        description: "Failed to load staff details",
        variant: "destructive",
      });
    } finally {
      setLoadingStaffDetails(false);
    }
  };

  if (isLoading || loadingStaffDetails) {
    return (
      <div className="flex items-center justify-center p-6 border border-blue-200 rounded-md bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
        <span className="text-blue-600">Loading staff...</span>
      </div>
    );
  }

  return (
    <div className="border border-blue-200 rounded-md bg-white overflow-hidden">
      {staffMembers.length === 0 ? (
        <div className="text-center p-6">
          <User className="mx-auto h-10 w-10 text-blue-300 mb-2" />
          <h3 className="text-lg font-medium text-blue-700">No staff assigned</h3>
          <p className="text-blue-600 text-sm mt-1">
            Use the search above to find and assign staff to this event
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="text-blue-700">Staff Member</TableHead>
              <TableHead className="text-blue-700">Email</TableHead>
              <TableHead className="text-right text-blue-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers.map((member) => (
              <TableRow key={member.id} className="hover:bg-blue-50">
                <TableCell className="font-medium">
                  {member.name}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveEmployee(member.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default EmployeeList;
