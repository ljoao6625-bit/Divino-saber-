
import { Difficulty, Mission, Question, Module, User, Simulado } from './types';

export const ADMIN_CREDENTIALS = {
  email: 'ljoao6625@gmail.com',
  password: 'Joaolucas12345#'
};

// Sistema de Acesso Restrito: O Mestre deve adicionar os e-mails aqui para autorizar o acesso.
export const WHITELISTED_STUDENTS: string[] = [
  // Exemplo: 'aluno.elite@ifrn.edu.br'
];

// Plataforma "Virgem": Arrays vazios para início do zero
export const INITIAL_STUDENTS: User[] = [];
export const INITIAL_MODULES: Module[] = [];
export const INITIAL_MISSIONS: Mission[] = [];

// --- DADOS INICIAIS PARA DEMONSTRAÇÃO ---
// Para garantir que a plataforma tenha conteúdo funcional desde o primeiro acesso,
// um conjunto de questões e um simulado diagnóstico são pré-carregados.
const now = Date.now();

export const INITIAL_QUESTIONS: Question[] = [
  { id: 'mat_01', enunciado: 'Na clínica de Antônio e Fernanda, um pacote de 10 sessões para redução de medidas custa R$500,00. Como estímulo, eles devolvem ao cliente o valor de R$2,00 por cada centímetro reduzido na região da cintura. A expressão algébrica que melhor representa o custo final (y) do tratamento, em função da perda de medida (x) da cintura, em cm, é', options: ['y = 500 - 2x', 'y = 2x - 500', 'y = 500 + 2x', 'y = 500 / 2x'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['algebra', 'função'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_01', enunciado: 'Qual das seguintes palavras é um exemplo de proparoxítona?', options: ['Lâmpada', 'Caneta', 'Sutil', 'Urubu'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Português', type: 'OBJECTIVE', basePoints: 100, tags: ['acentuação', 'gramática'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_02', enunciado: 'Um terreno retangular tem 20 metros de comprimento e sua largura é 3/4 do comprimento. Qual é a área do terreno?', options: ['300 m²', '400 m²', '250 m²', '350 m²'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['geometria', 'área'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_02', enunciado: 'Na frase "O menino, que era muito esperto, resolveu o problema", o trecho "que era muito esperto" é uma oração subordinada:', options: ['Adjetiva explicativa', 'Adjetiva restritiva', 'Substantiva objetiva direta', 'Adverbial causal'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['sintaxe', 'orações'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_03', enunciado: 'Se a área de um quadrado é 64 cm², qual é o seu perímetro?', options: ['32 cm', '24 cm', '64 cm', '16 cm'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['geometria', 'perímetro'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_04', enunciado: 'Calcule a média aritmética simples dos números: 10, 20, 30, 40.', options: ['25', '20', '30', '35'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['estatística', 'média'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_05', enunciado: 'Resolva a equação de primeiro grau: 3x - 5 = 10.', options: ['x = 5', 'x = 3', 'x = 15', 'x = -5'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['equação', 'algebra'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_06', enunciado: 'Um produto custava R$ 120,00 e teve um desconto de 15%. Qual o valor do desconto?', options: ['R$ 18,00', 'R$ 15,00', 'R$ 20,00', 'R$ 12,00'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['porcentagem', 'matemática financeira'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_07', enunciado: 'Qual é a representação decimal da fração 3/5?', options: ['0,6', '0,3', '0,5', '3,5'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['frações', 'decimais'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_08', enunciado: 'Dada a função f(x) = 2x + 1, qual o valor de f(5)?', options: ['11', '10', '9', '12'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['função', 'algebra'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_09', enunciado: 'Um capital de R$ 500,00 foi aplicado a juros simples de 5% ao mês. Qual o montante após 4 meses?', options: ['R$ 600,00', 'R$ 550,00', 'R$ 700,00', 'R$ 650,00'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['juros', 'matemática financeira'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_10', enunciado: 'Em um triângulo retângulo, os catetos medem 6 cm e 8 cm. Qual a medida da hipotenusa?', options: ['10 cm', '12 cm', '14 cm', '9 cm'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['teorema de pitágoras', 'geometria'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_11', enunciado: 'Qual a área de um círculo com raio de 5 cm? (Considere π = 3,14)', options: ['78,5 cm²', '31,4 cm²', '50 cm²', '15,7 cm²'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['geometria', 'círculo'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_12', enunciado: 'Resolva o sistema: x + y = 12 e x - y = 4.', options: ['x = 8, y = 4', 'x = 7, y = 5', 'x = 9, y = 3', 'x = 6, y = 6'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['sistema de equações', 'algebra'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_13', enunciado: 'Uma urna contém 5 bolas vermelhas e 3 azuis. Qual a probabilidade de retirar uma bola azul?', options: ['3/8', '5/8', '3/5', '1/3'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['probabilidade', 'estatística'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_14', enunciado: 'Qual o volume de um cubo com aresta de 4 cm?', options: ['64 cm³', '16 cm³', '48 cm³', '12 cm³'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['geometria espacial', 'volume'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_15', enunciado: 'Se 3 torneiras enchem um tanque em 9 horas, em quanto tempo 9 torneiras encherão o mesmo tanque?', options: ['3 horas', '6 horas', '1 hora', '27 horas'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 250, tags: ['regra de três', 'proporcionalidade'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_16', enunciado: 'Qual o valor de log₂(16)?', options: ['4', '8', '2', '16'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 500, tags: ['logaritmo', 'algebra'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_17', enunciado: 'De quantas formas 5 pessoas podem se sentar em 5 cadeiras em fila?', options: ['120', '25', '5', '60'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 500, tags: ['análise combinatória', 'permutação'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_18', enunciado: 'O seno de 30° é igual ao cosseno de qual ângulo?', options: ['60°', '30°', '45°', '90°'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 500, tags: ['trigonometria', 'ângulos complementares'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_19', enunciado: 'Qual o próximo termo da progressão geométrica: 2, 6, 18, ...?', options: ['54', '36', '24', '72'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 500, tags: ['sequências', 'progressão geométrica'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_20', enunciado: 'Um avião decola, percorrendo uma trajetória retilínea, formando com o solo um ângulo de 30º. Se o avião percorreu 1000 metros, qual a altura que ele se encontra?', options: ['500 metros', '1000 metros', '866 metros', '750 metros'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 500, tags: ['trigonometria', 'triângulo retângulo'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_03', enunciado: 'Qual o sinônimo da palavra "ratificar"?', options: ['Confirmar', 'Corrigir', 'Anular', 'Questionar'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Português', type: 'OBJECTIVE', basePoints: 100, tags: ['vocabulário', 'sinônimos'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_04', enunciado: 'Qual o antônimo da palavra "efêmero"?', options: ['Duradouro', 'Rápido', 'Fraco', 'Antigo'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Português', type: 'OBJECTIVE', basePoints: 100, tags: ['vocabulário', 'antônimos'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_05', enunciado: 'Na frase "Os alunos estudaram para a prova", qual é o sujeito da oração?', options: ['Os alunos', 'estudaram', 'para a prova', 'A prova'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Português', type: 'OBJECTIVE', basePoints: 100, tags: ['sintaxe', 'sujeito'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_06', enunciado: 'Qual a conjugação correta do verbo "ver" no presente do indicativo, na primeira pessoa do plural?', options: ['Nós vemos', 'Nós vimos', 'Nós olhamos', 'Nós veem'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Português', type: 'OBJECTIVE', basePoints: 100, tags: ['verbos', 'conjugação'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_07', enunciado: 'Em "A menina inteligente passou no teste", a palavra "inteligente" é um:', options: ['Adjetivo', 'Substantivo', 'Verbo', 'Advérbio'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Português', type: 'OBJECTIVE', basePoints: 100, tags: ['morfologia', 'classes de palavras'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_08', enunciado: 'Assinale a alternativa que completa a frase corretamente: "Não sei o _______ do seu atraso."', options: ['porquê', 'por que', 'porque', 'por quê'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['ortografia', 'uso dos porquês'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_09', enunciado: 'A frase "Seus olhos são duas esmeraldas" contém qual figura de linguagem?', options: ['Metáfora', 'Hipérbole', 'Eufemismo', 'Ironia'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['figuras de linguagem', 'semântica'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_10', enunciado: 'Qual frase utiliza a vírgula corretamente?', options: ['Recife, 25 de outubro de 2024.', 'Recife 25 de outubro, de 2024.', 'Recife 25, de outubro de 2024.', 'Recife, 25 de outubro, de 2024.'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['pontuação', 'vírgula'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_11', enunciado: 'Assinale a concordância nominal INCORRETA:', options: ['É proibido entrada de estranhos.', 'Água é bom para a saúde.', 'Bastantes alunos faltaram.', 'Anexo, seguem as fotos.'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['concordância nominal', 'gramática'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_12', enunciado: 'Assinale a concordância verbal CORRETA:', options: ['Fazem dois anos que não o vejo.', 'Havia muitos problemas na cidade.', 'Existe muitas vagas na empresa.', 'Bateu três horas no relógio da sala.'], correctAnswerIndex: 1, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['concordância verbal', 'gramática'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_13', enunciado: 'Passando "O professor corrigiu a prova" para a voz passiva, temos:', options: ['A prova foi corrigida pelo professor.', 'A prova corrigiu o professor.', 'O professor foi corrigido pela prova.', 'Corrigiu-se a prova.'], correctAnswerIndex: 0, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['vozes verbais', 'sintaxe'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_14', enunciado: 'Assinale a alternativa em que o uso da crase está INCORRETO:', options: ['Fui à Bahia nas férias.', 'Ele se referia àquelas alunas.', 'O navio chegou a terra firme.', 'Entreguei o prêmio à vencedora.'], correctAnswerIndex: 2, difficulty: Difficulty.MEDIUM, subject: 'Português', type: 'OBJECTIVE', basePoints: 250, tags: ['crase', 'gramática'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_15', enunciado: 'A estrutura textual que se caracteriza pela narração de fatos em uma sequência temporal é:', options: ['Narrativa', 'Descritiva', 'Dissertativa', 'Injuntiva'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Português', type: 'OBJECTIVE', basePoints: 500, tags: ['tipologia textual', 'redação'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_16', enunciado: 'Na frase "O livro QUE li é ótimo", o "QUE" exerce a função de:', options: ['Pronome relativo', 'Conjunção integrante', 'Partícula expletiva', 'Preposição'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Português', type: 'OBJECTIVE', basePoints: 500, tags: ['sintaxe', 'pronome relativo'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_17', enunciado: 'O verso "Amor é fogo que arde sem se ver" de Camões é um exemplo de qual figura de pensamento?', options: ['Paradoxo', 'Antítese', 'Hipérbole', 'Ironia'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Português', type: 'OBJECTIVE', basePoints: 500, tags: ['figuras de linguagem', 'literatura'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_18', enunciado: 'Qual das seguintes características NÃO pertence ao Modernismo brasileiro?', options: ['Racionalismo e objetividade', 'Ruptura com o passado', 'Linguagem coloquial', 'Nacionalismo crítico'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Português', type: 'OBJECTIVE', basePoints: 500, tags: ['literatura', 'modernismo'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_19', enunciado: 'A oração "É necessário que todos estudem" é classificada como:', options: ['Subordinada Substantiva Subjetiva', 'Subordinada Adjetiva Restritiva', 'Coordenada Sindética Aditiva', 'Principal'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Português', type: 'OBJECTIVE', basePoints: 500, tags: ['sintaxe', 'orações subordinadas'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'port_20', enunciado: 'Identifique a função sintática do termo destacado em "A cidade foi cercada DE INIMIGOS".', options: ['Agente da passiva', 'Objeto indireto', 'Complemento nominal', 'Adjunto adnominal'], correctAnswerIndex: 0, difficulty: Difficulty.HARD, subject: 'Português', type: 'OBJECTIVE', basePoints: 500, tags: ['sintaxe', 'termos da oração'], timesUsed: 0, createdAt: now, year: '2023', sourcePdf: 'Banco Inicial' },
  { id: 'mat_21', enunciado: 'Uma loja vende um produto por R$ 250,00 à vista ou em 5 parcelas de R$ 60,00. Qual a diferença, em reais, entre o valor total a prazo e o valor à vista?', options: ['R$ 50,00', 'R$ 60,00', 'R$ 25,00', 'R$ 300,00'], correctAnswerIndex: 0, difficulty: Difficulty.EASY, subject: 'Matemática', type: 'OBJECTIVE', basePoints: 100, tags: ['matemática financeira', 'cálculo'], timesUsed: 0, createdAt: now, year: '2024', sourcePdf: 'Banco Inicial' },
];

const allQuestionIds = INITIAL_QUESTIONS.map(q => q.id);

export const INITIAL_SIMULADOS: Simulado[] = [
  {
    id: 'sim_oficial_03',
    title: 'Simulado 3',
    description: 'Avaliação completa com 40 questões para simular o dia da prova.',
    questionIds: allQuestionIds.slice(0, 40),
    durationMinutes: 80,
    createdAt: Date.now() + 2000,
    rewardXP: 2500,
  },
  {
    id: 'sim_inicial_01',
    title: 'Simulado Diagnóstico I',
    description: 'Avaliação completa com 40 questões para medir seu conhecimento base.',
    questionIds: ['mat_01', 'port_01', 'mat_02', 'port_02', 'mat_03', 'mat_04', 'mat_05', 'mat_06', 'mat_07', 'mat_08', 'mat_09', 'mat_10', 'mat_11', 'mat_12', 'mat_13', 'mat_14', 'mat_15', 'mat_16', 'mat_17', 'mat_18', 'mat_19', 'mat_20', 'port_03', 'port_04', 'port_05', 'port_06', 'port_07', 'port_08', 'port_09', 'port_10', 'port_11', 'port_12', 'port_13', 'port_14', 'port_15', 'port_16', 'port_17', 'port_18', 'port_19', 'port_20'],
    durationMinutes: 80,
    createdAt: Date.now(),
    rewardXP: 2000,
    motivationalText: 'Este é o seu primeiro passo na jornada Elite. Dê o seu melhor e vamos identificar seus pontos fortes!'
  },
  {
    id: 'sim_revisao_01',
    title: 'Simulado de Revisão - Português',
    description: 'Avaliação focada em Português para reforçar os conceitos-chave.',
    questionIds: ['port_01', 'port_02', 'port_03', 'port_04', 'port_05', 'port_06', 'port_07', 'port_08', 'port_09', 'port_10', 'port_11', 'port_12', 'port_13', 'port_14', 'port_15', 'port_16', 'port_17', 'port_18', 'port_19', 'port_20'],
    durationMinutes: 40,
    createdAt: Date.now() + 1000,
    rewardXP: 1500,
    motivationalText: 'Concentre-se e mostre seu domínio da língua portuguesa. Cada questão é uma oportunidade de brilhar!'
  }
];
