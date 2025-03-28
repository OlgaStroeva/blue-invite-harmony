
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserAvatar from "@/components/UserAvatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  // Mock authentication state - in a real app, this would come from an auth context
  const isAuthenticated = true;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-white/80 shadow-sm backdrop-blur-md"
          : "py-5 bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-semibold relative">
              <span className="text-gradient">Invite</span>
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <UserAvatar />
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/sign-in">{t("logIn")}</Link>
                  </Button>
                  <Button size="sm" className="bg-blue-gradient hover:shadow-highlight transition-all duration-300" asChild>
                    <Link to="/sign-up">{t("signUp")}</Link>
                  </Button>
                </>
              )}
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            {isAuthenticated && <UserAvatar />}
            <button
              className="text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 glassmorphism animate-slideDown">
          <div className="flex flex-col space-y-3">
            <NavLinks mobile />
            {!isAuthenticated && (
              <div className="pt-3 flex flex-col space-y-3">
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link to="/sign-in">{t("logIn")}</Link>
                </Button>
                <Button size="sm" className="bg-blue-gradient" asChild>
                  <Link to="/sign-up">{t("signUp")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
  const { t } = useLanguage();
  const baseClasses = "transition-all duration-200 hover:text-blue-600";
  const mobileClasses = "block py-2";
  const desktopClasses = "text-sm font-medium text-gray-600";
  
  return (
    <>
      <Link
        to="#events"
        className={`${baseClasses} ${
          mobile ? mobileClasses : desktopClasses
        }`}
      >
        {t("events")}
      </Link>
      <Link
        to="#how-it-works"
        className={`${baseClasses} ${
          mobile ? mobileClasses : desktopClasses
        }`}
      >
        {t("howItWorks")}
      </Link>
      <Link
        to="#testimonials"
        className={`${baseClasses} ${
          mobile ? mobileClasses : desktopClasses
        }`}
      >
        {t("testimonials")}
      </Link>
    </>
  );
};

export default Navbar;
