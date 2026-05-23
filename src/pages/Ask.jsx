import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, AlertCircle, Eye, EyeOff, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VEXA_SYSTEM_PROMPT = `You are Vexa's AI guide — a warm, knowledgeable, and completely non-judgmental sex education assistant built into the Vexa app.

Your audience is teens aged 13–17 and young adults aged 18–25. You answer questions about bodies, puberty, sex, relationships, consent, sexual health, contraception, STIs, menstrual cycles, gender identity, sexual orientation, pleasure, and anything else within this educational context.

TONE RULES:
- Never shame, judge, or embarrass the user for any question
- Speak plainly — no unnecessary jargon without explanation
- Be warm and direct — like a knowledgeable older friend, not a textbook
- Never be preachy or moralize
- Always be inclusive of all genders, body types, and sexual orientations
- Treat every question as completely normal and valid

CONTENT RULES:
- Provide accurate, medically sound information
- For health concerns (pain, irregular cycles, infections), always recommend consulting a doctor — but answer the question first
- You can discuss porn, masturbation, pleasure, and all sexual topics in an educational context
- Never produce graphic sexual content or erotica — educational only
- For questions about relationships, always center consent and mutual respect
- If asked about crisis situations (abuse, assault, self-harm), provide immediate support resources and encourage professional help

SCOPE RULES:
- Only answer questions within the context of sex education, bodies, relationships, identity, health, and consent
- If asked something outside this scope (homework help, coding, news, etc.), respond warmly: "That's outside what I can help with — but if you ever have questions about your body, relationships, or health, I'm always here."
- Never break character or discuss being an AI unless directly asked

RESPONSE FORMAT:
- Keep responses concise — 3 to 5 sentences for most questions
- For complex topics, use short paragraphs not bullet points
- End responses that involve health symptoms with a gentle nudge to consult a doctor
- Never start a response with "I" — vary your openings`;

const SUGGESTED_QUESTIONS = [
  "Is it normal to have an irregular period?",
  "What's the difference between consent and pressure?",
  "Does porn show what real sex is like?"
];

const getApiKey = () => {
  const envKey = import.meta.env.VITE_GROQ_API_KEY
  if (envKey && envKey.trim() !== '') return envKey

  const storedKey = localStorage.getItem('vexa_groq_key')
  if (storedKey && storedKey.trim() !== '') return storedKey

  return null
}

export default function Ask() {
  const [apiKey, setApiKey] = useState(getApiKey());
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(null);
  
  // Key setup screen states
  const [setupKey, setSetupKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages list or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleActivate = () => {
    const trimmed = setupKey.trim();
    if (!trimmed.startsWith('gsk_')) {
      setValidationError("That doesn't look like a valid Groq key — it should start with gsk_");
      return;
    }
    setValidationError('');
    localStorage.setItem('vexa_groq_key', trimmed);
    setApiKey(trimmed);
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('vexa_groq_key');
    setApiKey(null);
    setSetupKey('');
    setShowSettings(false);
    setMessages([]);
    setConversationHistory([]);
  };

  const handleSend = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsgId = 'user-' + Date.now() + '-' + Math.random();

    const newUserMessage = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    const userMessage = trimmed;
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    let cappedHistory = updatedHistory;
    if (cappedHistory.length > 39) {
      cappedHistory = cappedHistory.slice(cappedHistory.length - 39);
      if (cappedHistory[0].role === 'assistant') {
        cappedHistory = cappedHistory.slice(1);
      }
    }

    try {
      if (!apiKey) {
        throw new Error('API_KEY_MISSING');
      }

      const url = 'https://api.groq.com/openai/v1/chat/completions';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 400,
          temperature: 0.7,
          messages: [
            { role: 'system', content: VEXA_SYSTEM_PROMPT },
            ...cappedHistory
          ]
        })
      });

      const responseText = await response.text()

      if (response.status === 429) throw new Error('rate_limit')
      if (response.status === 401) throw new Error('invalid_key')
      if (response.status === 400) throw new Error('bad_request')
      if (!response.ok) throw new Error('api_error')

      const data = JSON.parse(responseText)
      const aiText = data.choices[0].message.content || "I couldn't process that response.";

      const newAiMessage = {
        id: 'ai-' + Date.now() + '-' + Math.random(),
        role: 'ai',
        content: aiText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newAiMessage]);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiText }
      ]);
    } catch (err) {
      
      const getErrorMessage = (error) => {
        if (error.message === 'rate_limit') return "I need a moment to catch up — try again in a few seconds."
        if (error.message === 'invalid_key') return "Your API key doesn't seem to be working. Tap the settings icon to re-enter it."
        if (error.message === 'bad_request') return "Something went wrong with that message — try rephrasing it."
        if (error.message === 'API_KEY_MISSING') return "Vexa's Ask feature requires a Groq API key. Enter it in settings."
        return "Something went wrong on my end — try asking again in a moment."
      };

      const errorText = getErrorMessage(err);

      const newErrorMessage = {
        id: 'ai-error-' + Date.now() + '-' + Math.random(),
        role: 'ai',
        content: errorText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion, index) => {
    if (isLoading) return;
    setSelectedSuggestionIndex(index);
    setTimeout(() => {
      setSelectedSuggestionIndex(null);
      handleSend(suggestion);
    }, 200);
  };

  // State 2: No key present (setup screen)
  if (!apiKey) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-[#120A33] text-white px-6 select-none py-10 relative overflow-y-auto no-scrollbar">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes v-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .v-logo-float {
            animation: v-float 4s infinite ease-in-out;
          }
        `}} />
        
        <div className="flex flex-col items-center max-w-[320px] w-full text-center space-y-6">
          {/* Vexa logo small at top */}
          <div className="w-14 h-14 bg-purple-mid/50 border border-dim rounded-2xl flex items-center justify-center v-logo-float shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            <MessageCircle size={28} className="text-coral fill-coral/10" />
          </div>

          {/* Heading */}
          <h2 className="font-fredoka text-[22px] font-bold text-white tracking-wide">
            Set up AI Assistant
          </h2>

          {/* Body Text */}
          <p className="font-nunito text-[13.5px] text-muted leading-relaxed">
            Vexa's Ask feature uses Groq. Enter your free API key to activate it — it stays on your device only and is never shared.
          </p>

          {/* Free Key Link */}
          <a 
            href="https://console.groq.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-nunito text-[13.5px] text-coral hover:underline font-bold tracking-wide"
          >
            Get a free key at console.groq.com
          </a>

          {/* Input field with toggle inside */}
          <div className="w-full relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={setupKey}
              onChange={(e) => {
                setSetupKey(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Paste your Groq API key here"
              className="w-full h-[52px] pl-5 pr-12 bg-purple-light border border-dim rounded-2xl font-nunito text-[14px] text-white placeholder-muted focus:outline-none focus:border-coral/50 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Inline error if any */}
          {validationError && (
            <p className="font-nunito text-[12.5px] text-coral font-bold animate-pulse">
              {validationError}
            </p>
          )}

          {/* Action Button */}
          <button
            onClick={handleActivate}
            disabled={!setupKey.trim()}
            className="w-full h-[50px] bg-coral hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:bg-purple-light/50 border border-dim rounded-full flex items-center justify-center font-fredoka uppercase tracking-wider text-[12px] text-white transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none shadow-[0_6px_20px_rgba(255,107,71,0.15)]"
          >
            Activate Ask Vexa
          </button>

          {/* Muted footer text */}
          <p className="font-nunito text-[11.5px] text-muted opacity-70">
            Your key is saved locally on this device only.
          </p>
        </div>
      </div>
    );
  }

  // State 3: Key present (chat interface)
  return (
    <div className="flex flex-col h-full w-full bg-purple text-white relative min-h-0 select-none">
      {/* Self-contained styling for animated pulsing loading dots */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes v-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .v-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 3px;
          background-color: var(--white);
          border-radius: 50%;
          animation: v-pulse 1.2s infinite ease-in-out;
        }
        .v-dot:nth-child(1) { animation-delay: 0s; }
        .v-dot:nth-child(2) { animation-delay: 0.2s; }
        .v-dot:nth-child(3) { animation-delay: 0.4s; }
      `}} />

      {/* Header section (fixed top) */}
      <div className="h-[56px] flex items-center justify-between px-6 bg-purple-mid border-b border-dim shrink-0 z-10">
        <div className="flex flex-col">
          <h1 className="font-fredoka text-[19px] font-bold text-white tracking-wide">Ask Vexa</h1>
          <span className="font-nunito text-[10px] text-muted tracking-tight">No judgment. Ever.</span>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-purple-light text-muted hover:text-white transition-colors"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Message Area (scrollable) */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 no-scrollbar min-h-0"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[80%] text-center px-4 py-8">
            <div className="w-[90px] h-[90px] bg-purple-mid/50 border border-dim rounded-2xl flex items-center justify-center mb-5 shadow-lg">
              <MessageCircle size={40} className="text-coral fill-coral/10 animate-pulse" />
            </div>
            
            <h2 className="font-fredoka text-[21px] font-bold text-white mb-2 tracking-wide">Ask me anything.</h2>
            <p className="font-nunito text-[13.5px] text-muted max-w-[270px] leading-relaxed mb-7">
              Bodies, relationships, health, identity — nothing is off limits.
            </p>

            {/* Suggested Questions Grid */}
            <div className="flex flex-col gap-2.5 w-full max-w-[310px]">
              {SUGGESTED_QUESTIONS.map((question, index) => {
                const isSelected = selectedSuggestionIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question, index)}
                    disabled={isLoading}
                    className={`w-full py-3.5 px-5 bg-purple-light text-left font-nunito text-[12.5px] font-semibold text-white/90 rounded-[18px] transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                      isSelected 
                        ? 'border border-coral shadow-[0_0_8px_var(--coral-glow)]' 
                        : 'border border-dim hover:border-muted'
                    }`}
                  >
                    {question}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Chat Stream */
          <div className="flex flex-col w-full min-h-0">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex flex-col w-full mb-3.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Tag */}
                  {!isUser && (
                    <span className="font-fredoka text-[10.5px] text-coral font-bold ml-3.5 mb-1.5 tracking-wide">
                      Vexa
                    </span>
                  )}
                  
                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-[13.5px] leading-relaxed select-text font-nunito whitespace-pre-wrap ${
                      isUser
                        ? 'bg-coral text-white rounded-[18px_18px_4px_18px] text-left'
                        : 'bg-purple-light text-white rounded-[18px_18px_18px_4px] text-left border border-dim/20 shadow-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {/* Pulse Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start w-full mb-3">
                <span className="font-fredoka text-[10.5px] text-coral font-bold ml-3.5 mb-1.5 tracking-wide animate-pulse">
                  Vexa is thinking
                </span>
                <div className="bg-purple-light border border-dim/20 rounded-[18px_18px_18px_4px] px-5 py-3.5 max-w-[85%] text-left">
                  <div className="flex items-center h-4">
                    <span className="v-dot"></span>
                    <span className="v-dot"></span>
                    <span className="v-dot"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area (fixed bottom) */}
      <div className="h-[64px] bg-purple-mid border-t border-dim flex items-center justify-between px-4 gap-3 shrink-0 z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(inputValue);
          }}
          disabled={isLoading}
          placeholder={isLoading ? "Vexa is answering..." : "Ask anything..."}
          className="flex-1 h-[40px] px-5 bg-purple-light border border-dim/50 rounded-full font-nunito text-[13.5px] text-white placeholder-muted focus:outline-none focus:border-coral/50 transition-all duration-200 disabled:opacity-50"
        />

        <button
          onClick={() => handleSend(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className="w-[40px] h-[40px] bg-coral hover:scale-105 active:scale-95 disabled:scale-100 disabled:bg-purple-light border border-dim rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 disabled:cursor-not-allowed select-none"
          aria-label="Send message"
        >
          <Send size={15} className={`text-white transition-opacity ${isLoading || !inputValue.trim() ? 'opacity-30' : 'opacity-100'}`} />
        </button>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 z-50 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-purple border border-dim rounded-3xl p-6 text-center shadow-2xl w-full max-w-[280px] space-y-4"
            >
              <h3 className="font-fredoka text-lg font-bold text-white">
                Settings
              </h3>
              <p className="font-nunito text-muted text-[13px] leading-relaxed">
                Manage your Vexa AI assistant settings.
              </p>
              
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleRemoveKey}
                  className="w-full h-[44px] rounded-full border border-error/30 bg-error/10 hover:bg-error/15 text-error font-fredoka uppercase tracking-wider text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Remove API Key
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full h-[44px] rounded-full border border-dim hover:bg-purple-light text-white font-fredoka uppercase tracking-wider text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
