
import React from 'react';
import { User, UserRole } from '../types';
import Logo from './Logo';
import AIAssistant from './AIAssistant';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  toggleRole: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentUser, onLogout }) => {
  const studentMenuItems = [
    { id: 'home', label: 'Início', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: 'missao', label: 'Missão', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    )},
    { id: 'simulados', label: 'Simulados', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { id: 'ranking', label: 'Ranking', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    )},
  ];

  const teacherMenuItems = [
    { id: 'central', label: 'Central', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    )},
    { id: 'terminal', label: 'Terminal', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )}
  ];

  const currentMenuItems = currentUser.role === UserRole.TEACHER ? teacherMenuItems : studentMenuItems;

  const tabTitles: { [key: string]: string } = {
    home: 'Painel do Aluno',
    missao: 'Central de Missões',
    simulados: 'Simulados Oficiais',
    ranking: 'Ranking Global',
    central: 'Painel de Coordenação',
    terminal: 'Terminal do Mestre'
  };
  
  const userAvatar = currentUser.profilePicture 
    ? currentUser.profilePicture 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name || 'EliteUser'}`;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-jakarta">
      {/* Sidebar Luxo */}
      <aside className="w-80 flex flex-col bg-white border-r border-slate-200 z-50">
        <div className="p-12">
          <Logo variant="full" className="w-12 h-12" />
        </div>

        <nav className="flex-1 px-8 space-y-4">
          {currentMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-5 px-6 py-5 rounded-3xl text-sm font-extrabold transition-all duration-300 ${
                activeTab === item.id 
                ? 'elite-gradient text-white shadow-2xl shadow-blue-600/30' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className={activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-blue-600'}>
                {item.icon}
              </div>
              <span className="tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-10">
           <div className="bg-white border border-slate-200 text-center p-8 rounded-[2.5rem] space-y-4">
             <div className="text-3xl">🤔</div>
             <h4 className="text-sm font-black text-slate-800">Precisa de Ajuda?</h4>
             <p className="text-xs text-slate-500 leading-relaxed">Fale com o suporte para tirar dúvidas sobre a plataforma.</p>
             <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all w-full">
               Fazer Pergunta
             </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-28 bg-white/80 backdrop-blur-xl flex items-center justify-between px-16 z-40 border-b border-slate-100">
          <div className="flex items-center space-x-12 flex-1">
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                {tabTitles[activeTab] || 'Divino Saber'}
             </h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 p-2.5 bg-white rounded-2xl border-2 border-blue-300 shadow-sm">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Status: Sincronizado</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0">
                <img src={userAvatar} className="w-full h-full object-cover" alt="Profile" />
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sair da Plataforma"
              className="w-14 h-14 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-16 py-12 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-32">
            {children}
          </div>
        </main>

        <AIAssistant />
      </div>
    </div>
  );
};

export default Layout;
