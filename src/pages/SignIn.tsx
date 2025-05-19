
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import SignInForm from "@/components/auth/SignInForm";

const SignIn = () => {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <Container className="max-w-md py-20 min-h-screen flex flex-col justify-center">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("backToHome")}
          </Link>
        </div>
        
        <SignInForm />
      </Container>
    </>
  );
};

export default SignIn;
