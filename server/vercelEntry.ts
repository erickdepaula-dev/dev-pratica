/**
 * Ponto de entrada da função serverless da Vercel. Um app Express é um handler
 * (req, res) válido para o runtime Node da Vercel; as rotas continuam em /api/gemini/*.
 * Empacotado por scripts/build-vercel.mjs em .vercel/output/functions/api.func.
 */
import { createApiApp } from './apiApp';

export default createApiApp();
