import React from "react";

export default function VoiceAgent({
  active,                 // boolean: start/stop from parent
  onInactive,             // () => void, called after stop
  onSearch,               // (q: string) => void
  onFilterCategory,       // (slugOrTitle: string) => void
  onOpenDeals,            // () => void
  onAddToCartByName,      // (name: string) => boolean
}) {
  const [speaking, setSpeaking] = React.useState(false);
  const recognitionRef = React.useRef(null);
  const transcriptRef = React.useRef("");

  const getRecognition = React.useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = "en-US";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
      }
      if (finalText) transcriptRef.current += " " + finalText;
    };
    r.onend = () => {
      // Auto-stop path
      onInactive?.();
    };
    recognitionRef.current = r;
    return r;
  }, [onInactive]);

  const say = React.useCallback((text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const parseCommand = React.useCallback((raw) => {
    const q = raw.trim().toLowerCase();
    if (!q) return;

    // Search
    const mSearch = q.match(/(?:search|find|look up)\s+(.*)/i);
    if (mSearch) {
      const term = mSearch[1];
      onSearch?.(term);
      return;
    }

    // Filter category
    const mCat = q.match(/(?:filter|category|show)\s+(?:by\s+)?(.+)/i);
    if (mCat) {
      const cat = mCat[1];
      onFilterCategory?.(cat);
      return;
    }

    // Deals
    if (/(open|show)\s+deals|^deals( section| page)?$/.test(q)) {
      onOpenDeals?.();
      return;
    }

    // Add to cart
    const mAdd = q.match(/(?:add|put)\s+(.*)\s+(?:to|into)\s+cart/i);
    if (mAdd) {
      const name = mAdd[1];
      onAddToCartByName?.(name);
      return;
    }
  }, [onSearch, onFilterCategory, onOpenDeals, onAddToCartByName]);

  // Start/stop driven by parent "active"
  React.useEffect(() => {
    const r = getRecognition();
    if (!r) return;

    if (active) {
      transcriptRef.current = "";
      (async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          onInactive?.();
          return;
        }
        try {
          r.start();
        } catch {
          // Already started; swallow
        }
      })();
    } else {
      try { r.stop(); } catch {}
      const finalCmd = transcriptRef.current.trim();
      if (finalCmd) {
        // Parse once when stopping to avoid partials
        parseCommand(finalCmd);
      }
      transcriptRef.current = "";
      if (speaking) window.speechSynthesis?.cancel();
    }
  }, [active, getRecognition, parseCommand, speaking, onInactive]);

  return null; // headless: no UI
}
