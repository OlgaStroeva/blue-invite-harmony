
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { StaffService } from "@/services/staffService";
import { Loader2 } from "lucide-react";

const StaffPreferences = () => {
  const [canBeStaff, setCanBeStaff] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setCanBeStaff(user.canBeStaff);
      setIsLoading(false);
    }
  }, [user]);

  const handleToggleCanBeStaff = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await StaffService.toggleCanBeStaff(user.id);
      setCanBeStaff(!canBeStaff);
      
      toast({
        title: "Preferences updated",
        description: `You ${!canBeStaff ? 'can now' : 'can no longer'} be assigned as staff to events`,
      });
    } catch (error) {
      console.error("Error updating staff preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update staff preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Preferences</CardTitle>
        <CardDescription>
          Manage your availability to be assigned as staff to events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="can-be-staff">Available as Staff</Label>
            <p className="text-sm text-muted-foreground">
              Allow event organizers to assign you as staff to their events
            </p>
          </div>
          <Switch
            id="can-be-staff"
            checked={canBeStaff}
            onCheckedChange={handleToggleCanBeStaff}
            disabled={isSaving}
          />
        </div>
        
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating preferences...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffPreferences;
