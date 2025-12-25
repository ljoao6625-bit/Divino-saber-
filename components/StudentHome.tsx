
import React from 'react';
import { UserStats, Mission, Question, Notification } from '../types';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface StudentHomeProps {
  stats: UserStats;
  onStartChallenge: (questionsForChallenge?: Question[], mission?: Mission) => void;
  globalMission: Mission | null;
  questions: Question[];
  notifications: Notification[];
  onDismissNotification: (id: string) => void;
}

const chartData = [
  { name: 'Seg', val: 0 },
  { name: 'Ter', val: 0 },
  { name: 'Qua', val: 0 },
  { name: 'Qui', val: 0 },
  { name: 'Sex', val: 0 },
  { name: 'Sab', val: 0 },
  { name: 'Dom', val: 0 },
];

const StudentHome: React.FC<StudentHomeProps> = ({ stats, onStartChallenge, globalMission, questions, notifications, onDismissNotification }) => {
  const handleStartMission = () => {
    if (globalMission) {
      const missionQuestions = questions.filter(q => globalMission.questionIds?.includes(q.id));
      onStartChallenge(missionQuestions, globalMission);
    } else {
      onStartChallenge(); // Fallback para desafio aleatório
    }
  };

  const accuracy = stats.totalQuestionsAnswered > 0 ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100) : 0;
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Notifications */}
      {notifications.map(notif => (
         <div key={notif.id} className="bg-slate-900 text-white p-5 rounded-3xl flex justify-between items-center shadow-2xl animate-in slide-in-from-top-4">
            <div className="flex items-center space-x-4">
               <span className="text-xl">📢</span>
               <p className="text-sm font-bold">{notif.message}</p>
            </div>
            <button onClick={() => onDismissNotification(notif.id)} className="text-slate-400 hover:text-white text-xs font-bold">OK</button>
         </div>
      ))}

      {/* Header Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl">🔥</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sequência</p>
                <p className="text-2xl font-black text-slate-800">{stats.streak} Dias</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-2xl">⚡</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP Atual</p>
                <p className="text-2xl font-black text-slate-800">{stats.points.toLocaleString()}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-2xl">🎯</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precisão</p>
                <p className="text-2xl font-black text-slate-800">{accuracy}%</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">🏆</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posição</p>
                <p className="text-2xl font-black text-slate-800">Estreante</p>
            </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <p className="text-[10px] font-black uppercase tracking-widest">{globalMission ? 'Missão do Mestre' : 'Ação Necessária'}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-5xl font-black leading-tight tracking-tighter">
                  {globalMission ? globalMission.title : 'Desafio Diário'} <br/>
                  <span>Inicie sua <span className="text-red-400">Jornada</span></span>
                </h3>
                <p className="text-lg text-blue-200/80 font-medium max-w-md">
                  {globalMission ? globalMission.description : 'Gere questões aleatórias e comece a pontuar no Ranking.'}
                </p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleStartMission}
                  className="bg-white/10 border border-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Iniciar Missão
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-10 space-y-8">
            <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Atividade Semanal</h4>
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendimento em XP</span>
                </div>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                  <Tooltip 
                    cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                  />
                  <Area type="monotone" dataKey="val" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Elite Ranking</h4>
            <div className="space-y-3">
              {[
                { initial: 'P', name: 'Pendente', points: '0', rank: 1, color: 'text-orange-500' },
                { initial: 'P', name: 'Pendente', points: '0', rank: 2, color: 'text-slate-400' },
                { initial: 'V', name: 'Você', points: '0', rank: 3, color: 'text-blue-600' }
              ].map((user) => (
                <div key={user.rank} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold w-6 text-center ${user.color}`}>#{user.rank}</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500">{user.initial}</div>
                    <span className="font-bold text-slate-700">{user.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-400">{user.points}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-3">
             <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status da Plataforma</p>
             </div>
             <h4 className="text-lg font-black">Bem-vindo à Fase de Alistamento</h4>
             <p className="text-xs text-slate-300/80">Complete seu primeiro desafio para desbloquear todas as funções.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
