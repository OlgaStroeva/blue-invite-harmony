
export interface Employee {
  id: number;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface EventEmployee {
  id: number;
  eventId: number;
  employeeId: number;
  employee: Employee;
  assignedAt: string;
  role?: string;
}
