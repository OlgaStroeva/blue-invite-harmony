
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmployeeSearchInputProps {
  onSearch: (email: string) => void;
  isLoading?: boolean;
}

const EmployeeSearchInput = ({ onSearch, isLoading = false }: EmployeeSearchInputProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSearch(email.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by email..."
          className="pl-9 border-blue-200 focus-visible:ring-blue-400 bg-blue-50"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
      </div>
      <Button 
        type="submit" 
        disabled={!email.trim() || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
};

export default EmployeeSearchInput;
