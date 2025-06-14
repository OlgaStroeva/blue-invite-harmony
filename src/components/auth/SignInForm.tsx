import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import ForgotPasswordDialog from "./ForgotPasswordDialog";
import ThirdPartyAuth from "./ThirdPartyAuth";
import React, { useState, useEffect } from "react";


const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const {login} = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("confirm");

    if (token) {
      fetch("https://158.160.171.159:7291/api/auth/confirm-email?token=" + token, {
        method: "GET"
      })
          .then(async (res) => {
            const result = await res.json();
            if (res.ok && result.success) {
              toast({ title: "Email подтвержден", description: result.message });
            } else {
              toast({ title: "Ошибка подтверждения", description: result.message });
            }
          })
          .catch((err) => {
            console.error(err);
            toast({ title: "Ошибка сервера" });
          });
    }
  }, []);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (email && password) {
        const response = await fetch("http://158.160.171.159:7291/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem("token", result.token);// сохранить токен
          toast({
            title: "Signed in successfully",
            description: result.message || "Welcome back!",
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


  return (
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

          <ThirdPartyAuth isLoading={isLoading} />
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            {t("dontHaveAccount")}{" "}
            <Link to="/sign-up" className="text-blue-600 hover:text-blue-800 font-medium">
              {t("signUp")}
            </Link>
          </p>
        </CardFooter>

        <ForgotPasswordDialog
            open={forgotPasswordOpen}
            onOpenChange={setForgotPasswordOpen}
        />
      </Card>
  );
};

export default SignInForm;