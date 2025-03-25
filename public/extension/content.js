
// Configuration par défaut
let settings = {
  correctionOrtho: true,
  reformulation: true
};

// Charger les paramètres depuis le stockage
chrome.storage.sync.get({
  correctionOrtho: true,
  reformulation: true
}, function(items) {
  settings = items;
});

// Fonction pour détecter les zones de saisie de texte des LLMs
function detectPromptInputs() {
  // ChatGPT
  const chatGptTextarea = document.querySelector('textarea[data-id="root"]');
  
  // Claude
  const claudeTextarea = document.querySelector('.claude-input textarea');
  
  // Mistral
  const mistralTextarea = document.querySelector('.chat-input textarea');
  
  // Ajouter des écouteurs d'événements aux zones de texte détectées
  if (chatGptTextarea) {
    setupInputListener(chatGptTextarea, 'chatgpt');
  }
  
  if (claudeTextarea) {
    setupInputListener(claudeTextarea, 'claude');
  }
  
  if (mistralTextarea) {
    setupInputListener(mistralTextarea, 'mistral');
  }
}

// Configurer l'écouteur d'événements pour les zones de saisie
function setupInputListener(inputElement, platform) {
  // Créer le bouton d'amélioration de prompt
  const enhanceButton = document.createElement('button');
  enhanceButton.className = 'promptitude-enhance-btn';
  enhanceButton.innerHTML = '<span>Améliorer</span>';
  enhanceButton.title = 'Améliorer ce prompt';
  
  // Insérer le bouton à côté de la zone de saisie
  inputElement.parentNode.insertBefore(enhanceButton, inputElement.nextSibling);
  
  // Ajouter un écouteur d'événement au bouton
  enhanceButton.addEventListener('click', function() {
    const promptText = inputElement.value;
    if (promptText.trim().length > 0) {
      enhancePrompt(promptText, inputElement);
    }
  });
}

// Fonction pour améliorer le prompt
async function enhancePrompt(promptText, inputElement) {
  try {
    // Ici, vous devriez appeler votre API d'amélioration de prompt
    // Pour l'exemple, nous simulons une réponse
    const enhancedPrompt = await simulatePromptEnhancement(promptText);
    
    // Mettre à jour la zone de saisie avec le prompt amélioré
    inputElement.value = enhancedPrompt;
    
    // Mettre à jour le compteur de prompts améliorés
    chrome.storage.sync.get({ promptsCount: 0 }, function(data) {
      chrome.storage.sync.set({
        promptsCount: data.promptsCount + 1
      });
    });
    
    // Déclencher l'événement input pour que le site détecte le changement
    const inputEvent = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(inputEvent);
    
  } catch (error) {
    console.error('Erreur lors de l\'amélioration du prompt:', error);
  }
}

// Fonction de simulation d'amélioration de prompt (à remplacer par un appel API réel)
function simulatePromptEnhancement(promptText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulation de correction orthographique
      let enhancedPrompt = promptText;
      
      if (settings.correctionOrtho) {
        enhancedPrompt = enhancedPrompt
          .replace(/peux tu/gi, 'peux-tu')
          .replace(/est ce que/gi, 'est-ce que')
          .replace(/comment faire pour/gi, 'comment puis-je');
      }
      
      // Simulation de reformulation
      if (settings.reformulation) {
        if (enhancedPrompt.toLowerCase().includes('peux-tu')) {
          enhancedPrompt = enhancedPrompt.replace(/peux-tu/i, 'Je souhaite que tu');
        }
        
        // Ajouter une structure si le prompt est court
        if (enhancedPrompt.length < 100) {
          enhancedPrompt += '\n\nMerci de fournir une réponse structurée avec des exemples concrets.';
        }
      }
      
      resolve(enhancedPrompt);
    }, 500);
  });
}

// Écouter les messages du popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateSettings') {
    // Mettre à jour les paramètres locaux
    if (request.hasOwnProperty('correctionOrtho')) {
      settings.correctionOrtho = request.correctionOrtho;
    }
    if (request.hasOwnProperty('reformulation')) {
      settings.reformulation = request.reformulation;
    }
  }
});

// Injecter le CSS
function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .promptitude-enhance-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
      z-index: 1000;
      opacity: 0.8;
      transition: all 0.2s;
    }
    
    .promptitude-enhance-btn:hover {
      opacity: 1;
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(style);
}

// Initialiser l'extension
function init() {
  injectStyles();
  detectPromptInputs();
  
  // Observer les changements du DOM pour les sites qui chargent dynamiquement les éléments
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        detectPromptInputs();
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Démarrer l'extension quand le DOM est complètement chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
