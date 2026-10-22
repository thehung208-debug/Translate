// Storage service for managing API key, history, and saved vocabulary

const KEYS = {
  API_KEY: 'lingo_gemini_api_key',
  MODEL: 'lingo_gemini_model',
  HISTORY: 'lingo_search_history',
  VOCABULARY: 'lingo_vocabulary_notebook',
  SETTINGS: 'lingo_settings',
};

export const storageService = {
  // API Key
  getApiKey() {
    if (typeof localStorage === 'undefined') return '';
    const local = localStorage.getItem(KEYS.API_KEY);
    if (local && local.trim()) return local.trim();
    return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
  },

  setApiKey(key) {
    if (typeof localStorage === 'undefined') return;
    if (key) {
      localStorage.setItem(KEYS.API_KEY, key.trim());
    } else {
      localStorage.removeItem(KEYS.API_KEY);
    }
  },

  getModel() {
    if (typeof localStorage === 'undefined') return 'gemini-2.5-flash';
    return localStorage.getItem(KEYS.MODEL) || 'gemini-2.5-flash';
  },

  setModel(model) {
    localStorage.setItem(KEYS.MODEL, model);
  },

  // Search / Analysis History
  getHistory() {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistoryItem(item) {
    try {
      const history = this.getHistory();
      const newItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...item,
      };
      // Keep up to 60 most recent items
      const updated = [newItem, ...history.filter(h => h.input !== item.input)].slice(0, 60);
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
      return newItem;
    } catch (e) {
      console.error('Failed to save history', e);
      return null;
    }
  },

  clearHistory() {
    localStorage.removeItem(KEYS.HISTORY);
  },

  deleteHistoryItem(id) {
    try {
      const history = this.getHistory().filter(h => h.id !== id);
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to delete history item', e);
    }
  },

  // Vocabulary Notebook
  getVocabulary() {
    try {
      const data = localStorage.getItem(KEYS.VOCABULARY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveWord(wordData) {
    try {
      const vocab = this.getVocabulary();
      const wordKey = (wordData.word || '').trim().toLowerCase();
      if (!wordKey) return false;

      const exists = vocab.some(v => (v.word || '').trim().toLowerCase() === wordKey);
      if (exists) return false; // already saved

      const newItem = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        reviewedCount: 0,
        mastered: false,
        ...wordData,
      };
      localStorage.setItem(KEYS.VOCABULARY, JSON.stringify([newItem, ...vocab]));
      return true;
    } catch (e) {
      console.error('Failed to save word', e);
      return false;
    }
  },

  removeWord(idOrWord) {
    try {
      const vocab = this.getVocabulary().filter(
        v => v.id !== idOrWord && (v.word || '').toLowerCase() !== (idOrWord || '').toLowerCase()
      );
      localStorage.setItem(KEYS.VOCABULARY, JSON.stringify(vocab));
    } catch (e) {
      console.error('Failed to remove word', e);
    }
  },

  isWordSaved(word) {
    if (!word) return false;
    const vocab = this.getVocabulary();
    return vocab.some(v => (v.word || '').trim().toLowerCase() === word.trim().toLowerCase());
  },

  toggleWordMastered(id) {
    try {
      const vocab = this.getVocabulary().map(v => 
        v.id === id ? { ...v, mastered: !v.mastered } : v
      );
      localStorage.setItem(KEYS.VOCABULARY, JSON.stringify(vocab));
    } catch (e) {
      console.error('Failed to toggle word mastered', e);
    }
  },
};
