import type { AiOffMessage } from '../types/aiSource';

/**
 * Interruptor da IA (Gemini). Desligada por padrão — decisão do usuário em 2026-11-19, para
 * abrir o app para amigos sem custo. Para religar: VITE_AI_ENABLED=true (no .env local ou nas
 * Environment Variables da Vercel) + novo deploy, e uma GEMINI_API_KEY válida no servidor
 * (conferir em /api/gemini/status).
 */
export const AI_ENABLED: boolean = import.meta.env.VITE_AI_ENABLED === 'true';

const AI_OFF_EVENT = 'devpratica:ia-desligada';

/** Pede ao app para mostrar o aviso de "IA desligada" (a janela fica no App, ouvindo o evento). */
export function showAiDisabled(): void {
  window.dispatchEvent(new Event(AI_OFF_EVENT));
}

export function onAiDisabledRequest(handler: () => void): () => void {
  window.addEventListener(AI_OFF_EVENT, handler);
  return () => window.removeEventListener(AI_OFF_EVENT, handler);
}

/**
 * Mensagens em ordem de insistência: a 1ª explica, a 2ª provoca, da 3ª em diante sorteia.
 * Tom de brincadeira entre amigos, sem ofender.
 */
export const AI_OFF_MESSAGES: { first: AiOffMessage; second: AiOffMessage; more: AiOffMessage[] } = {
  first: {
    title: 'A IA está de folga 🏖️',
    body: 'Nesta versão a IA está desligada: cada pergunta custa dinheiro, e o dono do app é pão-duro (com orgulho). Mas o cérebro mais potente da sala continua ligado: o seu.',
  },
  second: {
    title: 'Você não tem jeito, né? 😅',
    body: 'Eu avisei que a IA estava desligada… e você achou mesmo que eu ia gastar dinheiro com isso? Volta pro código, que o exercício não se resolve sozinho.',
  },
  more: [
    {
      title: 'Erro 402: falta de verba 💸',
      body: 'O servidor da IA foi trocado por um cofrinho. Ele ainda está vazio. Pode clicar quantas vezes quiser: o cofrinho não enche.',
    },
    {
      title: 'Insistência nível hacker de filme 🕶️',
      body: 'Clicar mais forte não liga a IA. Digitar rápido com cara séria também não. Agora, resolver o exercício… isso funciona.',
    },
    {
      title: 'A IA pediu demissão ☕',
      body: 'Ela foi tomar um café, gostou e não voltou mais. Quem continua no plantão é você — e, olha, você está indo bem.',
    },
    {
      title: 'Plot twist: a IA era você o tempo todo 🤯',
      body: 'Inteligência: sua. Artificial: nada. Pode confiar no processador entre as suas orelhas.',
    },
  ],
};
