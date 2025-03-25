
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Key, Eye, EyeOff, Info } from "lucide-react";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface ApiKeyFormProps {
  onSaved: () => void;
}

const ApiKeyForm = ({ onSaved }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Récupérer la clé de l'API du localStorage lors du montage du composant
    const savedApiKey = localStorage.getItem("mistral-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une clé API valide",
        variant: "destructive",
      });
      return;
    }
    
    // Stocker la clé dans localStorage (pour la démo - à remplacer par une solution plus sécurisée)
    localStorage.setItem("mistral-api-key", apiKey);
    
    toast({
      title: "Succès",
      description: "Clé API sauvegardée avec succès",
    });
    
    onSaved();
  };
  
  return (
    <div className="grid gap-6 py-4 animate-fade-in">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="api-key" className="flex items-center gap-2">
            Clé API Mistral
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80 text-sm" side="top">
                <p>
                  Votre clé API est stockée localement et n'est jamais partagée. Cette clé sera utilisée pour améliorer vos prompts via l'API Mistral.
                </p>
              </HoverCardContent>
            </HoverCard>
          </Label>
        </div>
        
        <div className="relative">
          <Input
            id="api-key"
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setShowApiKey(!showApiKey)}
          >
            {showApiKey ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      
      <Button onClick={handleSaveApiKey} className="w-full group">
        <Key className="mr-2 h-4 w-4 group-hover:animate-pulse-subtle" />
        Sauvegarder
      </Button>
    </div>
  );
};

export default ApiKeyForm;
