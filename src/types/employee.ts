
export interface Employee {
  id: number;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  isEmployer?: boolean; // Flag to indicate if the user is an employer (staff member)
  assignmentPreferences?: {
    allowAssignmentByOthers: boolean;
  };
}

export interface EventEmployee {
  id: number;
  eventId: number;
  employeeId: number;
  employee: Employee;
  assignedAt: string;
  role?: string;
}
