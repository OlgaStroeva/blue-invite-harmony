
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Mail, Lock, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { ThirdPartyAuthButton } from "@/components/auth/ThirdPartyAuthButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { login } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (email && password) {
        const result = await login(email, password);
        
        if (result.success) {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          navigate("/dashboard");
        } else {
          setError(result.message || "Invalid email or password");
        }
      } else {
        setError("Please fill in all fields");
      }
    } catch (err) {
      setError("An error occurred during sign in");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
        setForgotPasswordOpen(false);
        setResetEmail("");
      }, 3000);
    } catch (err) {
      setResetError("Failed to send password reset email. Please try again.");
      console.error(err);
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleThirdPartyAuth = async (provider: string) => {
    setIsLoading(true);
    setError("");
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // For demo purposes, we'll just simulate a successful login
      login("demo@gmail.com", "demopass");
      toast({
        title: `Signed in with ${provider}`,
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="max-w-md py-20 min-h-screen flex flex-col justify-center">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("backToHome")}
          </Link>
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t("signInHeading")}</CardTitle>
            <CardDescription className="text-center">
              {t("enterCredentials")}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Button 
                    variant="link" 
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    {t("forgotPassword")}
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-gradient" 
                disabled={isLoading}
              >
                {isLoading ? t("signingIn") : t("logIn")}
              </Button>
            </form>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ThirdPartyAuthButton 
                provider="Google" 
                onClick={() => handleThirdPartyAuth("Google")}
                disabled={isLoading}
              />
              <ThirdPartyAuthButton 
                provider="Yandex" 
                onClick={() => handleThirdPartyAuth("Yandex")}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-center text-sm text-muted-foreground">
              {t("dontHaveAccount")}{" "}
              <Link to="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
                {t("signUp")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Container>

      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
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
                onClick={() => setForgotPasswordOpen(false)}
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
    </>
  );
};

export default SignIn;
