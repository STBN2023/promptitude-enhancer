
// Script d'arrière-plan pour l'extension

// Écouter l'installation de l'extension
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    // Initialiser les paramètres par défaut
    chrome.storage.sync.set({
      correctionOrtho: true,
      reformulation: true,
      promptsCount: 0
    });
    
    // Ouvrir la page d'accueil après l'installation
    chrome.tabs.create({
      url: 'https://promptitude-enhancer.lovable.app'
    });
  }
});

// Écouter les messages des scripts de contenu
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'incrementCount') {
    chrome.storage.sync.get({ promptsCount: 0 }, function(data) {
      chrome.storage.sync.set({
        promptsCount: data.promptsCount + 1
      });
    });
  }
});
