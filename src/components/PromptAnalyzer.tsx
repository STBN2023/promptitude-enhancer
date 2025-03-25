
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { analyzePrompt } from "@/utils/mistralApi";
import AnimatedTransition from "./AnimatedTransition";
import PromptSuggestion from "./PromptSuggestion";

interface AnalysisResult {
  optimizedPrompt: string;
  improvements: {
    title: string;
    description: string;
  }[];
  score: number;
}

const PromptAnalyzer = () => {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  
  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un prompt à analyser",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier si la clé API est disponible
    const apiKey = localStorage.getItem("mistral-api-key");
    if (!apiKey) {
      toast({
        title: "Configuration requise",
        description: "Veuillez configurer votre clé API Mistral",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const analysisResult = await analyzePrompt(prompt, apiKey);
      setResult(analysisResult);
      
      // Vérifier si des corrections orthographiques ont été effectuées
      if (prompt !== analysisResult.optimizedPrompt && 
          analysisResult.improvements.some(imp => imp.title === "Correction orthographique")) {
        toast({
          title: "Correction orthographique",
          description: "Des fautes de français ont été corrigées dans le prompt optimisé.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'analyse du prompt",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleUseOptimized = () => {
    if (result) {
      // On utilise directement le prompt optimisé sans ajouter d'autres éléments
      setPrompt(result.optimizedPrompt);
      toast({
        title: "Prompt optimisé appliqué",
        description: "Le prompt optimisé a été copié dans le champ d'entrée",
      });
      // Réinitialiser les résultats après avoir appliqué le prompt optimisé
      setResult(null);
    }
  };
  
  return (
    <div className="space-y-6 glass-card p-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Analyseur de Prompt</h2>
        <p className="text-muted-foreground text-sm">
          Optimisez vos prompts pour une meilleure interaction avec les modèles de langage.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Entrez votre prompt ici..."
            className="min-h-[120px] resize-y"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !prompt.trim()}
              className="group"
            >
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              )}
              {isAnalyzing ? "Analyse en cours..." : "Analyser"}
            </Button>
          </div>
        </div>
        
        <AnimatedTransition show={!!result}>
          {result && (
            <div className="space-y-4 border border-border rounded-lg p-4 bg-secondary/50 backdrop-blur-xs animate-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Résultats de l'analyse</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-sm flex items-center text-muted-foreground">
                    Score: 
                    <span className="ml-1 font-medium text-foreground">
                      {result.score}/10
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleUseOptimized}
                    className="flex items-center"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    <span>Appliquer</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <PromptSuggestion 
                originalPrompt={prompt}
                optimizedPrompt={result.optimizedPrompt} 
                improvements={result.improvements}
              />
            </div>
          )}
        </AnimatedTransition>
      </div>
    </div>
  );
};

export default PromptAnalyzer;
