
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
      optimizedPrompt: reformulatePrompt(prompt),
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

// Fonction de reformulation complète du prompt
function reformulatePrompt(originalPrompt: string): string {
  // Si le prompt est très court, on ajoute plus de contexte
  if (originalPrompt.trim().length < 20) {
    return `Je souhaite obtenir ${originalPrompt.trim()}. Pourrais-tu me fournir une explication détaillée avec des exemples concrets? Merci de structurer ta réponse en sections distinctes pour faciliter la compréhension.`;
  }
  
  // Construction d'un prompt entièrement reformulé
  const clearIntent = extractIntent(originalPrompt);
  
  // Format général pour un prompt optimal
  let reformulatedPrompt = `Je souhaite obtenir des informations détaillées concernant ${clearIntent}.\n\n`;
  
  // Ajout de contexte
  reformulatedPrompt += "Voici ce que j'aimerais spécifiquement :\n";
  reformulatedPrompt += `- Une explication claire et précise de ${clearIntent}\n`;
  
  // Si on détecte une demande de création, on ajoute des éléments spécifiques
  if (originalPrompt.match(/cré[ée]r|faire|développer|construire|implémenter/i)) {
    reformulatedPrompt += "- Des étapes structurées pour la réalisation\n";
    reformulatedPrompt += "- Des exemples de code ou de mise en œuvre si pertinent\n";
  }
  
  // Si on détecte une demande d'explication
  if (originalPrompt.match(/expliqu[ée]|comment|pourquoi|différence/i)) {
    reformulatedPrompt += "- Une analyse des concepts principaux\n";
    reformulatedPrompt += "- Des exemples illustratifs pour clarifier\n";
  }
  
  // Ajout de la demande de format pour tous les prompts
  reformulatedPrompt += "\nMerci de structurer ta réponse de manière claire et concise, avec des sections bien délimitées pour faciliter la lecture et la compréhension.";
  
  return reformulatedPrompt;
}

// Extraire l'intention principale du prompt
function extractIntent(prompt: string): string {
  // Retirer les mots courants de demande pour isoler le sujet
  const cleanedPrompt = prompt
    .replace(/je (veux|souhaite|voudrais|désire|aimerais)/gi, '')
    .replace(/pourrais-tu|peux-tu|donne-moi|explique-moi|liste-moi|montre-moi/gi, '')
    .replace(/créer|faire|développer|construire|implémenter/gi, '')
    .trim();
  
  return cleanedPrompt;
}

function generateImprovements(originalPrompt: string): { title: string; description: string }[] {
  const possibleImprovements = [
    {
      title: "Reformulation complète",
      description: "Restructuration intégrale du prompt pour maximiser la clarté et la précision."
    },
    {
      title: "Ajout de structure",
      description: "Organisation de la demande en sections logiques pour une réponse mieux structurée."
    },
    {
      title: "Précision de l'intention",
      description: "Clarification de l'objectif principal pour éviter toute ambiguïté."
    },
    {
      title: "Format de réponse spécifié",
      description: "Indication explicite du format souhaité pour obtenir une réponse bien organisée."
    },
    {
      title: "Enrichissement contextuel",
      description: "Ajout d'éléments de contexte pour une meilleure compréhension de la demande."
    },
    {
      title: "Formulation courtoise",
      description: "Utilisation d'un ton plus courtois qui tend à améliorer la qualité des réponses."
    }
  ];
  
  // Sélection d'améliorations pertinentes selon le prompt
  let selectedImprovements = [];
  
  // Toujours inclure la reformulation complète
  selectedImprovements.push(possibleImprovements[0]);
  
  // Si le prompt est court ou imprécis
  if (originalPrompt.length < 50) {
    selectedImprovements.push(possibleImprovements[2]); // Précision de l'intention
    selectedImprovements.push(possibleImprovements[4]); // Enrichissement contextuel
  }
  
  // Si le prompt ne mentionne pas de structure
  if (!originalPrompt.match(/structur|organis|section|format/i)) {
    selectedImprovements.push(possibleImprovements[1]); // Ajout de structure
    selectedImprovements.push(possibleImprovements[3]); // Format de réponse spécifié
  }
  
  // Limiter à 4 améliorations maximum
  return selectedImprovements.slice(0, 4);
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
