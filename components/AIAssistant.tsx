
import React, { useState, useEffect, useRef } from 'react';
import { getLatestIFRNInfo, speakExplanation, decodeAudioToBuffer } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    const data = await getLatestIFRNInfo(query);
    setResponse(data.text);
    setLoading(false);
  };

  const handleSpeak = async () => {
    if (!response) return;
    setIsSpeaking(true);
    const audioData = await speakExplanation(response);
    if (audioData) {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioCtxRef.current;
      const buffer = await decodeAudioToBuffer(audioData, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 elite-gradient text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 border-4 border-white"
      >
        <span className="text-2xl">🪄</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 elite-gradient rounded-2xl flex items-center justify-center text-xl">🤖</div>
                <div>
                  <h3 className="text-xl font-black">Oráculo Divino</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sua IA de Elite em Tempo Real</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">✕</button>
            </div>

            <div className="flex-1 p-8 space-y-6 overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="text-center py-12"><div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div></div>
              ) : response ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {response}
                  </div>
                  <button 
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${isSpeaking ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  >
                    <span>{isSpeaking ? '📢 Narrando...' : '🔊 Ouvir Explicação'}</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <p className="text-slate-400 font-medium">Pergunte algo sobre o IFRN ou um conteúdo difícil...</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t">
              <div className="relative group">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Ex: Datas do exame IFRN 2024..."
                  className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-sm font-bold pr-32 outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
                />
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="absolute right-3 top-3 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  {loading ? '...' : 'CONSULTAR'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
