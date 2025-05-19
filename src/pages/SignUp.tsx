
import AuthLayout from "@/components/auth/AuthLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import SignUpForm from "@/components/auth/SignUpForm";
import { useLanguage } from "@/contexts/LanguageContext";

const SignUp = () => {
  const { t } = useLanguage();
  
  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t("createAccount")}</CardTitle>
          <CardDescription className="text-center">
            {t("enterCredentials")}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link to="/sign-in" className="text-blue-600 hover:text-blue-800 font-medium">
              {t("signInHeading")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default SignUp;
