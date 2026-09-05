// Free Native Web Speech API - Voice-to-Task creation
export type ParsedTaskVoice = {
  title: string;
  category: string;
  budget?: number;
  description: string;
};

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = "en-US";
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }

  public listen(
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError("Speech recognition is not supported in this browser.");
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || "Could not recognize speech");
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || "Could not start microphone");
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }

  // Parses natural language like "I need someone to clean my apartment tomorrow for 500 rupees"
  public parseVoiceInput(text: string): ParsedTaskVoice {
    const lower = text.toLowerCase();

    // 1. Detect Category
    let category = "Other";
    if (lower.includes("clean") || lower.includes("wash") || lower.includes("sweep") || lower.includes("mop")) {
      category = "Cleaning";
    } else if (lower.includes("tutor") || lower.includes("teach") || lower.includes("math") || lower.includes("study") || lower.includes("exam")) {
      category = "Tutoring";
    } else if (lower.includes("repair") || lower.includes("fix") || lower.includes("plumb") || lower.includes("electric") || lower.includes("leak")) {
      category = "Repair";
    } else if (lower.includes("deliver") || lower.includes("pick up") || lower.includes("drop") || lower.includes("courier")) {
      category = "Delivery";
    } else if (lower.includes("pet") || lower.includes("dog") || lower.includes("cat") || lower.includes("walk")) {
      category = "Pet Care";
    } else if (lower.includes("garden") || lower.includes("plant") || lower.includes("lawn") || lower.includes("grass")) {
      category = "Gardening";
    } else if (lower.includes("cook") || lower.includes("meal") || lower.includes("bake") || lower.includes("kitchen")) {
      category = "Cooking";
    } else if (lower.includes("move") || lower.includes("shift") || lower.includes("furniture") || lower.includes("heavy")) {
      category = "Moving";
    } else if (lower.includes("computer") || lower.includes("laptop") || lower.includes("wifi") || lower.includes("tech") || lower.includes("phone")) {
      category = "Tech";
    }

    // 2. Extract proposed budget (e.g. "for 500", "500 rupees", "budget 800", "$50")
    let budget: number | undefined;
    const priceMatch = text.match(/(?:for|inr|rs|₹|\$|budget)\s*[:]?\s*(\d+)/i) || text.match(/(\d+)\s*(?:rupees|bucks|dollars)/i);
    if (priceMatch && priceMatch[1]) {
      const num = parseInt(priceMatch[1], 10);
      if (!isNaN(num) && num > 0) budget = num;
    }

    // 3. Generate concise title
    let title = text.trim();
    if (title.length > 50) {
      title = title.substring(0, 47) + "...";
    }
    // Capitalize first letter
    title = title.charAt(0).toUpperCase() + title.slice(1);

    return {
      title,
      category,
      budget,
      description: `Voice dictated request: "${text}"`,
    };
  }

  // Text-to-speech feedback (optional)
  public speak(text: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const speechService = new SpeechService();
