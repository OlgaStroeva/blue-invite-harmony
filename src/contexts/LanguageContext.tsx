
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define available languages
export type Language = "en" | "ru";

// Language context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Language provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get initial language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage && ["en", "ru"].includes(savedLanguage) ? savedLanguage : "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translations = language === "en" ? enTranslations : ruTranslations;
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// English translations
const enTranslations: Record<string, string> = {
  // Navbar
  "events": "Events",
  "howItWorks": "How It Works",
  "testimonials": "Testimonials",
  "logIn": "Log In",
  "signUp": "Sign Up",
  
  // Registration Form
  "registrationForm": "Registration Form",
  "submitRegistration": "Submit Registration",
  "registrationComplete": "Registration Complete!",
  "thankYouRegistering": "Thank you for registering for {0}. We've sent a confirmation email to your address.",
  "returnHome": "Return Home",
  "eventNotFound": "Event Not Found",
  "eventNotExist": "The event you're looking for doesn't exist or has been removed.",
  
  // Form Fields
  "email": "Email",
  "fullName": "Full Name",
  "dietary": "Dietary Restrictions",
  "company": "Company",
  "position": "Position",
  "enter": "Enter"
};

// Russian translations
const ruTranslations: Record<string, string> = {
  // Navbar
  "events": "События",
  "howItWorks": "Как это работает",
  "testimonials": "Отзывы",
  "logIn": "Войти",
  "signUp": "Регистрация",
  
  // Registration Form
  "registrationForm": "Форма регистрации",
  "submitRegistration": "Отправить регистрацию",
  "registrationComplete": "Регистрация завершена!",
  "thankYouRegistering": "Спасибо за регистрацию на {0}. Мы отправили подтверждение на вашу электронную почту.",
  "returnHome": "Вернуться на главную",
  "eventNotFound": "Событие не найдено",
  "eventNotExist": "Событие, которое вы ищете, не существует или было удалено.",
  
  // Form Fields
  "email": "Электронная почта",
  "fullName": "Полное имя",
  "dietary": "Пищевые ограничения",
  "company": "Компания",
  "position": "Должность",
  "enter": "Введите"
};
