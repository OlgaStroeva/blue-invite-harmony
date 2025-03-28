
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X, UserPlus, User } from "lucide-react";
import { Employee, EventEmployee } from "@/types/employee";

interface EmployeeListProps {
  eventId: number;
  eventEmployees: EventEmployee[];
  onRemoveEmployee: (eventEmployeeId: number) => void;
}

const EmployeeList = ({ eventId, eventEmployees, onRemoveEmployee }: EmployeeListProps) => {
  return (
    <div className="border border-blue-200 rounded-md bg-white overflow-hidden">
      {eventEmployees.length === 0 ? (
        <div className="text-center p-6">
          <User className="mx-auto h-10 w-10 text-blue-300 mb-2" />
          <h3 className="text-lg font-medium text-blue-700">No employees assigned</h3>
          <p className="text-blue-600 text-sm mt-1">
            Use the search above to find and assign employees to this event
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead className="text-blue-700">Employee</TableHead>
              <TableHead className="text-blue-700">Email</TableHead>
              <TableHead className="text-blue-700">Role</TableHead>
              <TableHead className="text-blue-700">Assigned</TableHead>
              <TableHead className="text-right text-blue-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventEmployees.map((eventEmployee) => (
              <TableRow key={eventEmployee.id} className="hover:bg-blue-50">
                <TableCell className="font-medium">
                  {eventEmployee.employee.name}
                </TableCell>
                <TableCell>{eventEmployee.employee.email}</TableCell>
                <TableCell>{eventEmployee.role || "Staff"}</TableCell>
                <TableCell>
                  {new Date(eventEmployee.assignedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveEmployee(eventEmployee.id)}
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
