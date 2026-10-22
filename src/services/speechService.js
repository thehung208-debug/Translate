// Speech service using the browser Web Speech API for natural pronunciation

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isLoaded = false;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const load = () => {
      this.voices = this.synth.getVoices();
      this.isLoaded = true;
    };
    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Cancel any ongoing utterance
    this.synth.cancel();

    if (!text || !text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const lang = options.lang || 'en-US';
    utterance.lang = lang;
    utterance.rate = options.rate || 0.92; // Slightly natural speed for learners
    utterance.pitch = options.pitch || 1.0;

    // Pick a natural voice if available
    if (this.voices.length > 0) {
      const preferredVoice = this.voices.find(
        v => v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri') || v.name.includes('Samantha'))
      ) || this.voices.find(v => v.lang.startsWith(lang.split('-')[0]));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
