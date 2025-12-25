
import React, { useState, useEffect } from 'react';
import { Question, Difficulty, Simulado, MotivationalText } from '../types';
import { analyzeComplexError } from '../services/geminiService';

interface DailyChallengeProps {
  questions: Question[];
  simulado?: Simulado | null;
  onFinish: (correctCount: number, totalPoints: number) => void;
  onCancel: () => void;
  motivationalTexts: MotivationalText[];
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ questions, simulado, onFinish, onCancel, motivationalTexts }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [activeView, setActiveView] = useState<'question' | 'context'>('question');
  const [relevantTexts, setRelevantTexts] = useState<MotivationalText[]>([]);

  useEffect(() => {
    if (simulado) {
      if (simulado.motivationalTextIds && simulado.motivationalTextIds.length > 0) {
        const texts = motivationalTexts.filter(t => simulado.motivationalTextIds!.includes(t.id));
        setRelevantTexts(texts);
      } else if (simulado.motivationalText) {
        // Handle manually created simulados with a single text
        setRelevantTexts([{
          id: 'manual_text',
          title: 'Texto de Apoio',
          content: simulado.motivationalText,
          imageBase64: simulado.motivationalImageBase64,
          sourcePdf: ''
        }]);
      } else {
        setRelevantTexts([]);
      }
    }
  }, [simulado, motivationalTexts]);

  const currentQuestion = questions[currentIdx];
  const isSimulado = !!simulado;

  const getPointsByDifficulty = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 100;
      case Difficulty.MEDIUM: return 250;
      case Difficulty.HARD: return 500;
      default: return 100;
    }
  };

  const difficultyConfig: { [key in Difficulty]?: { icon: string; color: string } } = {
    [Difficulty.MEDIUM]: { icon: '💡', color: 'text-yellow-500' },
    [Difficulty.HARD]: { icon: '🔥', color: 'text-red-500' }
  };
  const diffConfig = difficultyConfig[currentQuestion.difficulty];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setShowFeedback(true);

    const correct = selectedOption === currentQuestion.correctAnswerIndex;
    if (correct) {
      const points = getPointsByDifficulty(currentQuestion.difficulty);
      setCorrectCount(c => c + 1);
      setAccumulatedPoints(p => p + points);
    } else {
      setLoadingAi(true);
      analyzeComplexError(
        currentQuestion.enunciado,
        currentQuestion.options[selectedOption],
        currentQuestion.options[currentQuestion.correctAnswerIndex]
      ).then(explanation => {
        setAiExplanation(explanation);
        setLoadingAi(false);
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setAiExplanation(null);
      setActiveView('question');
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in zoom-in-95">
        <div className="text-7xl">🎯</div>
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-900">Sessão Finalizada</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest">{isSimulado ? 'Simulado de Elite Concluído' : 'Treino Diário Finalizado'}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Acertos</p>
             <p className="text-3xl font-black text-blue-600">{correctCount}/{questions.length}</p>
           </div>
           <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">XP Sincronizado</p>
             <p className="text-3xl font-black text-emerald-400">+{accumulatedPoints + (simulado ? simulado.rewardXP : 0)}</p>
           </div>
        </div>

        <button 
          onClick={() => onFinish(correctCount, accumulatedPoints)}
          className="w-full py-6 elite-gradient text-white rounded-2xl font-black uppercase tracking-widest shadow-xl"
        >Sincronizar com Ranking</button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button onClick={onCancel} className="text-slate-300 hover:text-red-500 transition-colors">✕</button>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">ITEM {currentIdx + 1} / {questions.length}</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {diffConfig && <span className={`${diffConfig.color} mr-1.5`}>{diffConfig.icon}</span>}
            <span>{currentQuestion.difficulty} (+{getPointsByDifficulty(currentQuestion.difficulty)} XP)</span>
          </div>
        </div>
        
        {relevantTexts.length > 0 && (
          <div className="flex bg-slate-100 p-1.5 rounded-full border border-slate-200/80">
            <button onClick={() => setActiveView('question')} className={`flex-1 px-6 py-3.5 rounded-full text-sm font-bold transition-all ${activeView === 'question' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Questão Atual</button>
            <button onClick={() => setActiveView('context')} className={`flex-1 px-6 py-3.5 rounded-full text-sm font-bold transition-all ${activeView === 'context' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Textos Motivadores</button>
          </div>
        )}

        {activeView === 'context' && relevantTexts.length > 0 ? (
          <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100 space-y-8 animate-in fade-in max-h-[70vh] overflow-y-auto">
            {relevantTexts.map((text, index) => (
              <div key={text.id + index} className="space-y-4 border-b border-slate-100 last:border-b-0 pb-6 last:pb-0">
                <h3 className="text-2xl font-black text-slate-800">{text.title}</h3>
                {text.imageBase64 && <img src={`data:image/png;base64,${text.imageBase64}`} alt={text.title} className="rounded-lg border border-slate-200" />}
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{text.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
              </div>
              
              {currentQuestion.contextText && <div className="mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Texto de Apoio</h4><p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{currentQuestion.contextText}</p></div>}
              {currentQuestion.imageBase64 && <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200"><img src={`data:image/png;base64,${currentQuestion.imageBase64}`} alt="Imagem da questão" className="rounded-lg max-w-full h-auto mx-auto" /></div>}

              <h3 className="text-2xl font-bold text-slate-800 leading-relaxed pt-4 whitespace-pre-wrap">{currentQuestion.enunciado}</h3>

              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((opt, idx) => {
                  const isCorrect = idx === currentQuestion.correctAnswerIndex;
                  const isSelected = selectedOption === idx;
                  let styles = "bg-slate-50/80 border-slate-200 hover:border-blue-300";
                  if (showFeedback) {
                    if (isCorrect) styles = "bg-emerald-50 border-emerald-500 text-emerald-900";
                    else if (isSelected) styles = "bg-rose-50 border-rose-500 text-rose-900";
                    else styles = "bg-slate-50 opacity-40";
                  } else if (isSelected) {
                    styles = "bg-blue-50 border-blue-500";
                  }
                  return (
                    <button key={idx} disabled={showFeedback} onClick={() => setSelectedOption(idx)} className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center space-x-4 ${styles}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 shrink-0 transition-colors ${isSelected && !showFeedback ? 'bg-blue-600 text-white border-transparent' : showFeedback && isCorrect ? 'bg-emerald-600 text-white border-transparent' : showFeedback && isSelected && !isCorrect ? 'bg-rose-600 text-white border-transparent' : 'bg-white border-slate-200 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showFeedback && <div className="p-8 bg-slate-900 text-white rounded-3xl animate-in slide-in-from-top-4"><p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-3">Feedback do Mestre João Lucas</p>{loadingAi ? <div className="animate-pulse space-y-2"><div className="h-2 bg-white/20 rounded w-full"></div><div className="h-2 bg-white/20 rounded w-3/4"></div></div> : <p className="text-sm font-medium leading-relaxed italic opacity-90">{aiExplanation || "Resposta correta! Mantenha a consistência."}</p>}</div>}
            </div>

            <div className="flex space-x-4">
              {!showFeedback ? <button onClick={handleSubmit} disabled={selectedOption === null} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${selectedOption === null ? 'bg-slate-100 text-slate-300' : 'elite-gradient text-white shadow-xl hover:scale-[1.02]'}`}>Confirmar Resposta</button> : <button onClick={handleNext} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">{currentIdx === questions.length - 1 ? 'Finalizar Sessão' : 'Próxima Questão'}</button>}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DailyChallenge;