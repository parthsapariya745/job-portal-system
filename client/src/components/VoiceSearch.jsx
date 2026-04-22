import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const VoiceSearch = ({ onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const { language } = useLanguage();

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      className={`p-4 rounded-full shadow-lg transition-all ${
        isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
      } text-white`}
      title="Voice Search"
    >
      <span className="text-2xl">{isListening ? '🛑' : '🎤'}</span>
    </button>
  );
};

export default VoiceSearch;
