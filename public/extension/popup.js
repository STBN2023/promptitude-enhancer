
document.addEventListener('DOMContentLoaded', function() {
  // Récupérer les éléments du DOM
  const correctionOrthoToggle = document.getElementById('correction-ortho');
  const reformulationToggle = document.getElementById('correction-ortho');
  const promptsCountElement = document.getElementById('prompts-count');
  const clearDataButton = document.getElementById('clear-data');
  const settingsButton = document.getElementById('settings-btn');
  
  // Charger les options sauvegardées
  chrome.storage.sync.get({
    correctionOrtho: true,
    reformulation: true,
    promptsCount: 0
  }, function(items) {
    correctionOrthoToggle.checked = items.correctionOrtho;
    reformulationToggle.checked = items.reformulation;
    promptsCountElement.textContent = items.promptsCount;
  });
  
  // Gérer les changements d'options
  correctionOrthoToggle.addEventListener('change', function() {
    chrome.storage.sync.set({
      correctionOrtho: this.checked
    });
    
    // Informer le content script du changement
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSettings',
        correctionOrtho: correctionOrthoToggle.checked
      });
    });
  });
  
  reformulationToggle.addEventListener('change', function() {
    chrome.storage.sync.set({
      reformulation: this.checked
    });
    
    // Informer le content script du changement
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSettings',
        reformulation: reformulationToggle.checked
      });
    });
  });
  
  // Effacer les données
  clearDataButton.addEventListener('click', function() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données?')) {
      chrome.storage.sync.set({
        promptsCount: 0
      }, function() {
        promptsCountElement.textContent = '0';
      });
    }
  });
  
  // Ouvrir les paramètres
  settingsButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
});
