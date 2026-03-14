import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Globe, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';
import { getGeminiResponse } from '../services/gemini';
import { motion } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

export function AssistantView() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'SYSTEM INITIALIZED. Banoon x Core Intelligence online. How can I assist your analytical requirements today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text,
        sources: response.sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'ERROR: FAILED TO PROCESS ANALYTICAL REQUEST. PLEASE VERIFY SYSTEM CONNECTIVITY.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0D0D0E]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-[#1A1A1C]" ref={scrollRef}>
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-white/10' : 'bg-[#F27D26]/20 text-[#F27D26]'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 rounded-sm border ${
                msg.role === 'user' 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-[#1A1A1C] border-[#2A2A2C]'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.sources.map((source: any, idx: number) => (
                    source.web && (
                      <a 
                        key={idx}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[9px] px-2 py-1 bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 rounded-full hover:bg-[#F27D26]/20 transition-colors"
                      >
                        <Globe size={10} />
                        <span className="truncate max-w-[150px]">{source.web.title || 'Source'}</span>
                        <ExternalLink size={10} />
                      </a>
                    )
                  ))}
                </div>
              )}
              
              <span className="text-[9px] opacity-30 mt-1 uppercase tracking-widest">
                {msg.role === 'user' ? 'User Input' : 'Analytical Output'} • {new Date().toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-sm bg-[#F27D26]/20 text-[#F27D26] flex items-center justify-center">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="p-4 rounded-sm bg-[#1A1A1C] border border-[#2A2A2C] text-[10px] opacity-50 italic tracking-widest">
              PROCESSING ANALYTICAL DATA...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#1A1A1C] bg-[#0A0A0B]">
        <div className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="ENTER ANALYTICAL QUERY OR COMMAND..."
            className="w-full bg-[#1A1A1C] border border-[#2A2A2C] rounded-sm py-3 px-4 pr-12 text-sm focus:outline-none focus:border-[#F27D26] transition-colors placeholder:opacity-20"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#F27D26] hover:bg-[#F27D26]/10 rounded-sm transition-colors disabled:opacity-20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
