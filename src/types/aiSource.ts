/**
 * De onde veio uma resposta do tutor: do Gemini ou do gerador local de reserva (quando a IA
 * falha ou não está configurada). A tela mostra a diferença — antes a troca era silenciosa.
 */
export type AiResponseSource = 'gemini' | 'local';
