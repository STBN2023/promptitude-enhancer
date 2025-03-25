
interface AnalysisResult {
  optimizedPrompt: string;
  improvements: {
    title: string;
    description: string;
  }[];
  score: number;
}

export const analyzePrompt = async (
  prompt: string,
  apiKey: string
): Promise<AnalysisResult> => {
  try {
    // Note: Dans une extension Chrome réelle, cette logique serait dans le background script
    // Pour la démo, nous simulons l'analyse (pour éviter d'exposer une vraie clé API)
    
    // Simulation d'un appel API
    console.log("Analyzing prompt with API key:", apiKey.substring(0, 5) + "...");
    
    // Simulons un délai pour l'effet de chargement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Pour la démonstration, nous retournons un résultat simulé
    // Dans la version réelle, vous feriez un appel à l'API Mistral ici
    return {
      optimizedPrompt: improvePrompt(prompt),
      improvements: generateImprovements(prompt),
      score: calculateScore(prompt),
    };
    
    // Code pour un vrai appel API (à remplacer par l'implémentation réelle)
    /*
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: "system",
            content: "Vous êtes un assistant spécialisé dans l'optimisation de prompts. Analysez le prompt fourni et suggérez des améliorations pour le rendre plus efficace avec les LLM. Renvoyez le résultat au format JSON avec les champs: optimizedPrompt, improvements (array d'objets avec title et description), et score (0-10)."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    
    // Extraire les résultats du message de l'assistant
    const content = data.choices[0].message.content;
    return JSON.parse(content);
    */
  } catch (error) {
    console.error("Error analyzing prompt:", error);
    throw new Error("Failed to analyze prompt");
  }
};

// Fonctions de simulation pour la démo

function improvePrompt(originalPrompt: string): string {
  // Simulation d'amélioration de prompt
  const improvements = [
    { from: "fais", to: "pourrais-tu générer" },
    { from: "donne-moi", to: "pourrais-tu me fournir" },
    { from: "je veux", to: "j'aimerais obtenir" },
    { from: "explique", to: "pourrais-tu expliquer en détail" },
    { from: "liste", to: "pourrais-tu me présenter une liste organisée de" },
  ];
  
  let improvedPrompt = originalPrompt;
  
  improvements.forEach(({ from, to }) => {
    const regex = new RegExp(`\\b${from}\\b`, "gi");
    if (regex.test(improvedPrompt)) {
      improvedPrompt = improvedPrompt.replace(regex, to);
    }
  });
  
  // Ajout d'une précision sur le format si non spécifié
  if (!improvedPrompt.includes("format") && Math.random() > 0.5) {
    improvedPrompt += "\n\nMerci de structurer ta réponse de manière claire et concise, avec des sections bien délimitées.";
  }
  
  return improvedPrompt;
}

function generateImprovements(originalPrompt: string): { title: string; description: string }[] {
  const possibleImprovements = [
    {
      title: "Formulation plus précise",
      description: "Utilisation d'un langage plus précis pour mieux communiquer l'intention."
    },
    {
      title: "Structure améliorée",
      description: "Ajout d'une structure claire pour organiser la demande en sections logiques."
    },
    {
      title: "Spécification du format",
      description: "Indication du format de réponse souhaité pour obtenir un résultat plus exploitable."
    },
    {
      title: "Politesse et clarté",
      description: "Formulation plus courtoise qui améliore généralement la qualité des réponses."
    },
    {
      title: "Contextualisation",
      description: "Ajout de contexte pour aider le modèle à mieux comprendre l'intention."
    },
    {
      title: "Réduction de l'ambiguïté",
      description: "Clarification des termes qui pourraient être interprétés de différentes façons."
    }
  ];
  
  // Sélection aléatoire de 2 à 4 améliorations
  const numberOfImprovements = Math.floor(Math.random() * 3) + 2;
  
  // Mélange et sélection des améliorations
  return [...possibleImprovements]
    .sort(() => Math.random() - 0.5)
    .slice(0, numberOfImprovements);
}

function calculateScore(prompt: string): number {
  // Simulation d'un score basé sur des heuristiques simples
  let score = 5; // Score de base
  
  // Longueur du prompt (trop court = moins efficace)
  if (prompt.length < 20) {
    score -= 2;
  } else if (prompt.length > 100) {
    score += 1;
  }
  
  // Présence de mots clés positifs
  const positiveKeywords = ["exemple", "détail", "structure", "précis", "format", "contexte"];
  positiveKeywords.forEach(keyword => {
    if (prompt.toLowerCase().includes(keyword)) {
      score += 0.5;
    }
  });
  
  // Limiter le score entre 1 et 10
  return Math.max(1, Math.min(10, Math.round(score)));
}
