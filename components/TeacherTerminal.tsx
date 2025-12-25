import React, { useState, useEffect, useRef } from 'react';
import { User, Question } from '../types';

interface TeacherTerminalProps {
  students: User[];
  questions: Question[];
}

const TeacherTerminal: React.FC<TeacherTerminalProps> = ({ students, questions }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>(['Divino Saber Elite OS [Versão 1.0]', '© 2024. Todos os direitos reservados.', 'Digite "ajuda" para ver a lista de comandos.']);
  const [loading, setLoading] = useState(false);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const executeCommand = (cmd: string) => {
    const newOutput = [...output, `> ${cmd}`];
    setOutput(newOutput);
    setLoading(true);

    const [commandName, ...args] = cmd.trim().toLowerCase().split(' ');
    let result = '';

    switch (commandName) {
      case 'ajuda':
        result = `Comandos disponíveis:\n  - ajuda: Mostra esta lista.\n  - listar alunos: Exibe todos os alunos cadastrados.\n  - status: Mostra o status geral da plataforma.\n  - limpar: Limpa o terminal.`;
        break;
      case 'listar':
        if (args[0] === 'alunos') {
          result = `Total de Alunos: ${students.length}\n` + (students.length > 0 ? students.map(s => `  - ID: ${s.id.substring(0,10)}, Nome: ${s.name}, Email: ${s.email}`).join('\n') : '  Nenhum aluno encontrado.');
        } else {
          result = `Argumento inválido para "listar". Use "listar alunos".`;
        }
        break;
      case 'status':
        result = `Status da Plataforma:\n  - Alunos Ativos: ${students.length}\n  - Questões no Banco: ${questions.length}\n  - Sincronização: ATIVA`;
        break;
      case 'limpar':
        setOutput(['Terminal reiniciado. Digite "ajuda" para ver os comandos.']);
        setLoading(false);
        setCommand('');
        return;
      default:
        result = `Comando não reconhecido: "${cmd}". Digite "ajuda".`;
    }
    
    setTimeout(() => {
        setOutput(prev => [...prev, result]);
        setLoading(false);
    }, 300);

    setCommand('');
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() === '' || loading) return;
    executeCommand(command);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
       <div className="space-y-2">
         <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Acesso de Mestre Nível 9</p>
         <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Terminal do Mestre</h2>
         <p className="text-slate-400 font-medium">Interface de comando para gerenciamento avançado e operações de IA.</p>
       </div>
       <div className="bg-slate-900 rounded-3xl p-6 h-[70vh] flex flex-col font-mono text-sm shadow-2xl text-slate-300">
         <div className="flex-1 overflow-y-auto pr-4">
           {output.map((line, index) => (
             <p key={index} className="whitespace-pre-wrap leading-relaxed">
               {line}
             </p>
           ))}
           {loading && <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin mt-2"></div>}
           <div ref={outputEndRef} />
         </div>
         <form onSubmit={handleCommandSubmit} className="flex items-center space-x-4 pt-4 border-t border-slate-700">
           <span className="text-emerald-400 font-bold">{'>'}</span>
           <input
             type="text"
             value={command}
             onChange={(e) => setCommand(e.target.value)}
             className="flex-1 bg-transparent text-white outline-none w-full"
             placeholder="Digite um comando..."
             disabled={loading}
             autoFocus
           />
         </form>
       </div>
    </div>
  );
};

export default TeacherTerminal;
