
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ApiKeyForm from "./ApiKeyForm";

const Header = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between glass-card mb-8">
      <div className="flex items-center space-x-2 animate-slide-down">
        <Zap className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-medium">Promptitude</h1>
        <div className="ml-2 bg-secondary px-2 py-0.5 rounded-full text-xs text-secondary-foreground">
          Alpha
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] glass-card">
          <DialogHeader>
            <DialogTitle>Configuration API</DialogTitle>
          </DialogHeader>
          <ApiKeyForm onSaved={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
