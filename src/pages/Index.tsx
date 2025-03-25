
import Header from "@/components/Header";
import PromptAnalyzer from "@/components/PromptAnalyzer";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApiKeyForm from "@/components/ApiKeyForm";
import { Key } from "lucide-react";

const Index = () => {
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasVisited = localStorage.getItem("promptitude-visited");
    
    if (!hasVisited) {
      localStorage.setItem("promptitude-visited", "true");
    } else {
      setIsFirstVisit(false);
    }
    
    // Vérifier si la clé API est déjà configurée
    const apiKey = localStorage.getItem("mistral-api-key");
    if (!apiKey && !hasVisited) {
      setShowKeyDialog(true);
    }
  }, []);
  
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <Header />
      
      <main className="space-y-8">
        <section className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-medium mb-3 animate-slide-down">Améliorez vos prompts en temps réel</h1>
          <p className="text-muted-foreground animate-slide-down" style={{ animationDelay: "100ms" }}>
            Promptitude analyse vos interactions avec les modèles de langage et suggère des améliorations pour obtenir de meilleurs résultats.
          </p>
        </section>
        
        <PromptAnalyzer />
        
        <footer className="text-center text-sm text-muted-foreground pt-12">
          <p>Promptitude - Optimiseur de prompts intelligent</p>
        </footer>
      </main>
      
      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:max-w-[425px] glass-card">
          <DialogHeader>
            <DialogTitle>Configuration initiale</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Pour commencer à utiliser Promptitude, veuillez configurer votre clé API Mistral.
            </p>
            
            <ApiKeyForm 
              onSaved={() => {
                setShowKeyDialog(false);
                setIsFirstVisit(false);
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
