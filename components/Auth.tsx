
import React, { useState, useEffect } from 'react';
import { ADMIN_CREDENTIALS } from '../constants';
import { User, UserRole } from '../types';
import Logo from './Logo';

interface AuthProps {
  onLogin: (user: User) => void;
  whitelistedStudents: string[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, whitelistedStudents }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const learningTips = [
    { title: "Neurociência", text: "A repetição espaçada aumenta a retenção em até 80%." },
    { title: "Foco Ativo", text: "Explicar o conteúdo para si mesmo é a forma mais rápida de aprender." },
    { title: "Saúde Mental", text: "Pequenas pausas a cada 25 minutos evitam a fadiga cognitiva." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % learningTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const userEmail = email.toLowerCase();

      if (isLogin) {
        if (userEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
          onLogin({ id: 'admin_1', name: 'João Lucas', email: userEmail, role: UserRole.TEACHER, cpf: '' });
        } else {
          onLogin({ id: 'std_' + userEmail, name: '', email: userEmail, role: UserRole.STUDENT, cpf: '' });
        }
      } else { // Signup
        if (whitelistedStudents.includes(userEmail)) {
           onLogin({
              id: 'std_' + Date.now(),
              name: name,
              email: userEmail,
              cpf: cpf,
              profilePicture: profilePicture || undefined,
              role: UserRole.STUDENT,
              stats: { points: 0, streak: 0, level: 1, rank: 'BRONZE', totalQuestionsAnswered: 0, totalCorrectAnswers: 0 }
            });
        } else {
          alert("Acesso Negado. Seu e-mail não foi autorizado pelo coordenador. Por favor, entre em contato com a instituição.");
        }
      }
      
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      <div className="hidden lg:flex flex-1 elite-gradient relative items-center justify-center p-20 overflow-hidden">
        <div className="space-y-12 text-white max-w-lg relative z-10 text-center">
          <div className="flex flex-col items-center space-y-12">
            <div className="w-52 h-52 bg-white/5 backdrop-blur-xl rounded-[4rem] p-12 border border-white/10 shadow-2xl animate-in zoom-in-90 duration-700">
               <Logo variant="icon" className="w-full h-full" />
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter leading-none uppercase">
                IFRN PREPARATÓRIO.
              </h2>
              <p className="text-xl font-medium opacity-70">
                Construindo o conhecimento peça por peça.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/10 space-y-4">
             <div className="flex items-center justify-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Insight {learningTips[tipIndex].title}</span>
             </div>
             <p className="text-lg font-bold leading-tight opacity-90 italic">
               "{learningTips[tipIndex].text}"
             </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-12">
          <div className="flex flex-col items-center lg:items-start space-y-8">
            <Logo variant="full" className="w-16 h-16" />
            <div className="space-y-1 text-center lg:text-left">
               <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                 Aprenda Divinamente
               </h1>
            </div>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-2xl w-full border border-slate-200 shadow-inner">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Entrar</button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Criar Conta</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nome Completo</label>
                  <input type="text" placeholder="Nome do Aluno" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm font-bold" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">CPF</label>
                  <input type="text" placeholder="000.000.000-00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm font-bold" value={cpf} onChange={(e) => setCpf(e.target.value)} required={!isLogin} />
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Foto Pessoal</label>
                    <input type="file" onChange={handlePhotoUpload} accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">E-mail Acadêmico</label>
                <input type="email" placeholder="seu@email.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm font-bold" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Senha</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm font-bold" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <button disabled={loading} className={`w-full py-5 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center ${'bg-blue-600'} hover:opacity-90 active:scale-[0.98] shadow-lg shadow-blue-600/10`}>
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : isLogin ? 'Aprenda agora!' : 'Concluir Inscrição'}
            </button>
          </form>

          <p className="text-[9px] font-bold text-slate-300 text-center uppercase tracking-widest mt-12">
            © 2024 Divino Saber - Coordenação IFRN Elite
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
