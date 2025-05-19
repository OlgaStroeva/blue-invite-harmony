
import { useState } from "react";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordDialog = ({ open, onOpenChange }: ForgotPasswordDialogProps) => {
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess(false);
    setIsResetLoading(true);

    try {
      // This is a mock implementation - in a real app, you would call an API to handle password reset
      if (!resetEmail) {
        setResetError("Please enter your email address");
        return;
      }

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just show a success message
      setResetSuccess(true);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setResetEmail("");
      }, 3000);
    } catch (err) {
      setResetError("Failed to send password reset email. Please try again.");
      console.error(err);
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleForgotPassword} className="space-y-4">
          {resetError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}
          
          {resetSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">Password reset email sent successfully!</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={isResetLoading || resetSuccess}
                required
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isResetLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isResetLoading || resetSuccess}
              className="bg-blue-gradient"
            >
              {isResetLoading ? "Sending..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
