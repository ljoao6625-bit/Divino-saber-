
import React, { useState, useRef } from 'react';
import { Question, Mission, Module, StudyMaterial } from '../types';
import { decodeAudioToBuffer } from '../services/geminiService';

interface MissionsProps {
  onStartPractice: (questions: Question[], mission: Mission) => void;
  questions: Question[];
  missions: Mission[];
  globalMission: Mission | null;
  modules: Module[];
  studyMaterials: StudyMaterial[];
}

const Missions: React.FC<MissionsProps> = ({ onStartPractice, questions, missions, globalMission, modules, studyMaterials }) => {
  const [activeSubTab, setActiveSubTab] = useState<'portugues' | 'matematica' | 'audio' | 'resumos'>('portugues');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null); // Store mission ID
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  const handleStartMission = (mission: Mission) => {
    if (mission.questionIds) {
      const missionQuestions = questions.filter(q => mission.questionIds?.includes(q.id));
      if (missionQuestions.length > 0) {
        onStartPractice(missionQuestions, mission);
      } else {
        alert("As questões para esta missão ainda não estão disponíveis.");
      }
    }
  };

  const handlePlayAudio = async (mission: Mission) => {
    if (isPlaying === mission.id && audioSourceRef.current) {
      audioSourceRef.current.stop();
      setIsPlaying(null);
      audioSourceRef.current = null;
      return;
    }
  
    if (!mission.summary?.audioBase64) return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      setIsPlaying(mission.id);
      const buffer = await decodeAudioToBuffer(mission.summary.audioBase64, audioCtxRef.current);
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => {
        setIsPlaying(null);
        audioSourceRef.current = null;
      };
      source.start();
      audioSourceRef.current = source;
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(null);
      alert("Não foi possível reproduzir o áudio da missão.");
    }
  };

  const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => (
    <div className="ds-card p-6 flex justify-between items-center hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-5">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">{mission.icon}</div>
        <div>
          <h4 className="text-lg font-black text-slate-800">{mission.title}</h4>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{mission.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {mission.type === 'audio' && mission.summary?.audioBase64 && (
          <button onClick={() => handlePlayAudio(mission)} className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full text-lg">
            {isPlaying === mission.id ? '⏹️' : '▶️'}
          </button>
        )}
        <button 
          onClick={() => handleStartMission(mission)}
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors"
        >
          Iniciar (+{mission.points}XP)
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubTab) {
      case 'portugues':
      case 'matematica': {
        const subject = activeSubTab === 'portugues' ? 'Português' : 'Matemática';
        const filteredMissions = missions.filter(m => m.subject === subject && m.id !== globalMission?.id);
        if (filteredMissions.length === 0) return <p className="text-center text-slate-500 py-10">Nenhuma missão de {subject} disponível no momento.</p>;
        return <div className="space-y-4">{filteredMissions.map(m => <MissionCard key={m.id} mission={m} />)}</div>;
      }
      case 'audio': {
        const audioMissions = missions.filter(m => m.type === 'audio' && m.id !== globalMission?.id);
        if (audioMissions.length === 0) return <p className="text-center text-slate-500 py-10">Nenhuma missão de áudio disponível no momento.</p>;
        return <div className="space-y-4">{audioMissions.map(m => <MissionCard key={m.id} mission={m} />)}</div>;
      }
      case 'resumos':
        if (studyMaterials.length === 0) return <p className="text-center text-slate-500 py-10">Nenhum resumo sincronizado pelo Mestre.</p>;
        return <div className="space-y-4">{studyMaterials.map(m => (
          <div key={m.id} className="ds-card p-6 flex justify-between items-center hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">{m.fileType === 'pdf' ? '📄' : '🖼️'}</div>
              <div>
                <h4 className="text-lg font-black text-slate-800">{m.title}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Material de Apoio de {m.subject}</p>
              </div>
            </div>
            <a href={`data:${m.fileType === 'pdf' ? 'application/pdf' : 'image/png'};base64,${m.base64Data}`} download={m.fileName} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors">
              Visualizar
            </a>
          </div>
        ))}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Plano de Estudos Ativo</p>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Central de Missões</h2>
        <p className="text-slate-400 font-medium">Complete as missões lançadas pelo Mestre para ganhar XP extra e subir no ranking.</p>
      </div>

      {globalMission && (
        <div className="relative overflow-hidden elite-gradient rounded-[3rem] p-12 text-white shadow-2xl">
          <div className="relative z-10 space-y-8">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <p className="text-[10px] font-black uppercase tracking-widest">{globalMission.type === 'audio' ? '🎧 Missão de Áudio' : '🔥 Missão Global'}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-5xl font-black leading-tight tracking-tighter">{globalMission.title}</h3>
              <p className="text-lg text-blue-100 font-medium opacity-80">{globalMission.description}</p>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <button onClick={() => handleStartMission(globalMission)} className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-900/40">Iniciar Missão</button>
              {globalMission.type === 'audio' && <button onClick={() => handlePlayAudio(globalMission)} className={`flex items-center space-x-3 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isPlaying === globalMission.id ? 'bg-red-400/20 text-red-300' : 'bg-white/10 hover:bg-white/20'}`}><span>{isPlaying === globalMission.id ? 'Parar' : 'Ouvir'}</span></button>}
              <span className="font-black text-emerald-300">+{globalMission.points} XP Bônus</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
        {[{id: 'portugues', label: 'Português'}, {id: 'matematica', label: 'Matemática'}, {id: 'audio', label: 'Missões de Áudio'}, {id: 'resumos', label: 'Resumos'}].map(tab => (
           <button key={tab.id} onClick={() => setActiveSubTab(tab.id as any)} className={`flex-1 px-6 py-3.5 rounded-full text-sm font-bold transition-all ${activeSubTab === tab.id ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>{tab.label}</button>
        ))}
      </div>
      
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Missions;
