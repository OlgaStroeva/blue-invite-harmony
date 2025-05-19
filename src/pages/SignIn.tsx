
import { useLanguage } from "@/contexts/LanguageContext";
import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";

const SignIn = () => {
  const { t } = useLanguage();

  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};

export default SignIn;
