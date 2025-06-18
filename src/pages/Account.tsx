
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, ShieldAlert, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface UserData {
  id: number;
  name: string;
  email: string;
  canBeStaff: boolean;
  isEmailConfirmed: boolean;
}

const Account = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [allowAssignments, setAllowAssignments] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/sign-in");
          return;
        }

        const response = await fetch("http://158.160.171.159:7291/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data: UserData = await response.json();
          setUserData(data);
          setAllowAssignments(data.canBeStaff);
          
          // Update form with real data
          personalInfoForm.reset({
            name: data.name,
            email: data.email,
          });
        } else {
          console.error("Failed to fetch user data:", response.status);
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/sign-in");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: t("error"),
          description: t("failedToCreateEvent"),
          variant: "destructive",
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [navigate, personalInfoForm, toast, t]);

  const handlePersonalInfoSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://158.160.171.159:7291/api/auth/change-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: values.name
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update name");
      }
      
      // Update local state
      if (userData) {
        setUserData({ ...userData, name: values.name });
      }
      
      toast({
        title: t("profileUpdated"),
        description: t("personalInfoUpdated"),
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failedToUpdateEvent"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://158.160.171.159:7291/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to change password");
      }
      
      toast({
        title: t("passwordUpdated"),
        description: t("passwordChangedSuccessfully"),
      });

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failedToUpdateEvent"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentPreferenceChange = async (value: boolean) => {
    if (!userData) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://158.160.171.159:7291/api/staff/toggle-can-be-staff/${userData.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update preferences");
      }
      
      setAllowAssignments(value);
      setUserData({ ...userData, canBeStaff: value });
      
      toast({
        title: t("preferencesUpdated"),
        description: value 
          ? t("othersCanNowAssign")
          : t("othersCanNoLonger"),
      });
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failedToUpdateEvent"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingUser) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">{t("error")}</h1>
          <p className="text-muted-foreground mt-2">{t("tryAgain")}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("accountSettings")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("manageYourAccount")}
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="personal">{t("personalInfo")}</TabsTrigger>
          <TabsTrigger value="password">{t("password")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("preferences")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>{t("personalInformation")}</CardTitle>
              <CardDescription>
                {t("updateYourPersonal")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...personalInfoForm}>
                <form onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
                  <FormField
                    control={personalInfoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fullName")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder={t("fullName")} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={personalInfoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("emailAddress")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            className="bg-muted/50"
                          />
                        </FormControl>
                        <FormDescription>
                          {t("emailCannotBeChanged")}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="mt-4" 
                    disabled={isLoading || !personalInfoForm.formState.isDirty}
                  >
                    {isLoading ? t("saving") : t("saveChanges")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{t("changePassword")}</CardTitle>
              <CardDescription>
                {t("updatePassword")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currentPassword")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              className="pl-10" 
                              type="password" 
                              placeholder={t("currentPassword")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("newPassword")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              className="pl-10" 
                              type="password" 
                              placeholder={t("newPassword")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("confirmPassword")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              className="pl-10" 
                              type="password" 
                              placeholder={t("confirmPassword")}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="mt-4" 
                    disabled={isLoading || !passwordForm.formState.isDirty}
                  >
                    {isLoading ? t("updating") : t("update")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t("assignmentPreferences")}</CardTitle>
              <CardDescription>
                {t("controlHowOthers")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  <ShieldAlert className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{t("allowOthersToAssign")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("whenEnabledOthers")}
                      </p>
                    </div>
                    <Switch 
                      checked={allowAssignments} 
                      onCheckedChange={handleAssignmentPreferenceChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Account;
