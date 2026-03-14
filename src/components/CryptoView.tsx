import { useState } from 'react';
import { Lock, Unlock, RefreshCw, Copy, Check, Terminal } from 'lucide-react';
import { caesarCipher } from '../utils/crypto';
import { motion } from 'motion/react';

export function CryptoView() {
  const [text, setText] = useState('');
  const [shift, setShift] = useState(3);
  const [result, setResult] = useState('');
  const [isDecrypt, setIsDecrypt] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    const output = caesarCipher(text, shift, isDecrypt);
    setResult(output);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="w-12 h-12 bg-[#F27D26]/10 rounded-full flex items-center justify-center mb-2">
          <Lock className="text-[#F27D26]" size={24} />
        </div>
        <h2 className="text-xl font-bold tracking-widest uppercase">Encryption Engine</h2>
        <p className="text-[10px] opacity-40 uppercase tracking-[0.2em]">Banoon x Cryptographic Subsystem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-50">Input Payload</label>
            <div className="flex bg-[#1A1A1C] rounded-sm p-1 border border-[#2A2A2C]">
              <button 
                onClick={() => setIsDecrypt(false)}
                className={`px-3 py-1 text-[9px] font-bold rounded-sm transition-colors ${!isDecrypt ? 'bg-[#F27D26] text-black' : 'opacity-40 hover:opacity-100'}`}
              >
                ENCRYPT
              </button>
              <button 
                onClick={() => setIsDecrypt(true)}
                className={`px-3 py-1 text-[9px] font-bold rounded-sm transition-colors ${isDecrypt ? 'bg-[#F27D26] text-black' : 'opacity-40 hover:opacity-100'}`}
              >
                DECRYPT
              </button>
            </div>
          </div>
          
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ENTER TEXT TO PROCESS..."
            className="w-full h-48 bg-[#1A1A1C] border border-[#2A2A2C] rounded-sm p-4 text-sm font-mono focus:border-[#F27D26] outline-none transition-colors resize-none placeholder:opacity-20"
          />

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-[9px] opacity-40 uppercase block mb-1">Shift Parameter (Key)</label>
              <input 
                type="number" 
                value={shift}
                onChange={(e) => setShift(parseInt(e.target.value) || 0)}
                className="w-full bg-[#1A1A1C] border border-[#2A2A2C] rounded-sm px-3 py-2 text-xs focus:border-[#F27D26] outline-none transition-colors"
              />
            </div>
            <button 
              onClick={handleProcess}
              className="mt-5 bg-[#F27D26] text-black font-bold text-[10px] px-6 py-2 rounded-sm hover:bg-[#F27D26]/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              PROCESS
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold tracking-widest uppercase opacity-50">Processed Output</label>
            <button 
              onClick={handleCopy}
              disabled={!result}
              className="p-2 hover:bg-white/5 rounded-sm transition-colors disabled:opacity-20"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="w-full h-48 bg-[#0A0A0B] border border-[#2A2A2C] rounded-sm p-4 text-sm font-mono relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#F27D26] opacity-50" />
            <div className="prose prose-invert prose-sm break-all whitespace-pre-wrap">
              {result || <span className="opacity-10 italic">AWAITING PROCESSING...</span>}
            </div>
          </div>

          <div className="p-4 bg-[#1A1A1C] border border-[#2A2A2C] rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={14} className="text-[#F27D26]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Algorithm Status</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px]">
                <span className="opacity-40">Method:</span>
                <span className="text-[#F27D26]">Caesar Cipher</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span className="opacity-40">Complexity:</span>
                <span className="text-[#F27D26]">O(n)</span>
              </div>
              <div className="flex justify-between text-[9px]">
                <span className="opacity-40">Integrity:</span>
                <span className="text-green-500">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
