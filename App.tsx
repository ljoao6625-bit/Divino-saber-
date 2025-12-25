
import React, { useState, useEffect } from 'react';
import { UserRole, Question, User, Mission, Simulado, Module, Notification, MotivationalText } from './types';
import { INITIAL_QUESTIONS, INITIAL_MISSIONS, INITIAL_MODULES, ADMIN_CREDENTIALS, WHITELISTED_STUDENTS, INITIAL_STUDENTS, INITIAL_SIMULADOS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import Layout from './components/Layout';
import Auth from './components/Auth';
import StudentHome from './components/StudentHome';
import AdminDashboard from './components/AdminDashboard';
import DailyChallenge from './components/DailyChallenge';
import Missions from './components/Missions';
import Ranking from './components/Ranking';
import TeacherTerminal from './components/TeacherTerminal';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('ds-currentUser', null);
  const [activeTab, setActiveTab] = useState('home');
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [activeMissionQuestions, setActiveMissionQuestions] = useState<Question[]>([]);
  const [activeSimulado, setActiveSimulado] = useState<Simulado | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  
  // Banco de Dados Vivo (Estado Sincronizado e Persistente com LocalStorage)
  const [questions, setQuestions] = useLocalStorage<Question[]>('ds-questions', INITIAL_QUESTIONS);
  const [simulados, setSimulados] = useLocalStorage<Simulado[]>('ds-simulados', INITIAL_SIMULADOS);
  const [modules, setModules] = useLocalStorage<Module[]>('ds-modules', INITIAL_MODULES);
  const [missions, setMissions] = useLocalStorage<Mission[]>('ds-missions', INITIAL_MISSIONS);
  const [students, setStudents] = useLocalStorage<User[]>('ds-students', INITIAL_STUDENTS);
  const [whitelistedStudents, setWhitelistedStudents] = useLocalStorage<string[]>('ds-whitelist', WHITELISTED_STUDENTS);
  const [globalMission, setGlobalMission] = useLocalStorage<Mission | null>('ds-globalMission', null);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('ds-notifications', []);
  const [motivationalTexts, setMotivationalTexts] = useLocalStorage<MotivationalText[]>('ds-motivational-texts', []);

  useEffect(() => {
    if (currentUser?.email === ADMIN_CREDENTIALS.email) {
      setActiveTab('central');
    } else if (currentUser) {
      setActiveTab('home');
    }
  }, [currentUser]);

  // Handlers de Sincronização do Mestre
  const handleAddQuestion = (q: Question) => setQuestions(prev => [q, ...prev]);
  
  const handleAddSimulado = (s: Simulado) => {
    setSimulados(prev => [s, ...prev]);
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      message: `O Mestre publicou um novo simulado: "${s.title}"`,
      read: false,
      createdAt: Date.now()
    };
    setNotifications(prev => [newNotification, ...prev.filter(n => !n.read)]);
  };

  const handleAddMission = (m: Mission) => setMissions(prev => [m, ...prev]);
  const handleSetGlobalMission = (mission: Mission) => {
    setGlobalMission(mission);
    alert('Missão Global lançada com sucesso para todos os alunos!');
  };
  const handleUpdateModule = (m: Module) => setModules(prev => {
    const exists = prev.find(mod => mod.id === m.id);
    if (exists) return prev.map(mod => mod.id === m.id ? m : mod);
    return [...prev, m];
  });
  const handleAddWhitelistedStudent = (email: string) => {
    if (email && !whitelistedStudents.includes(email.toLowerCase())) {
      setWhitelistedStudents(prev => [...prev, email.toLowerCase()]);
      alert(`Aluno com e-mail ${email} foi autorizado.`);
    } else {
      alert('E-mail inválido ou já autorizado.');
    }
  };

  const handleAddMotivationalText = (text: MotivationalText) => {
    setMotivationalTexts(prev => [text, ...prev]);
    return text.id;
  };

  const startChallenge = (selectedQuestions?: Question[], simulado?: Simulado, mission?: Mission) => {
    const available = selectedQuestions && selectedQuestions.length > 0 ? selectedQuestions : questions;
    if (available.length === 0) {
      alert("Nenhum conteúdo sincronizado neste setor ainda.");
      return;
    }
    
    // CORREÇÃO CRÍTICA: A lógica anterior pegava um slice aleatório para missões.
    // Agora, se for um simulado OU uma missão, ele usa o conjunto completo de questões.
    // O slice aleatório é APENAS para desafios diários genéricos.
    const isStructuredChallenge = simulado || mission;
    const challengeSet = isStructuredChallenge ? available : available.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    setActiveMissionQuestions(challengeSet);
    setActiveSimulado(simulado || null);
    setActiveMission(mission || null);
    setIsChallengeActive(true);
  };

  const finishChallenge = (correctCount: number, totalPoints: number) => {
    setIsChallengeActive(false);
    if (currentUser && currentUser.stats) {
      let finalXP = totalPoints;
      if (activeSimulado) finalXP += activeSimulado.rewardXP;
      if (activeMission) finalXP += activeMission.points;

      const totalAnsweredInChallenge = activeMissionQuestions.length;
      const newTotalAnswered = (currentUser.stats.totalQuestionsAnswered || 0) + totalAnsweredInChallenge;
      const newTotalCorrect = (currentUser.stats.totalCorrectAnswers || 0) + correctCount;

      const newStats: User['stats'] = {
        ...currentUser.stats,
        points: currentUser.stats.points + finalXP,
        streak: currentUser.stats.streak + 1,
        totalQuestionsAnswered: newTotalAnswered,
        totalCorrectAnswers: newTotalCorrect,
      };
      
      const updatedUser = { ...currentUser, stats: newStats };
      setCurrentUser(updatedUser);
      setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));
    }
    setActiveSimulado(null);
    setActiveMission(null);
  };
  
  const handleLogin = (user: User) => {
      if(user.role === UserRole.TEACHER) {
          setCurrentUser(user);
          return;
      }
      
      if(whitelistedStudents.includes(user.email.toLowerCase())) {
          const existingStudent = students.find(s => s.email.toLowerCase() === user.email.toLowerCase());
          if (existingStudent) {
              setCurrentUser(existingStudent);
          } else {
              const newUser = { ...user };
              setStudents(prev => [...prev, newUser]);
              setCurrentUser(newUser);
          }
      } else {
          alert('Acesso negado. Seu e-mail não está na lista de alunos autorizados. Fale com o coordenador.');
      }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const handleDismissNotification = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!currentUser) return <Auth onLogin={handleLogin} whitelistedStudents={whitelistedStudents} />;

  const renderContent = () => {
    if (isChallengeActive) {
      return (
        <DailyChallenge 
          questions={activeMissionQuestions} 
          simulado={activeSimulado}
          onFinish={finishChallenge}
          onCancel={() => setIsChallengeActive(false)}
          motivationalTexts={motivationalTexts}
        />
      );
    }

    if (currentUser.role === UserRole.TEACHER) {
      switch (activeTab) {
        case 'central':
          return (
            <AdminDashboard 
              modules={modules}
              questions={questions}
              simulados={simulados}
              missions={missions}
              students={students}
              whitelistedStudents={whitelistedStudents}
              onAddQuestion={handleAddQuestion}
              onAddSimulado={handleAddSimulado}
              onAddMission={handleAddMission}
              onSetGlobalMission={handleSetGlobalMission}
              onUpdateModule={handleUpdateModule}
              onAddWhitelistedStudent={handleAddWhitelistedStudent}
              onAddMotivationalText={handleAddMotivationalText}
            />
          );
        case 'terminal':
          return (
            <TeacherTerminal students={students} questions={questions} />
          );
        default:
          return <AdminDashboard modules={modules} questions={questions} simulados={simulados} missions={missions} students={students} whitelistedStudents={whitelistedStudents} onAddQuestion={handleAddQuestion} onAddSimulado={handleAddSimulado} onAddMission={handleAddMission} onSetGlobalMission={handleSetGlobalMission} onUpdateModule={handleUpdateModule} onAddWhitelistedStudent={handleAddWhitelistedStudent} onAddMotivationalText={handleAddMotivationalText} />;
      }
    }

    const unreadNotifications = notifications.filter(n => !n.read);

    switch (activeTab) {
      case 'home':
        return <StudentHome stats={currentUser.stats!} onStartChallenge={(qs, mission) => startChallenge(qs, undefined, mission)} globalMission={globalMission} questions={questions} notifications={unreadNotifications} onDismissNotification={handleDismissNotification} />;
      case 'missao':
        return <Missions onStartPractice={(qs, mission) => startChallenge(qs, undefined, mission)} questions={questions} missions={missions} globalMission={globalMission} modules={modules} />;
      case 'simulados':
        const sortedSimulados = [...simulados].sort((a, b) => b.createdAt - a.createdAt);
        return (
          <div className="space-y-8 animate-in fade-in">
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Simulados Oficiais</h2>
             <p className="text-slate-500 max-w-2xl">Teste seu conhecimento com avaliações completas, criadas pela coordenação para simular o dia da prova.</p>
             <div className="bg-white border border-slate-200/80 rounded-3xl p-4">
                <div className="space-y-2">
                {sortedSimulados.length > 0 ? sortedSimulados.map(sim => (
                    <div key={sim.id} className="border-b border-slate-100 last:border-b-0 py-5 px-4 flex justify-between items-center group">
                    <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-slate-50 group-hover:bg-blue-50 transition-colors rounded-full flex items-center justify-center text-xl text-slate-400 group-hover:text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                        <h4 className="text-lg font-bold text-slate-800">{sim.title}</h4>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{sim.questionIds.length} QUESTÕES | DURAÇÃO: {sim.durationMinutes} MIN</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => startChallenge(questions.filter(q => sim.questionIds.includes(q.id)), sim)}
                        className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors"
                    >Iniciar Simulado</button>
                    </div>
                )) : <p className="text-center py-10 text-slate-500">Nenhum simulado oficial disponível.</p>}
                </div>
             </div>
          </div>
        );
      case 'ranking':
        return <Ranking students={students} currentUserId={currentUser.id} />;
      default:
        return <StudentHome stats={currentUser.stats!} onStartChallenge={(qs, mission) => startChallenge(qs, undefined, mission)} globalMission={globalMission} questions={questions} notifications={unreadNotifications} onDismissNotification={handleDismissNotification} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} onLogout={handleLogout} toggleRole={() => {}}>
      {renderContent()}
    </Layout>
  );
};

export default App;
