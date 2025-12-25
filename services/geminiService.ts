
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Inicialização centralizada para garantir o uso da chave atualizada
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 1. Thinking Mode: Análise Complexa de Erros
 * Modelo: gemini-3-pro-preview
 */
export const analyzeComplexError = async (question: string, userAnswer: string, correctAnswer: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `O aluno errou uma questão de elite do IFRN. 
      Questão: ${question}
      Resposta do Aluno: ${userAnswer}
      Resposta Correta: ${correctAnswer}
      
      Forneça uma explicação pedagógica de alto nível, decompondo o raciocínio.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    return response.text || "Análise indisponível no momento.";
  } catch (error) {
    console.error("Thinking Mode Error:", error);
    return "Ocorreu um erro na análise profunda. Tente novamente.";
  }
};

/**
 * 2. Search Grounding: Informações em Tempo Real do IFRN
 * Modelo: gemini-3-flash-preview
 */
export const getLatestIFRNInfo = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Pesquisise informações atualizadas sobre: ${query}. Foco em datas de exames, editais e polos do IFRN.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      text: response.text || "Sem resultados de busca.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    return { text: "Não foi possível conectar à rede de busca agora.", sources: [] };
  }
};

/**
 * 3. IA PDF Gerador: Geração de Questões a partir de Texto
 * Modelo: gemini-3-pro-preview
 */
export const generateQuestionsFromPdfText = async (text: string): Promise<any[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `**Contexto:** Você é um assistente de IA especialista em pedagogia para o preparatório IFRN, parte da plataforma "Divino Saber Elite".
      **Tarefa:** Analise o texto extraído de um material de estudo. Sua missão é gerar 5 questões de múltipla escolha de alta qualidade, no mesmo estilo e nível de dificuldade da banca examinadora do IFRN.
      **Texto para Análise:**
      ---
      ${text.substring(0, 30000)} 
      ---
      **Requisitos de Saída:**
      1.  As questões devem ter 4 alternativas cada.
      2.  O resultado DEVE ser um array JSON válido que corresponda EXATAMENTE ao schema fornecido.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: 'O enunciado completo da questão.' },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: 'Um array contendo exatamente 4 alternativas de texto.'
              },
              correctAnswerIndex: { type: Type.INTEGER, description: 'O índice (0-3) da resposta correta.' },
              subject: { type: Type.STRING, description: 'A disciplina principal (ex: "Matemática").' }
            },
            required: ['text', 'options', 'correctAnswerIndex', 'subject']
          }
        }
      }
    });
    
    const jsonStr = response.text;
    if (!jsonStr) return [];
    
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("A IA não conseguiu processar o PDF. O texto pode ser muito curto, uma imagem ou o formato é incompatível.");
    return [];
  }
};

/**
 * 4. IA Leitor de Provas: Extração Holística de Provas (Textos + Questões)
 * Modelo: gemini-3-pro-preview (multimodal)
 */
export const extractExamDataFromPdf = async (pages: { imageData: string }[], fullText: string): Promise<any> => {
  const ai = getAI();
  const imageParts = pages.map(page => ({
    inlineData: { mimeType: 'image/jpeg', data: page.imageData }
  }));

  const textPrompt = {
    text: `
    Você é um especialista absoluto em provas do IFRN. Sua missão é extrair **ABSOLUTAMENTE TODAS** as questões de uma prova em PDF com 100% de fidelidade. Forneço o texto completo extraído do documento e as imagens de cada página.

    **SUA TAREFA PRINCIPAL:** Use o texto fornecido como a fonte primária da verdade. Use as imagens para entender o layout, associar imagens às questões corretas e corrigir possíveis erros de formatação do texto extraído. A extração deve ser completa e sem edições. Se o PDF contém 40 questões, o JSON de saída deve conter 40 itens no array 'questoes'. Não omita, resuma ou altere nenhuma questão ou alternativa.

    **TEXTO COMPLETO EXTRAÍDO:**
    ---
    ${fullText}
    ---
    
    **INSTRUÇÕES DE EXTRAÇÃO:** Extraia e estruture TUDO em JSON rigoroso com as seguintes partes:
    {
      "textos_motivadores": [{"titulo": "...", "conteudo": "..."}],
      "questoes": [{"text": "...", "options": ["..."], "correctAnswerIndex": 0, "subject": "Português" ou "Matemática", "difficulty": "Fácil" ou "Médio" ou "Difícil", "usesMotivationalText": true ou false, "imageBase64": "...", "contextText": "..."}]
    }
    REGRAS CRÍTICAS E OBRIGATÓRIAS:
    - Extraia **TODAS** as questões, sem exceção.
    - Identifique corretamente as disciplinas.
    - Detecte textos motivadores no início. Se uma questão depender de um texto, marque "usesMotivationalText": true.
    - Preserve 100% do texto original do enunciado e das alternativas.
    - Se uma questão contiver uma imagem, extraia-a como uma string base64.
    - Retorne SOMENTE o JSON válido, aderindo estritamente ao schema.
    `
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts: [textPrompt, ...imageParts] },
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            textos_motivadores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  conteudo: { type: Type.STRING },
                },
                required: ['titulo', 'conteudo'],
              }
            },
            questoes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.INTEGER },
                  subject: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  contextText: { type: Type.STRING },
                  imageBase64: { type: Type.STRING },
                  usesMotivationalText: { type: Type.BOOLEAN }
                },
                required: ["text", "options", "correctAnswerIndex", "subject", "difficulty"]
              }
            }
          },
          required: ['textos_motivadores', 'questoes']
        }
      }
    });

    if (response.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      throw new Error("A resposta da IA foi truncada. Tente um PDF menor.");
    }

    const jsonStr = response.text;
    return jsonStr ? JSON.parse(jsonStr.trim()) : { textos_motivadores: [], questoes: [] };

  } catch (error) {
    console.error("Exam extraction error:", error);
    let alertMessage = "A IA não conseguiu ler a prova. Verifique se o PDF é válido, contém texto e imagens claras, ou se não é muito grande.";
    if (error instanceof Error && error.message.includes("truncada")) {
        alertMessage = error.message;
    } else if (error instanceof SyntaxError) {
        alertMessage = "A IA retornou um formato de dados inválido. Isso pode acontecer com PDFs complexos. Por favor, tente novamente ou com outro arquivo.";
    }
    alert(alertMessage);
    return { textos_motivadores: [], questoes: [] };
  }
};


/**
 * 5. Text-to-Speech: Narrador de Explicações
 * Modelo: gemini-2.5-flash-preview-tts
 */
export const speakExplanation = async (text: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Explique de forma clara e concisa: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A calm, knowledgeable voice
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS generation error:", error);
    return null;
  }
};

/**
 * 6. Text-to-Speech: Narrador de Missões de Áudio
 * Modelo: gemini-2.5-flash-preview-tts
 */
export const generateAudioSummary = async (text: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Narre o seguinte texto de forma clara e envolvente para um estudante se preparando para um exame: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Audio Summary generation error:", error);
    return null;
  }
};


/**
 * Utilitário de Áudio: Decodifica o áudio PCM base64 da API para um AudioBuffer
 * Esta função é centralizada para garantir performance e consistência.
 */
export const decodeAudioToBuffer = async (base64: string, ctx: AudioContext): Promise<AudioBuffer> => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};
