
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
  
  // Sign Up
  "createAccount": "Create an Account",
  "alreadyHaveAccount": "Already have an account?",
  "passwordRequirements": "Password must be at least 8 characters",
  "confirmPassword": "Confirm Password",
  "termsAndConditions": "I agree to the Terms and Conditions",
  "privacyPolicy": "Privacy Policy",
  "createAccountButton": "Create Account",
  "creatingAccount": "Creating account...",
  
  // Password Reset
  "resetPassword": "Reset Password",
  "enterEmailForPasswordReset": "Enter your email address and we'll send you a link to reset your password.",
  "emailRequired": "Please enter your email address",
  "passwordResetEmailSent": "Password reset email sent",
  "checkInboxForInstructions": "Check your inbox for instructions to reset your password.",
  "failedToSendResetEmail": "Failed to send password reset email. Please try again.",
  "passwordResetEmailSentSuccess": "Password reset email sent successfully!",
  "sending": "Sending...",
  
  // Dashboard
  "welcome": "Welcome",
  "yourEvents": "Your Events",
  "createEvent": "Create Event",
  "recentActivity": "Recent Activity",
  "upcomingEvents": "Upcoming Events",
  "totalEvents": "Total Events",
  "totalInvitations": "Total Invitations",
  "responseRate": "Response Rate",
  "viewAll": "View All",
  "noEvents": "No events yet. Create your first event!",
  "manageEvents": "Manage your events and create new invitations",
  "open": "Open",
  "createNewEvent": "Create new event",
  
  // Account
  "accountSettings": "Account Settings",
  "profile": "Profile",
  "security": "Security",
  "notifications": "Notifications",
  "personalInfo": "Personal Information",
  "updateProfile": "Update Profile",
  "changePassword": "Change Password",
  "currentPassword": "Current Password",
  "newPassword": "New Password",
  "saveChanges": "Save Changes",
  "notificationSettings": "Notification Settings",
  "emailNotifications": "Email notifications",
  "accountUpdated": "Account updated successfully",
  "passwordChanged": "Password changed successfully",
  "settingsSaved": "Settings saved successfully",
  
  // Event related
  "eventDetails": "Event Details",
  "eventName": "Event Name",
  "eventDate": "Event Date",
  "eventLocation": "Event Location",
  "eventDescription": "Event Description",
  "eventType": "Event Type",
  "participants": "Participants",
  "invitations": "Invitations",
  "responses": "Responses",
  "attending": "Attending",
  "notAttending": "Not Attending",
  "pending": "Pending",
  "sendInvitation": "Send Invitation",
  "editEvent": "Edit Event",
  "deleteEvent": "Delete Event",
  "confirmDelete": "Are you sure you want to delete this event?",
  "cancel": "Cancel",
  "save": "Save",
  "update": "Update",
  "eventUpdated": "Your event has been updated successfully!",
  "eventStatusUpdated": "Event Status Updated",
  "markedAsUpcoming": "Event has been marked as upcoming",
  "markedAsInProgress": "Event has been marked as in progress",
  "markedAsFinished": "Event has been marked as finished",
  
  // Event Status Button
  "start": "Start",
  "finish": "Finish",
  "finished": "Finished",
  "upcoming": "Upcoming",
  "inProgress": "In Progress",
  "confirmEventStatusChange": "Confirm Event Status Change",
  "areYouSureStatus": "Are you sure you want to",
  "thisEvent": "this event?",
  "actionCannotBeUndone": "This action cannot be undone.",
  "confirm": "Confirm",
  
  // User Avatar
  "userMenu": "User menu",
  "signOut": "Sign Out",
  "loggedOutSuccessfully": "Logged out successfully",
  "youHaveBeenSignedOut": "You have been signed out",
  
  // Invitation templates
  "templateApplied": "Template Applied",
  "theTemplate": "The template",
  "hasBeenApplied": "has been applied",
  "loadTemplate": "Load Template",
  "selectTemplate": "Select Template", 
  "chooseTemplate": "Choose from available templates",
  "fieldsIncluding": "fields including",
  "noTemplatesAvailable": "No templates available",
  
  // Event Form Dialog
  "createNewEvent": "Create New Event",
  "eventTitle": "Event Title",
  "enterEventTitle": "Enter event title...",
  "continue": "Continue",
  "titleRequired": "Title required",
  "pleaseEnterTitle": "Please enter a title for your event",
  "error": "Error",
  "failedToCreateEvent": "Failed to create event",
  "networkError": "Network Error",
  "serverNotResponding": "Server not responding",
  
  // Participants
  "sendInvitations": "Send Invitations",
  "selectParticipants": "Select participants to send invitations to",
  "selectedParticipants": "Selected Participants",
  "sendToSelected": "Send to Selected",
  "invitationsSent": "Invitations Sent",
  "invitationsSentSuccess": "Invitations sent successfully to selected participants",
  "failedToSendInvitations": "Failed to send invitations",
  "noParticipantsSelected": "No participants selected",
  "pleaseSelectParticipants": "Please select at least one participant",
  
  // Footer
  "aboutUs": "About Us",
  "contact": "Contact",
  "support": "Support",
  "termsOfService": "Terms of Service",
  "copyright": "© 2023 Invite. All rights reserved.",
  
  // Other common text
  "wedding": "Wedding",
  "birthday": "Birthday",
  "corporate": "Corporate",
  "party": "Party",
  "formal": "Formal",
  "all": "All",
  "loading": "Loading...",
  "success": "Success",
  "warning": "Warning",
  "info": "Information",
  "logout": "Log Out",
  "dashboard": "Dashboard",
  "settings": "Settings",
  "search": "Search",
  
  // Additional registration translations
  "passwordsDoNotMatch": "Passwords do not match",
  "registrationSuccessful": "Registration Successful",
  "youCanNowSignIn": "You can now sign in to your account",
  "registrationFailed": "Registration failed",
  "somethingWentWrong": "Something went wrong",
  "enterYourEmailAndPassword": "Enter your email and password to create account",
  "signingUp": "Signing up...",
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
  "craftStunningDigital": "Создавайте потрясающие цифровые приглашения для любого события с нашей интуитивной платформой. Простой и элегантный дизайн для вашего удобства.",
  "createYourInvitation": "Создать приглашение",
  "exploreEvents": "Примеры мероприятий",

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
  
  // Sign Up
  "createAccount": "Создать аккаунт",
  "alreadyHaveAccount": "Уже есть аккаунт?",
  "passwordRequirements": "Пароль должен содержать не менее 8 символов",
  "confirmPassword": "Подтвердите пароль",
  "termsAndConditions": "Я согласен с Условиями использования",
  "privacyPolicy": "Политика конфиденциальности",
  "createAccountButton": "Создать аккаунт",
  "creatingAccount": "Создание аккаунта...",
  
  // Password Reset
  "resetPassword": "Сбросить пароль",
  "enterEmailForPasswordReset": "Введите ваш email, и мы отправим вам ссылку для сброса пароля.",
  "emailRequired": "Пожалуйста, введите ваш email",
  "passwordResetEmailSent": "Письмо для сброса пароля отправлено",
  "checkInboxForInstructions": "Проверьте вашу почту для получения инструкций по сбросу пароля.",
  "failedToSendResetEmail": "Не удалось отправить письмо для сброса пароль. Пожалуйста, попробуйте снова.",
  "passwordResetEmailSentSuccess": "Письмо для сброса пароля успешно отправлено!",
  "sending": "Отправка...",
  
  // Dashboard
  "welcome": "Добро пожаловать",
  "yourEvents": "Ваши события",
  "createEvent": "Создать событие",
  "recentActivity": "Недавняя активность",
  "upcomingEvents": "Предстоящие события",
  "totalEvents": "Всего событий",
  "totalInvitations": "Всего приглашений",
  "responseRate": "Частота ответов",
  "viewAll": "Посмотреть все",
  "noEvents": "Пока нет событий. Создайте свое первое событие!",
  "manageEvents": "Управляйте своими событиями и создавайте новые приглашения",
  "open": "Открыть",
  "createNewEvent": "Создать новое событие",
  
  // Account
  "accountSettings": "Настройки аккаунта",
  "profile": "Профиль",
  "security": "Безопасность",
  "notifications": "Уведомления",
  "personalInfo": "Личная информация",
  "updateProfile": "Обновить профиль",
  "changePassword": "Изменить пароль",
  "currentPassword": "Текущий пароль",
  "newPassword": "Новый пароль",
  "saveChanges": "Сохранить изменения",
  "notificationSettings": "Настройки уведомлений",
  "emailNotifications": "Уведомления по электронной почте",
  "accountUpdated": "Аккаунт успешно обновлен",
  "passwordChanged": "Пароль успешно изменен",
  "settingsSaved": "Настройки успешно сохранены",
  
  // Event related
  "eventDetails": "Детали события",
  "eventName": "Название события",
  "eventDate": "Дата события",
  "eventLocation": "Место события",
  "eventDescription": "Описание события",
  "eventType": "Тип события",
  "participants": "Участники",
  "invitations": "Приглашения",
  "responses": "Ответы",
  "attending": "Посетят",
  "notAttending": "Не посетят",
  "pending": "Ожидается",
  "sendInvitation": "Отправить приглашение",
  "editEvent": "Редактировать",
  "deleteEvent": "Удалить событие",
  "confirmDelete": "Вы уверены, что хотите удалить это событие?",
  "cancel": "Отмена",
  "save": "Сохранить",
  "update": "Обновить",
  "eventUpdated": "Ваше событие было успешно обновлено!",
  "eventStatusUpdated": "Статус события обновлен",
  "markedAsUpcoming": "Событие отмечено как предстоящее",
  "markedAsInProgress": "Событие отмечено как в процессе",
  "markedAsFinished": "Событие отмечено как завершенное",
  
  // Event Status Button
  "start": "Начать",
  "finish": "Завершить",
  "finished": "Завершено",
  "upcoming": "Предстоящее",
  "inProgress": "В процессе",
  "confirmEventStatusChange": "Подтвердите изменение статуса события",
  "areYouSureStatus": "Вы уверены, что хотите",
  "thisEvent": "это событие?",
  "actionCannotBeUndone": "Это действие нельзя отменить.",
  "confirm": "Подтвердить",
  
  // User Avatar
  "userMenu": "Меню пользователя",
  "signOut": "Выйти",
  "loggedOutSuccessfully": "Выход выполнен успешно",
  "youHaveBeenSignedOut": "Вы вышли из системы",
  
  // Invitation templates
  "templateApplied": "Шаблон применен",
  "theTemplate": "Шаблон",
  "hasBeenApplied": "был применен",
  "loadTemplate": "Загрузить шаблон",
  "selectTemplate": "Выбрать шаблон",
  "chooseTemplate": "Выберите из доступных шаблонов",
  "fieldsIncluding": "полей, включая",
  "noTemplatesAvailable": "Нет доступных шаблонов",
  
  // Event Form Dialog
  "createNewEvent": "Создать новое событие",
  "eventTitle": "Название события",
  "enterEventTitle": "Введите название события...",
  "continue": "Продолжить",
  "titleRequired": "Необходимо название",
  "pleaseEnterTitle": "Пожалуйста, введите название для вашего события",
  "error": "Ошибка",
  "failedToCreateEvent": "Не удалось создать событие",
  "networkError": "Ошибка сети",
  "serverNotResponding": "Сервер не отвечает",
  
  // Participants
  "sendInvitations": "Отправить приглашения",
  "selectParticipants": "Выберите участников для отправки приглашений",
  "selectedParticipants": "Выбранные участники",
  "sendToSelected": "Отправить выбранным",
  "invitationsSent": "Приглашения отправлены",
  "invitationsSentSuccess": "Приглашения успешно отправлены выбранным участникам",
  "failedToSendInvitations": "Не удалось отправить приглашения",
  "noParticipantsSelected": "Участники не выбраны",
  "pleaseSelectParticipants": "Пожалуйста, выберите хотя бы одного участника",
  
  // Footer
  "aboutUs": "О нас",
  "contact": "Контакты",
  "support": "Поддержка",
  "termsOfService": "Условия использования",
  "copyright": "© 2023 Invite. Все права защищены.",
  
  // Other common text
  "wedding": "Свадьба",
  "birthday": "День рождения",
  "corporate": "Корпоратив",
  "party": "Вечеринка",
  "formal": "Формальное",
  "all": "Все",
  "loading": "Загрузка...",
  "success": "Успех",
  "warning": "Предупреждение",
  "info": "Информация",
  "logout": "Выйти",
  "dashboard": "Панель управления",
  "settings": "Настройки",
  "search": "Поиск",
  
  // Additional registration translations
  "passwordsDoNotMatch": "Пароли не совпадают",
  "registrationSuccessful": "Регистрация успешна",
  "youCanNowSignIn": "Теперь вы можете войти в свой аккаунт",
  "registrationFailed": "Регистрация не удалась",
  "somethingWentWrong": "Что-то пошло не так",
  "enterYourEmailAndPassword": "Введите email и пароль для создания аккаунта",
  "signingUp": "Регистрация...",
};
