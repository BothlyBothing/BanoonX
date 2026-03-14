/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  UserSearch, 
  ShieldAlert, 
  Terminal, 
  Search, 
  Activity,
  Cpu,
  Lock,
  Menu,
  X
} from 'lucide-react';
import { AssistantView } from './components/AssistantView';
import { VKView } from './components/VKView';
import { CryptoView } from './components/CryptoView';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = 'assistant' | 'vk' | 'crypto';

export default function App() {
  const [activeView, setActiveView] = useState<View>('assistant');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'assistant', label: 'AI ASSISTANT', icon: MessageSquare, description: 'Banoon x Core Intelligence' },
    { id: 'vk', label: 'VK ANALYZER', icon: UserSearch, description: 'Social Intelligence Module' },
    { id: 'crypto', label: 'CRYPTO TOOLS', icon: Lock, description: 'Encryption/Decryption Engine' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E3E0] font-mono selection:bg-[#F27D26] selection:text-black">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#E4E3E0 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b border-[#1A1A1C] bg-[#0A0A0B]/80 backdrop-blur-md z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F27D26] flex items-center justify-center rounded-sm">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest text-[#F27D26]">BANOON X</span>
            <span className="text-[10px] opacity-50 uppercase tracking-tighter">Analytical Intelligence System v1.0.4</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] opacity-40 uppercase tracking-widest hidden md:flex">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>System Status: Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" />
            <span>Security: Level 4</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            <span>Node: 0x7F4A</span>
          </div>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/5 rounded-md transition-colors md:hidden"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex pt-14 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#0A0A0B] border-r border-[#1A1A1C] transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as View);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-start gap-4 p-3 rounded-sm transition-all group text-left",
                  activeView === item.id 
                    ? "bg-[#F27D26]/10 border-l-2 border-[#F27D26]" 
                    : "hover:bg-white/5 border-l-2 border-transparent"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 mt-0.5",
                  activeView === item.id ? "text-[#F27D26]" : "opacity-40 group-hover:opacity-100"
                )} />
                <div className="flex flex-col">
                  <span className={cn(
                    "text-xs font-bold tracking-wider",
                    activeView === item.id ? "text-[#F27D26]" : "opacity-60"
                  )}>{item.label}</span>
                  <span className="text-[9px] opacity-30 uppercase mt-0.5">{item.description}</span>
                </div>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#1A1A1C]">
            <div className="p-3 bg-white/5 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] opacity-40 uppercase tracking-widest">CPU Load</span>
                <span className="text-[9px] text-[#F27D26]">12%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#F27D26] w-[12%]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden bg-[#0D0D0E]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              {activeView === 'assistant' && <AssistantView />}
              {activeView === 'vk' && <VKView />}
              {activeView === 'crypto' && <CryptoView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

