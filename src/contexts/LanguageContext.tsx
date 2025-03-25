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
  
  // Hero section
  "simpleElegantEffective": "Simple. Elegant. Effective.",
  "createBeautifulInvitations": "Create Beautiful Invitations That Leave an Impression",
  "craftStunningDigital": "Craft stunning digital invitations for any occasion with our intuitive platform. Designed for simplicity and elegance.",
  "createYourInvitation": "Create Your Invitation",
  "exploreEvents": "Explore Events",

  // Events section
  "featured": "Featured",
  "eventsHeading": "Events",
  "browseCollection": "Browse our collection of elegant events and create invitations for any occasion",
  "preview": "Preview",
  "createInvitation": "Create Invitation",
  "viewAllEvents": "View All Events",
  
  // How It Works section
  "how": "How",
  "works": "Works",
  "creatingSharing": "Creating and sharing beautiful invitations has never been easier",
  "createFirstInvitation": "Create Your First Invitation",
  
  // How It Works steps
  "step1Title": "Create an Event",
  "step1Description": "Add title, image and description for your upcoming event.",
  "step2Title": "Add Invitation Template",
  "step2Description": "Add all needed fields for your event invitation.",
  "step3Title": "Add Participant's Info",
  "step3Description": "Import or manually add information about your guests.",
  "step4Title": "Send Invitations",
  "step4Description": "Send invitations to participants via email, messaging apps, or generate a shareable link.",
  "step5Title": "Track Responses",
  "step5Description": "Check invitations and responses on event using our app.",
  "step6Title": "Use Analytics",
  "step6Description": "Check how many participants confirmed and who they are using the participant's info.",
  
  // Testimonials section
  "whatOurUsers": "What Our Users",
  "say": "Say",
  "joinThousands": "Join thousands of satisfied users creating beautiful invitations",
  "joinOver": "Join over 10,000 users creating stunning invitations",
  "startCrafting": "Start crafting your perfect invitation today",
  
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
  "enter": "Enter",
  
  // Sign In
  "backToHome": "Back to Home",
  "signInHeading": "Sign In",
  "enterCredentials": "Enter your credentials to access your account",
  "password": "Password",
  "forgotPassword": "Forgot password?",
  "signingIn": "Signing in...",
  "orContinueWith": "Or continue with",
  "dontHaveAccount": "Don't have an account?",
  
  // Other common text
  "wedding": "Wedding",
  "birthday": "Birthday",
  "corporate": "Corporate",
  "party": "Party",
  "formal": "Formal",
  "all": "All"
};

// Russian translations
const ruTranslations: Record<string, string> = {
  // Navbar
  "events": "События",
  "howItWorks": "Как это работает",
  "testimonials": "Отзывы",
  "logIn": "Войти",
  "signUp": "Регистрация",
  
  // Hero section
  "simpleElegantEffective": "Просто. Элегантно. Эффективно.",
  "createBeautifulInvitations": "Создавайте красивые приглашения, которые производят впечатление",
  "craftStunningDigital": "Создавайте потрясающие цифровые приглашения для любого случая с помощью нашей интуитивно понятной платформы. Разработано для простоты и элегантности.",
  "createYourInvitation": "Создать приглашение",
  "exploreEvents": "Изучить события",

  // Events section
  "featured": "Избранные",
  "eventsHeading": "События",
  "browseCollection": "Просмотрите нашу коллекцию элегантных событий и создавайте приглашения для любого случая",
  "preview": "Предпросмотр",
  "createInvitation": "Создать приглашение",
  "viewAllEvents": "Посмотреть все события",
  
  // How It Works section
  "how": "Как",
  "works": "это работает",
  "creatingSharing": "Создавать и делиться красивыми приглашениями никогда не было так просто",
  "createFirstInvitation": "Создать ваше первое приглашение",
  
  // How It Works steps
  "step1Title": "Создайте событие",
  "step1Description": "Добавьте заголовок, изображение и описание для вашего предстоящего мероприятия.",
  "step2Title": "Добавьте шаблон приглашения",
  "step2Description": "Добавьте все необходимые поля для вашего приглашения на мероприятие.",
  "step3Title": "Добавьте информацию об участниках",
  "step3Description": "Импортируйте или вручную добавьте информацию о ваших гостях.",
  "step4Title": "Отправьте приглашения",
  "step4Description": "Отправьте приглашения участникам по электронной почте, через мессенджеры или создайте ссылку для публикации.",
  "step5Title": "Отслеживайте ответы",
  "step5Description": "Проверяйте приглашения и ответы на событие с помощью нашего приложения.",
  "step6Title": "Используйте аналитику",
  "step6Description": "Проверьте, сколько участников подтвердили свое участие и кто они, используя информацию об участниках.",
  
  // Testimonials section
  "whatOurUsers": "Что говорят наши",
  "say": "пользователи",
  "joinThousands": "Присоединяйтесь к тысячам довольных пользователей, создающих красивые приглашения",
  "joinOver": "Присоединяйтесь к более чем 10 000 пользователей, создающих потрясающие приглашения",
  "startCrafting": "Начните создавать свое идеальное приглашение сегодня",
  
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
  "enter": "Введите",
  
  // Sign In
  "backToHome": "Назад на главную",
  "signInHeading": "Вход",
  "enterCredentials": "Введите свои учетные данные для доступа к аккаунту",
  "password": "Пароль",
  "forgotPassword": "Забыли пароль?",
  "signingIn": "Выполняется вход...",
  "orContinueWith": "Или продолжить с",
  "dontHaveAccount": "Нет аккаунта?",
  
  // Other common text
  "wedding": "Свадьба",
  "birthday": "День рождения",
  "corporate": "Корпоратив",
  "party": "Вечеринка",
  "formal": "Формальное",
  "all": "Все"
};
