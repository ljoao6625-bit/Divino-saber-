import React, { useState } from 'react';
import { Module, Question, Difficulty, Subject } from '../types';

interface TeacherDashboardProps {
  modules: Module[];
  onAddQuestion: (q: Question) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ modules, onAddQuestion }) => {
  const [activeTab, setActiveTab] = useState<'question' | 'summary' | 'video'>('question');

  // Question Form State
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState(0);
  const [qDifficulty, setQDifficulty] = useState(Difficulty.MEDIUM);
  const [qModule, setQModule] = useState(modules[0]?.id || '');

  const handleAddQuestion = () => {
    if (!qText || qOptions.some(o => !o)) return;

    // Cálculo de pontos base baseado na dificuldade
    let base = 100;
    if (qDifficulty === Difficulty.MEDIUM) base = 250;
    if (qDifficulty === Difficulty.HARD) base = 500;

    const subject = (modules.find(m => m.id === qModule)?.subject as Subject) || 'Geral';

    // FIX: The Question object was not matching the `Question` type from `types.ts`.
    // Corrected `text` to `enunciado`, removed invalid property `moduleId`, and added required properties
    // like `tags`, `timesUsed`, and `createdAt` to ensure type compatibility.
    const newQ: Question = {
      id: Math.random().toString(36).substr(2, 9),
      enunciado: qText,
      options: qOptions,
      correctAnswerIndex: qCorrect,
      difficulty: qDifficulty,
      subject: subject,
      type: 'OBJECTIVE',
      basePoints: base,
      tags: [subject.toLowerCase(), qDifficulty.toLowerCase()],
      timesUsed: 0,
      createdAt: Date.now(),
    };
    onAddQuestion(newQ);
    setQText('');
    setQOptions(['', '', '', '']);
    alert('Questão adicionada com sucesso!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gerenciar Conteúdo</h2>
      </div>

      {/* Internal Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('question')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'question' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
        >
          Questão
        </button>
        <button 
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'summary' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
        >
          Resumo
        </button>
        <button 
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'video' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
        >
          Vídeo
        </button>
      </div>

      {activeTab === 'question' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Enunciado</label>
            <textarea 
              value={qText}
              onChange={e => setQText(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-sm" 
              placeholder="Digite a pergunta..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Alternativas</label>
            {qOptions.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name="correct" 
                  checked={qCorrect === idx}
                  onChange={() => setQCorrect(idx)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <input 
                  type="text"
                  value={opt}
                  onChange={e => {
                    const newOpts = [...qOptions];
                    newOpts[idx] = e.target.value;
                    setQOptions(newOpts);
                  }}
                  className="flex-1 p-2 bg-gray-50 rounded-lg border-0 text-sm"
                  placeholder={`Opção ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Dificuldade</label>
              <select 
                value={qDifficulty}
                onChange={e => setQDifficulty(e.target.value as Difficulty)}
                className="w-full p-2 bg-gray-50 rounded-lg border-0 text-sm"
              >
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Módulo</label>
              <select 
                value={qModule}
                onChange={e => setQModule(e.target.value)}
                className="w-full p-2 bg-gray-50 rounded-lg border-0 text-sm"
              >
                {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={handleAddQuestion}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100"
          >
            Salvar Questão
          </button>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center py-20 space-y-4 shadow-sm">
          <div className="text-4xl">📝</div>
          <p className="text-gray-500 text-sm">Editor de Markdown em breve.</p>
          <button disabled className="bg-gray-100 text-gray-400 px-6 py-2 rounded-xl font-bold text-sm">Criar Resumo</button>
        </div>
      )}

      {activeTab === 'video' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center py-20 space-y-4 shadow-sm">
          <div className="text-4xl">🎥</div>
          <p className="text-gray-500 text-sm">Integração com YouTube/Vimeo em breve.</p>
          <button disabled className="bg-gray-100 text-gray-400 px-6 py-2 rounded-xl font-bold text-sm">Subir Vídeo</button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;