
const API_BASE_URL = "https://localhost:7291/api";

export interface StaffSearchResult {
  id: number;
  name: string;
  email: string;
  canBeStaff: boolean;
}

export interface AssignStaffRequest {
  eventId: number;
  userId: number;
}

export interface RemoveStaffRequest {
  eventId: number;
  userId: number;
}

export interface LeaveStaffRequest {
  eventId: number;
}

export class StaffService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  static async findStaff(emailPart: string): Promise<StaffSearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/find?emailPart=${encodeURIComponent(emailPart)}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error finding staff:", error);
      throw error;
    }
  }

  static async assignStaff(request: AssignStaffRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/assign-staff`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
      throw error;
    }
  }

  static async removeStaff(request: RemoveStaffRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/remove`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error removing staff:", error);
      throw error;
    }
  }

  static async leaveStaff(request: LeaveStaffRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/leave`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error leaving staff:", error);
      throw error;
    }
  }

  static async toggleCanBeStaff(userId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/toggle-can-be-staff/${userId}`, {
        method: "POST",
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error toggling can be staff:", error);
      throw error;
    }
  }

  static async getEventStaff(eventId: number): Promise<number[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/staff/${eventId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting event staff:", error);
      throw error;
    }
  }
}
