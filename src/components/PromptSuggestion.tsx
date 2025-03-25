
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, ArrowDownUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptSuggestionProps {
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: {
    title: string;
    description: string;
  }[];
}

const PromptSuggestion = ({
  originalPrompt,
  optimizedPrompt,
  improvements,
}: PromptSuggestionProps) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Vérifier si des corrections orthographiques ont été effectuées
  const hasSpellingCorrections = improvements.some(imp => imp.title === "Correction orthographique");
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="optimized" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="optimized">Prompt Optimisé</TabsTrigger>
          <TabsTrigger value="diff">Différences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimized" className="space-y-4 animate-fade-in">
          {hasSpellingCorrections && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 rounded-md text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>Des corrections orthographiques ont été appliquées au prompt.</p>
            </div>
          )}
          <div className="relative">
            <div className="bg-background border border-border rounded-md p-4 text-sm whitespace-pre-wrap">
              {optimizedPrompt}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="diff" className="space-y-4 animate-fade-in">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1"></span>
              Supprimé
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>
              Ajouté
            </div>
            {hasSpellingCorrections && (
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1"></span>
                Corrigé
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 border border-border rounded-md p-4 bg-background relative">
              <div className="absolute top-2 right-2 text-xs font-medium text-muted-foreground">
                Original
              </div>
              <p className="text-sm whitespace-pre-wrap mt-4">{originalPrompt}</p>
            </div>
            
            <div className="md:self-center">
              <ArrowDownUp className="rotate-90 md:rotate-0 h-5 w-5 text-muted-foreground mx-auto" />
            </div>
            
            <div className="flex-1 border border-border rounded-md p-4 bg-background relative">
              <div className="absolute top-2 right-2 text-xs font-medium text-primary">
                Optimisé
              </div>
              <p className="text-sm whitespace-pre-wrap mt-4">{optimizedPrompt}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Améliorations suggérées:</h4>
        <ul className="space-y-2">
          {improvements.map((improvement, index) => (
            <li 
              key={index}
              className={cn(
                "border border-border rounded-md p-3 text-sm bg-background/50",
                "transition-all hover:bg-background",
                improvement.title === "Correction orthographique" ? "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20" : ""
              )}
            >
              <h5 className="font-medium mb-1">{improvement.title}</h5>
              <p className="text-muted-foreground">{improvement.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PromptSuggestion;
