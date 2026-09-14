// Web Speech API Wrapper for Farmer Voice Assistance

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class VoiceAssistantSpeech {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  startListening(langBcp47: string, handlers: SpeechRecognitionHandlers) {
    if (!this.recognition) {
      handlers.onError?.('Speech recognition is not supported in this browser. Please use Chrome/Edge or type your question.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = langBcp47 || 'te-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
      handlers.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      handlers.onResult?.(final || interim, !!final);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      handlers.onError?.(event.error || 'Voice input error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      handlers.onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  // Text-To-Speech Output
  speakText(text: string, langBcp47: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported.');
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing utterance

    const cleanText = text.replace(/[*_#`[\]()]/g, '').slice(0, 300); // Clean markdown artifacts
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langBcp47 || 'te-IN';
    utterance.rate = 0.95; // Slightly slower pace for clarity to rural farmers
    utterance.pitch = 1.0;

    // Pick best available voice matching language if present
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(langBcp47.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechService = new VoiceAssistantSpeech();
