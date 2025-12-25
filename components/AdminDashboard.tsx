
import React, { useState, useRef } from 'react';
import { Module, Question, Difficulty, Subject, Simulado, User, Mission, MotivationalText } from '../types';
import { extractExamDataFromPdf, generateAudioSummary } from '../services/geminiService';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface AdminDashboardProps {
  modules: Module[];
  questions: Question[];
  simulados: Simulado[];
  missions: Mission[];
  students: User[];
  whitelistedStudents: string[];
  onAddQuestions: (qs: Question[]) => void;
  onAddSimulado: (s: Simulado) => void;
  onAddMission: (m: Mission) => void;
  onSetGlobalMission: (m: Mission) => void;
  onUpdateModule: (m: Module) => void;
  onAddWhitelistedStudent: (email: string) => void;
  onAddMotivationalText: (text: MotivationalText) => string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  questions, 
  simulados,
  missions,
  students,
  whitelistedStudents,
  onAddQuestions, 
  onAddSimulado,
  onAddMission,
  onSetGlobalMission,
  onAddWhitelistedStudent,
  onAddMotivationalText
}) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'simulados' | 'questoes' | 'missao'>('simulados');
  
  // States para criação de Simulados
  const [simTitle, setSimTitle] = useState('');
  const [selectedQs, setSelectedQs] = useState<string[]>([]);
  const [simReward, setSimReward] = useState(1000);
  const [motivationalText, setMotivationalText] = useState('');
  const [motivationalImage, setMotivationalImage] = useState<string | undefined>(undefined);
  
  // States para Missão
  const [missionTitle, setMissionTitle] = useState('');
  const [missionDesc, setMissionDesc] = useState('');
  const [missionPoints, setMissionPoints] = useState(500);
  const [missionSummary, setMissionSummary] = useState('');
  const [missionSelectedQs, setMissionSelectedQs] = useState<string[]>([]);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // States para IA PDF Extractor
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  
  // State para Whitelist
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const handleCreateSimulado = () => {
    if (!simTitle || selectedQs.length === 0) {
      alert('Preencha o título e selecione as questões para o simulado.');
      return;
    }
    if (selectedQs.length !== 40) {
      alert('Para garantir a qualidade da avaliação, cada simulado oficial deve conter exatamente 40 questões.');
      return;
    }
    const newSim: Simulado = {
      id: 'sim_' + Date.now(),
      title: simTitle,
      description: `Avaliação com ${selectedQs.length} questões. Duração: ${selectedQs.length * 2} min.`,
      questionIds: selectedQs,
      durationMinutes: selectedQs.length * 2,
      createdAt: Date.now(),
      rewardXP: simReward,
      motivationalText: motivationalText,
      motivationalImageBase64: motivationalImage
    };
    onAddSimulado(newSim);
    setSimTitle('');
    setSelectedQs([]);
    setMotivationalText('');
    setMotivationalImage(undefined);
    alert('Simulado publicado com sucesso!');
  };
  
  const handleMotivationalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setMotivationalImage(base64.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingPdf(true);
    setExtractedData(null);
    setPdfFileName(file.name);

    try {
      const typedArray = new Uint8Array(await file.arrayBuffer());
      const loadingTask = pdfjs.getDocument(typedArray);
      const pdf = await loadingTask.promise;
      
      const pageProcessingPromises = Array.from({ length: pdf.numPages }, async (_, i) => {
        const page = await pdf.getPage(i + 1);
        
        // Extração de Imagem
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
        
        // Extração de Texto
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');

        return { imageData, pageText };
      });
      
      const processedPages = await Promise.all(pageProcessingPromises);
      const allPageImages = processedPages.map(p => ({ imageData: p.imageData }));
      const fullText = processedPages.map(p => p.pageText).join('\n\n--- FIM DA PÁGINA ---\n\n');

      const dataFromAI = await extractExamDataFromPdf(allPageImages, fullText);
      setExtractedData(dataFromAI);

    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Falha ao processar o arquivo PDF. A IA de visão não conseguiu analisar o documento.");
    } finally {
        setIsProcessingPdf(false);
    }
  };

  const processExtractedData = (isForSimulado: boolean = false) => {
    if (!extractedData || !extractedData.questoes) return;
    if (isForSimulado && !simTitle) {
      alert("Por favor, dê um título ao simulado antes de criá-lo.");
      return;
    }

    const motivationalTextIds: string[] = [];
    if (extractedData.textos_motivadores && extractedData.textos_motivadores.length > 0) {
      extractedData.textos_motivadores.forEach((text: any) => {
        const newText: MotivationalText = {
          id: 'mt_' + Date.now() + Math.random(),
          title: text.titulo,
          content: text.conteudo,
          sourcePdf: pdfFileName,
          imageBase64: text.imageBase64,
        };
        const newId = onAddMotivationalText(newText);
        motivationalTextIds.push(newId);
      });
    }

    const newQuestions: Question[] = extractedData.questoes.map((q: any) => ({
      id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      enunciado: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      difficulty: q.difficulty as Difficulty,
      subject: q.subject as Subject,
      type: 'OBJECTIVE',
      basePoints: q.difficulty === Difficulty.HARD ? 500 : q.difficulty === Difficulty.MEDIUM ? 250 : 100,
      imageBase64: q.imageBase64,
      contextText: q.contextText,
      usesMotivationalText: q.usesMotivationalText,
      tags: [q.subject, q.difficulty.toLowerCase()],
      timesUsed: 0,
      createdAt: Date.now(),
      year: new Date().getFullYear().toString(),
      sourcePdf: pdfFileName,
    }));
    
    onAddQuestions(newQuestions);
    const newQuestionIds = newQuestions.map(q => q.id);

    if (isForSimulado) {
        const newSim: Simulado = {
          id: 'sim_ai_' + Date.now(),
          title: simTitle,
          description: `Simulado com ${newQuestionIds.length} questões geradas via IA do PDF: ${pdfFileName}.`,
          questionIds: newQuestionIds,
          durationMinutes: newQuestionIds.length * 2,
          createdAt: Date.now(),
          rewardXP: simReward || 1000,
          motivationalTextIds: motivationalTextIds,
        };
        onAddSimulado(newSim);
        alert(`Simulado "${simTitle}" criado com ${newQuestionIds.length} questões e texto de apoio!`);
    } else {
        alert(`${newQuestions.length} questões foram salvas no banco com sucesso!`);
    }

    setExtractedData(null);
    setSimTitle('');
  };

  const handleAuthorizeStudent = () => {
    onAddWhitelistedStudent(newStudentEmail);
    setNewStudentEmail('');
  };

  const handleCreateAudioMission = async () => {
    if (!missionTitle || !missionSummary || missionSelectedQs.length === 0) {
      alert('Preencha o título, o conteúdo do resumo e selecione as questões para a missão.');
      return;
    }
    setIsGeneratingAudio(true);
    const audioBase64 = await generateAudioSummary(missionSummary);
    if (!audioBase64) {
      alert('Falha ao gerar o áudio da missão. Tente novamente.');
      setIsGeneratingAudio(false);
      return;
    }
    
    const newMission: Mission = {
      id: 'mission_' + Date.now(),
      title: missionTitle,
      description: missionDesc || 'Ouça o resumo em áudio e responda às questões para completar a missão.',
      points: missionPoints, status: 'pending', type: 'audio', subject: 'Geral', icon: '🔊',
      questionIds: missionSelectedQs,
      summary: { text: missionSummary, audioBase64: audioBase64 }
    };
  
    onAddMission(newMission);
    setIsGeneratingAudio(false);
    
    setMissionTitle(''); setMissionDesc(''); setMissionPoints(500); setMissionSummary(''); setMissionSelectedQs([]);
    alert('Missão de Áudio criada com sucesso! Você pode lançá-la como global a qualquer momento.');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="space-y-8">
        <div className="space-y-2"><p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Gestão Pedagógica Estratégica</p><h2 className="text-5xl font-black text-slate-900 tracking-tighter">Painel de Coordenação: João Lucas</h2></div>
        <div className="flex bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
          {[{ id: 'monitor', label: 'Monitoramento' }, { id: 'questoes', label: 'Banco de Questões' }, { id: 'simulados', label: 'Simulados' }, { id: 'missao', label: 'Missões' }].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setExtractedData(null); }} className={`flex-1 px-6 py-3.5 rounded-full text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>{tab.label}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9">
          {activeTab === 'monitor' && (<div className="space-y-8"><div className="ds-card p-10 space-y-8"><div className="flex justify-between items-center"><h3 className="text-2xl font-black text-slate-900 tracking-tight">Análise de Performance dos Alunos</h3><span className="text-[10px] font-black text-green-600 bg-green-50 px-4 py-1 rounded-full uppercase">Sincronização Ativa</span></div><div className="grid grid-cols-1 gap-4">{students.length === 0 ? <p className="text-center py-10 text-xs font-bold text-slate-400">Nenhum aluno ativo. Autorize o acesso.</p> : students.map(s => (<div key={s.id} className="p-6 border border-slate-100 rounded-3xl bg-slate-50 flex items-center justify-between hover:bg-white transition-all shadow-sm group"><div className="flex items-center space-x-5"><div className="w-14 h-14 bg-white rounded-2xl p-1 shadow-sm relative ring-2 ring-slate-100 group-hover:ring-blue-600/20 transition-all"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`} className="w-full h-full" alt="Student" /></div><div><h4 className="font-black text-slate-900">{s.name}</h4><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-mail: {s.email}</p></div></div><div className="flex space-x-12 pr-6"><div className="text-center"><p className="text-[9px] font-black text-blue-600 uppercase">XP Acumulado</p><p className="text-xl font-black">{s.stats?.points.toLocaleString()}</p></div><div className="text-center"><p className="text-[9px] font-black text-orange-500 uppercase">Precisão Média</p><p className="text-xl font-black">{s.stats?.accuracy}%</p></div></div></div>))}</div></div><div className="ds-card p-10 space-y-6"><h3 className="text-2xl font-black text-slate-900 tracking-tight">Controle de Acesso (Whitelist)</h3><div className="flex gap-4"><input type="email" value={newStudentEmail} onChange={e => setNewStudentEmail(e.target.value)} placeholder="E-mail do novo aluno para autorizar..." className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600/20" /><button onClick={handleAuthorizeStudent} className="bg-slate-900 text-white font-bold px-8 rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-600">Autorizar</button></div><div className="p-4 bg-slate-50 rounded-2xl border"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Alunos Autorizados ({whitelistedStudents.length})</p><div className="flex flex-wrap gap-2">{whitelistedStudents.map(email => (<span key={email} className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-lg">{email}</span>))}</div></div></div></div>)}
          {activeTab === 'questoes' && (<div className="space-y-8"><div className="ds-card p-10 space-y-8 animate-in slide-in-from-bottom-2"><h3 className="text-2xl font-black text-slate-900">Central de IA: Extração de Provas</h3><p className="text-slate-500 max-w-2xl">Use a IA para extrair e modelar questões e textos de apoio de provas do IFRN em PDF, garantindo uma apresentação perfeita para os alunos.</p><div className="p-8 border-2 border-dashed border-slate-300 rounded-3xl text-center space-y-4 bg-slate-50"><div className="text-5xl">📄➡️🧠</div><h4 className="text-xl font-bold">Extração Inteligente de Provas</h4><p className="text-slate-500 text-sm max-w-lg mx-auto">Envie uma prova completa do IFRN. A IA irá identificar, extrair e formatar cada item, incluindo textos motivadores.</p><input type="file" ref={fileInputRef} onChange={handlePdfUpload} accept=".pdf" className="hidden" /><button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg" disabled={isProcessingPdf}>{isProcessingPdf ? 'PROCESSANDO COM IA...' : 'SELECIONAR PROVA EM PDF'}</button></div>{isProcessingPdf && (<div className="text-center p-10 space-y-4"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div><p className="text-sm font-bold text-slate-500">A IA está lendo o documento e criando questões...</p></div>)}{extractedData && !isProcessingPdf && (<div className="space-y-6 animate-in fade-in"><div className="p-6 bg-slate-50 rounded-2xl border"><h4 className="text-sm font-black text-slate-800 mb-4">{extractedData.questoes?.length || 0} Questões e {extractedData.textos_motivadores?.length || 0} Textos Extraídos</h4>{(extractedData.questoes?.length || 0) > 0 && (extractedData.questoes?.length || 0) !== 40 && (<div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-4"><p className="text-sm font-bold text-red-800">Alerta de Sincronização</p><p className="text-xs text-red-700">A IA extraiu {extractedData.questoes?.length} questões. O padrão para provas do IFRN é 40. Verifique se o PDF está completo ou se a extração foi parcial antes de criar o simulado.</p></div>)}<div className="space-y-3 max-h-[60vh] overflow-y-auto p-4 bg-slate-100 rounded-2xl border">{extractedData.questoes.map((q: any, i: number) => (<div key={i} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">{q.imageBase64 && <img src={`data:image/png;base64,${q.imageBase64}`} alt={`Imagem ${i+1}`} className="mb-4 rounded-lg max-w-full h-auto border" />}<p className="font-bold text-sm text-slate-900 whitespace-pre-wrap">{i + 1}. {q.text}</p><ul className="pl-5 mt-2 space-y-1 text-xs">{q.options.map((opt: string, idx: number) => (<li key={idx} className={`text-slate-600 ${idx === q.correctAnswerIndex ? 'font-black text-green-700' : ''}`}>{String.fromCharCode(97 + idx)}) {opt}</li>))}</ul></div>))}</div></div><div className="grid grid-cols-2 gap-4"><button onClick={() => processExtractedData(false)} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Salvar no Banco</button><div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 space-y-3"><p className="text-[10px] font-black uppercase text-blue-700">OU CRIE UM SIMULADO DIRETO</p><input type="text" placeholder="Título do Novo Simulado" value={simTitle} onChange={e => setSimTitle(e.target.value)} className="w-full bg-white border-slate-200 rounded-lg p-3 text-xs font-bold"/><button onClick={() => processExtractedData(true)} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold uppercase tracking-widest text-xs">Criar Simulado com as {extractedData.questoes?.length || 0} Questões</button></div></div></div>)}</div><div className="ds-card p-10 space-y-6"><h3 className="text-xl font-black text-slate-900">Itens no Banco ({questions.length})</h3><div className="space-y-3 max-h-[60vh] overflow-y-auto p-2">{questions.length === 0 ? <p className="text-center py-10 text-xs font-bold text-slate-400">O banco de questões está vazio.</p> : questions.map((q) => (<div key={q.id} className="p-4 bg-slate-50/50 rounded-lg border border-slate-100"><p className="font-bold text-xs text-slate-800 truncate">{q.enunciado}</p><div className="flex items-center space-x-4 mt-2"><span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{q.subject}</span><span className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{q.difficulty}</span><span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">{q.tags.join(', ')}</span></div></div>))}</div></div></div>)}
          {activeTab === 'simulados' && (<div className="space-y-8 animate-in slide-in-from-bottom-2"><div className="ds-card p-10 space-y-8"><h3 className="text-2xl font-black text-slate-900">Criar Simulado com IA</h3><p className="text-slate-500 max-w-2xl">Otimize seu tempo. Envie uma prova completa em PDF e a IA irá extrair as questões e textos para criar um novo simulado instantaneamente.</p><div className="p-8 border-2 border-dashed border-slate-300 rounded-3xl text-center space-y-4 bg-slate-50"><div className="text-5xl">🚀</div><h4 className="text-xl font-bold">Criação Rápida de Simulado</h4><p className="text-slate-500 text-sm max-w-lg mx-auto">Envie o arquivo PDF da prova. As questões serão processadas e estarão prontas para virar um simulado.</p><input type="file" ref={fileInputRef} onChange={handlePdfUpload} accept=".pdf" className="hidden" /><button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg" disabled={isProcessingPdf}>{isProcessingPdf ? 'PROCESSANDO COM IA...' : 'SELECIONAR PROVA EM PDF'}</button></div>{isProcessingPdf && (<div className="text-center p-10 space-y-4"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div><p className="text-sm font-bold text-slate-500">A IA está lendo o documento...</p></div>)}{extractedData && !isProcessingPdf && (<div className="space-y-6 animate-in fade-in"><div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 space-y-3"><h4 className="text-sm font-black text-slate-800 mb-2">{extractedData.questoes?.length || 0} Questões Extraídas de "{pdfFileName}"</h4>{(extractedData.questoes?.length || 0) > 0 && (extractedData.questoes?.length || 0) !== 40 && (<div className="p-4 bg-red-50 border border-red-200 rounded-2xl"><p className="text-sm font-bold text-red-800">Alerta de Sincronização</p><p className="text-xs text-red-700">A IA extraiu {extractedData.questoes?.length} questões. O padrão para provas do IFRN é 40. Verifique se o PDF está completo ou se a extração foi parcial antes de criar o simulado.</p></div>)}<p className="text-[10px] font-black uppercase text-blue-700">DÊ UM TÍTULO E CRIE O SIMULADO</p><input type="text" placeholder="Título do Novo Simulado" value={simTitle} onChange={e => setSimTitle(e.target.value)} className="w-full bg-white border-slate-200 rounded-lg p-3 text-xs font-bold" /><button onClick={() => processExtractedData(true)} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold uppercase tracking-widest text-xs">Criar Simulado com as {extractedData.questoes?.length || 0} Questões</button><p className="text-xs text-slate-500 text-center pt-2">As questões também serão salvas no seu banco de dados.</p></div></div>)}</div><div className="ds-card p-10 space-y-8"><h3 className="text-2xl font-black text-slate-900">Arquiteto de Avaliações (Manual)</h3><p className="text-slate-500 max-w-2xl">Monte avaliações estratégicas selecionando itens do seu banco de questões manualmente.</p><div className="space-y-6"><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Título do Simulado (Ex: Simulado Mensal - Setembro)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" value={simTitle} onChange={e => setSimTitle(e.target.value)} /><input type="number" placeholder="Recompensa Extra de XP (Ex: 1000)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" value={simReward} onChange={e => setSimReward(Number(e.target.value))} /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contexto Estratégico (Opcional)</label><textarea placeholder="Insira um texto motivacional para os alunos verem antes do simulado..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none" value={motivationalText} onChange={e => setMotivationalText(e.target.value)} rows={3} /><input type="file" accept="image/*" onChange={handleMotivationalImageUpload} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /></div><div className="p-6 bg-slate-50 rounded-3xl border border-slate-200"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Selecione as Questões do Banco ({selectedQs.length} selecionadas)</p><div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">{questions.length === 0 ? <p className="text-center py-10 text-xs font-bold text-slate-400">Nenhuma questão disponível no banco.</p> : questions.map(q => (<button key={q.id} onClick={() => setSelectedQs(prev => prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id])} className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all ${selectedQs.includes(q.id) ? 'bg-blue-50 border-blue-600 shadow-sm' : 'bg-white border-white hover:border-slate-100'}`}><span className="text-sm font-bold text-slate-700 truncate mr-4">{q.enunciado}</span><span className="text-[9px] font-black text-blue-500 uppercase shrink-0">+{q.basePoints} XP</span></button>))}</div></div><button onClick={handleCreateSimulado} className="w-full py-5 elite-gradient text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl">Lançar Simulado Oficial</button></div></div></div>)}
          {activeTab === 'missao' && (<div className="animate-in slide-in-from-bottom-2 space-y-8"><div className="ds-card p-10 space-y-8"><h3 className="text-2xl font-black text-slate-900">Central de Criação de Missões de Áudio</h3><div className="grid grid-cols-2 gap-4"><input type="text" placeholder="Título da Missão" value={missionTitle} onChange={e => setMissionTitle(e.target.value)} className="bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold" /><input type="text" placeholder="Descrição curta" value={missionDesc} onChange={e => setMissionDesc(e.target.value)} className="bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold" /></div><textarea placeholder="Conteúdo do resumo para ser narrado pela IA..." value={missionSummary} onChange={e => setMissionSummary(e.target.value)} rows={5} className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 text-sm font-bold" /><div className="p-4 bg-slate-50 rounded-xl border"><p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Selecione as Questões ({missionSelectedQs.length})</p><div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">{questions.map(q => (<button key={q.id} onClick={() => setMissionSelectedQs(p => p.includes(q.id) ? p.filter(id => id !== q.id) : [...p, q.id])} className={`p-2 text-left rounded-lg text-xs font-bold ${missionSelectedQs.includes(q.id) ? 'bg-blue-100 text-blue-800' : 'bg-white hover:bg-slate-100'}`}>{q.enunciado}</button>))}</div></div><button onClick={handleCreateAudioMission} disabled={isGeneratingAudio} className="w-full py-4 elite-gradient text-white rounded-xl font-bold uppercase tracking-widest text-xs">{isGeneratingAudio ? 'Gerando Áudio...' : 'Criar Missão de Áudio'}</button></div><div className="ds-card p-10 space-y-4"><h3 className="text-xl font-black text-slate-900">Missões Criadas ({missions.length})</h3><div className="space-y-3">{missions.map(m => (<div key={m.id} className="p-4 bg-slate-50 rounded-xl border flex justify-between items-center"><div><p className="font-bold text-slate-800">{m.title}</p><p className="text-xs text-slate-500">{m.questionIds?.length} questões</p></div><button onClick={() => onSetGlobalMission(m)} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold uppercase hover:bg-blue-600">Lançar</button></div>))}</div></div></div>)}
        </div>
        <div className="col-span-3 space-y-6"><div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6"><h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Resumo Estrutural</h4><div className="space-y-4"><div className="flex justify-between border-b border-white/10 pb-3"><span className="text-xs text-slate-400">Total de Alunos</span><span className="font-black">{students.length}</span></div><div className="flex justify-between border-b border-white/10 pb-3"><span className="text-xs text-slate-400">Banco de Itens</span><span className="font-black">{questions.length}</span></div><div className="flex justify-between border-b border-white/10 pb-3"><span className="text-xs text-slate-400">Simulados Ativos</span><span className="font-black">{simulados.length}</span></div></div><div className="pt-4"><div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center space-x-3"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[9px] font-black uppercase tracking-widest">Sincronização em Nuvem OK</span></div></div></div><div className="ds-card p-8 space-y-4 border-dashed border-slate-300"><h4 className="text-xs font-black text-slate-900 uppercase">Sugestão Pedagógica</h4><p className="text-[11px] text-slate-500 leading-relaxed font-medium">Lembre-se de manter uma proporção de 60% questões fáceis, 30% médias e 10% difíceis para garantir o engajamento sem frustrar o candidato.</p></div></div>
      </div>
    </div>
  );
};

export default AdminDashboard;