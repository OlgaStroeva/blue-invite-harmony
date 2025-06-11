
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StaffPreferences from "./StaffPreferences";

const AccountPreferences = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Preferences</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>
      
      <StaffPreferences />
      
      {/* Add more preference sections here as needed */}
    </div>
  );
};

export default AccountPreferences;
