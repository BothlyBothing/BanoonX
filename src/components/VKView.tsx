import { useState } from 'react';
import { Search, User, FileText, Activity, Shield, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { getGeminiResponse } from '../services/gemini';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';

export function VKView() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [data, setData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!userId || !token) {
      setError('USER ID AND ACCESS TOKEN REQUIRED');
      return;
    }
    setError('');
    setIsLoading(true);
    setData(null);
    setAnalysis('');

    try {
      const response = await axios.get(`/api/vk/profile?userId=${userId}&accessToken=${token}`);
      setData(response.data);
      
      // Automatically trigger analysis
      analyzeData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'FAILED TO FETCH VK DATA');
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeData = async (vkData: any) => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze this VK profile data and provide a formal analytical report. 
      Profile: ${JSON.stringify(vkData.profile)}
      Wall Posts: ${JSON.stringify(vkData.wall)}`;
      
      const response = await getGeminiResponse(prompt, "You are Banoon x Social Intelligence Module. Analyze the provided social media data and generate a comprehensive psychological and behavioral profile report. Be formal and objective.");
      setAnalysis(response.text);
    } catch (err) {
      setAnalysis('ERROR: ANALYSIS MODULE FAILED.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 bg-[#1A1A1C] border border-[#2A2A2C] rounded-sm">
            <h3 className="text-[10px] font-bold tracking-[0.2em] text-[#F27D26] mb-4 uppercase">Target Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] opacity-40 uppercase block mb-1">Target ID / Domain</label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. durov"
                  className="w-full bg-[#0A0A0B] border border-[#2A2A2C] rounded-sm px-3 py-2 text-xs focus:border-[#F27D26] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-[9px] opacity-40 uppercase block mb-1">VK Access Token</label>
                <input 
                  type="password" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste token here..."
                  className="w-full bg-[#0A0A0B] border border-[#2A2A2C] rounded-sm px-3 py-2 text-xs focus:border-[#F27D26] outline-none transition-colors"
                />
                <p className="text-[8px] opacity-30 mt-1">Required for private data access.</p>
              </div>
              <button 
                onClick={handleFetch}
                disabled={isLoading}
                className="w-full bg-[#F27D26] text-black font-bold text-[10px] py-2 rounded-sm hover:bg-[#F27D26]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                EXECUTE SCAN
              </button>
            </div>
            {error && (
              <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] flex items-center gap-2">
                <AlertCircle size={12} />
                {error}
              </div>
            )}
          </div>

          {data && (
            <div className="p-4 bg-[#1A1A1C] border border-[#2A2A2C] rounded-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={data.profile.photo_100 || 'https://via.placeholder.com/100'} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-sm border border-white/10"
                />
                <div>
                  <h4 className="text-sm font-bold">{data.profile.first_name} {data.profile.last_name}</h4>
                  <p className="text-[10px] opacity-40">ID: {data.profile.id}</p>
                  <p className="text-[10px] text-[#F27D26]">{data.profile.status || 'No status'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white/5 rounded-sm">
                  <span className="text-[8px] opacity-30 uppercase block">Followers</span>
                  <span className="text-xs font-bold">{data.profile.followers_count || 0}</span>
                </div>
                <div className="p-2 bg-white/5 rounded-sm">
                  <span className="text-[8px] opacity-30 uppercase block">City</span>
                  <span className="text-xs font-bold">{data.profile.city?.title || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Panel */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-full min-h-[500px] bg-[#1A1A1C] border border-[#2A2A2C] rounded-sm flex flex-col">
            <div className="p-3 border-b border-[#2A2A2C] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#F27D26]" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Analytical Intelligence Report</span>
              </div>
              {isAnalyzing && <Loader2 size={14} className="animate-spin text-[#F27D26]" />}
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto prose prose-invert prose-sm max-w-none">
              {!data && !isLoading && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                  <Shield size={48} />
                  <p className="text-xs uppercase tracking-[0.3em]">Awaiting Target Parameters</p>
                </div>
              )}
              
              {isAnalyzing && !analysis && (
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
                </div>
              )}

              {analysis && <Markdown>{analysis}</Markdown>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
