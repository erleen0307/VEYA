import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, ArrowRight, ShieldCheck, HelpCircle, Heart, Moon, Zap } from 'lucide-react';
import { UserProfile, JournalLog, ChatMessage } from '../types';
import { VeyaStore } from '../lib/store';

interface ChatCompanionProps {
  profile: UserProfile;
  logs: JournalLog[];
}

const SUGGESTED_PROMPTS = [
  "Why am I feeling tired today?",
  "What is the focus of my current follicular phase?",
  "Recommend a daily ritual for late luteal cramps.",
  "How should I adjust my exercise routine this week?"
];

export default function ChatCompanion({ profile, logs }: ChatCompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "veya",
      text: `Hello ${profile.name || 'Sophia'}. I am VEYA, your supportive hormonal and menstrual wellness companion.\n\nI have reviewed your local tracking baseline. Please feel free to ask me questions regarding your current cycle day, energy transitions, symptoms, or sleep quality!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const state = VeyaStore.calculateCycleState(profile, logs);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const allMessagesForContext = [...messages, userMsg];
      const answer = await VeyaStore.sendChatMessage(
        allMessagesForContext,
        profile,
        logs,
        state.phase
      );

      const veyaMsg: ChatMessage = {
        id: `veya-${Date.now()}`,
        sender: 'veya',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, veyaMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] md:h-[600px]">
      
      {/* Main Chat Core Area (left card) */}
      <div className="lg:col-span-8 bg-white dark:bg-veya-card-dark rounded-3xl border border-veya-border-light shadow-veya-sm flex flex-col h-full overflow-hidden">
        
        {/* Chat top header */}
        <div className="px-6 py-4 bg-veya-bg-light/60 dark:bg-veya-bg-dark/40 border-b border-veya-border-light dark:border-veya-card-dark/60 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="h-2 w-2 rounded-full bg-veya-highlight animate-pulse" />
            <span className="font-heading font-bold text-sm text-veya-text-primary dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-veya-highlight" />
              VEYA Dialogue Companion
            </span>
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-veya-text-muted bg-white dark:bg-veya-bg-dark border border-veya-border-light dark:border-veya-card-dark px-2.5 py-0.5 rounded-full">
            Grounded in local history
          </span>
        </div>

        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => {
            const isVeya = m.sender === 'veya';
            return (
              <div
                key={m.id}
                className={`flex ${isVeya ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-150`}
              >
                <div className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm font-sans leading-relaxed ${
                  isVeya
                    ? 'bg-veya-bg-light/80 dark:bg-veya-bg-dark/40 text-veya-text-primary dark:text-slate-200 rounded-tl-sm border border-veya-border-light/40 dark:border-veya-card-dark/40'
                    : 'bg-veya-gradient text-white rounded-tr-sm shadow-md'
                }`}>
                  <div className="whitespace-pre-line">
                    {m.text}
                  </div>
                  <span className={`block text-[9px] mt-1.5 text-right ${isVeya ? 'text-veya-text-muted' : 'text-purple-200'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Thinking bubble */}
          {isThinking && (
            <div className="flex justify-start animate-pulse">
              <div className="max-w-[70%] rounded-3xl rounded-tl-sm p-4 bg-veya-bg-light/80 dark:bg-veya-bg-dark/40 border border-veya-border-light/40 text-xs text-veya-text-muted flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-veya-highlight animate-spin" />
                <span>VEYA is reflecting on your journals...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-veya-bg-light/40 dark:bg-veya-bg-dark/20 border-t border-veya-border-light dark:border-veya-card-dark/60 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage(inputMessage);
              }}
              placeholder="Ask VEYA about your cycle transitions, cramps, sleep..."
              className="w-full bg-white dark:bg-veya-bg-dark/40 border border-veya-border-light dark:border-veya-card-dark rounded-2xl pl-4 pr-12 py-3.5 text-xs sm:text-sm text-veya-text-primary dark:text-white placeholder-veya-text-muted focus:outline-none focus:border-veya-highlight focus:ring-1 focus:ring-veya-highlight shadow-sm"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              className="absolute right-2 top-2 p-2 rounded-xl bg-veya-gradient hover:bg-veya-gradient-hover text-white transition transform active:scale-95 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Suggested Queries & Active Context (right cards) */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto">
        
        {/* Suggested Queries */}
        <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm space-y-4">
          <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted font-bold">Suggested</span>
          <h4 className="font-heading font-bold text-base text-veya-text-primary dark:text-white">Suggested Prompts</h4>
          <p className="text-xs text-veya-text-secondary dark:text-veya-text-secondary-dark leading-relaxed">
            Click any prompt to instantly query VEYA about your tracking:
          </p>
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="w-full text-left p-3 rounded-xl border border-veya-border-light/40 dark:border-veya-card-dark/40 hover:border-veya-highlight/40 bg-veya-bg-light/30 dark:bg-veya-bg-dark/20 hover:bg-white dark:hover:bg-veya-bg-dark text-xs text-veya-text-secondary dark:text-[#D5C9EE] font-medium transition flex items-center justify-between group cursor-pointer"
              >
                <span className="flex-1 pr-2">{prompt}</span>
                <ArrowRight className="h-3 w-3 text-veya-text-muted group-hover:text-veya-highlight transition group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Safety & Non-clinical Clause */}
        <div className="bg-white dark:bg-veya-card-dark rounded-3xl p-6 border border-veya-border-light shadow-veya-sm space-y-3.5 mt-auto">
          <span className="block text-[10px] uppercase tracking-widest text-veya-text-muted font-bold">Sovereignty</span>
          <div className="flex items-center gap-2.5 text-veya-sage">
            <ShieldCheck className="h-5 w-5" />
            <h5 className="font-heading font-bold text-sm text-veya-text-primary dark:text-white">Safe Guidance</h5>
          </div>
          <p className="text-[10px] text-veya-text-muted leading-relaxed">
            Your chat dialogues are secured under on-device local sandbox policies. Conversations are parsed dynamically strictly to provide educational wellness guidance. No diagnostic claims are compiled.
          </p>
        </div>

      </div>

    </div>
  );
}
