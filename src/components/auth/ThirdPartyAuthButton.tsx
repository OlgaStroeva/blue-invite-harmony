
import { Button } from "@/components/ui/button";

interface ThirdPartyAuthButtonProps {
  provider: "Google" | "Yandex";
  onClick: () => void;
  disabled?: boolean;
}

export const ThirdPartyAuthButton = ({ 
  provider, 
  onClick, 
  disabled 
}: ThirdPartyAuthButtonProps) => {
  return (
    <Button
      variant="outline"
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="w-full"
    >
      <ProviderIcon provider={provider} className="mr-2 h-4 w-4" />
      {provider}
    </Button>
  );
};

interface ProviderIconProps {
  provider: "Google" | "Yandex";
  className?: string;
}

const ProviderIcon = ({ provider, className }: ProviderIconProps) => {
  if (provider === "Google") {
    return (
      <svg 
        viewBox="0 0 24 24" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    );
  }
  
  if (provider === "Yandex") {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className}
        fill="#FF0000"
      >
        <path d="M2.04,12c0-5.523,4.476-10,10-10c5.524,0,10,4.477,10,10s-4.476,10-10,10c-5.524,0-10-4.477-10-10z M13.32,17.76v-11.52l-1.48,0l-3.12,7.28v4.24h1.36v-3.8l0.8-1.68h2.44z M11.64,7.44v4.6h-1.56l1.56-4.6z" />
      </svg>
    );
  }
  
  return null;
};
