
import React from 'react';
import { User } from '../types';

interface RankingProps {
  students: User[];
  currentUserId: string;
}

const Ranking: React.FC<RankingProps> = ({ students, currentUserId }) => {
  // Ordenação por XP descendente
  const sortedStudents = [...students].sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0));

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-2">
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Multiplayer Sincronizado</p>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Elite Global IFRN</h2>
        <p className="text-slate-400 font-medium italic">Ranking atualizado em tempo real com base nos novos treinos.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedStudents.map((student, index) => {
          const isMe = student.id === currentUserId;
          const accuracy = student.stats?.totalQuestionsAnswered && student.stats.totalQuestionsAnswered > 0 
            ? Math.round((student.stats.totalCorrectAnswers / student.stats.totalQuestionsAnswered) * 100) 
            : 0;
            
          const avatarSrc = student.profilePicture 
            ? student.profilePicture 
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`;

          return (
            <div 
              key={student.id}
              className={`ds-card p-6 flex items-center justify-between border-l-8 transition-all hover:scale-[1.01] ${
                isMe ? 'border-l-blue-600 bg-blue-50/50 shadow-xl' : 'border-l-slate-200'
              }`}
            >
              <div className="flex items-center space-x-6">
                <span className={`text-2xl font-black w-10 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-orange-600' : 'text-slate-300'}`}>
                  #{index + 1}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-0.5 overflow-hidden shadow-sm">
                   <img src={avatarSrc} className="w-full h-full object-cover" alt="Student" />
                </div>
                <div>
                   <h4 className={`text-lg font-black ${isMe ? 'text-blue-700' : 'text-slate-900'}`}>
                     {student.name} {isMe && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full ml-2">VOCÊ</span>}
                   </h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.stats?.streak} dias de sequência</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-slate-900">{student.stats?.points.toLocaleString()} <span className="text-xs text-blue-500">XP</span></p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${accuracy}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{accuracy}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 ds-card bg-slate-900 text-white flex items-center justify-between border-0">
         <div className="space-y-1">
            <h4 className="text-xl font-black">Liga de Ouro IFRN</h4>
            <p className="text-xs opacity-60">Sincronização global ativa. Suba no ranking completando simulados oficiais.</p>
         </div>
         <span className="text-3xl">📡</span>
      </div>
    </div>
  );
};

export default Ranking;
