import React, { useState } from 'react';
import { Exercise } from '../types/exercise';
import {
  requestTutorDialog,
  requestLineByLineExplanation,
  CodeExplanationResponse,
} from '../services/aiHint';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
  currentAssembledCode: string;
  hasSolutionRevealed?: boolean;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  exercise,
  currentAssembledCode,
  hasSolutionRevealed = false,
}) => {
  const [activeTab, setActiveTab] = useState<'dialog' | 'explain_code'>('dialog');

  // Dialog State
  const [userUnderstanding, setUserUnderstanding] = useState<string>('');
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);
  const [tutorAnswer, setTutorAnswer] = useState<string | null>(null);

  // Line by line state
  const [explainLoading, setExplainLoading] = useState<boolean>(false);
  const [codeToExplain, setCodeToExplain] = useState<'current' | 'solution'>('current');
  const [explanationData, setExplanationData] = useState<CodeExplanationResponse | null>(null);

  if (!isOpen) return null;

  const codeUnderInspection =
    codeToExplain === 'solution' && exercise.solutionCode
      ? exercise.solutionCode
      : currentAssembledCode || exercise.templateCode;

  // Handle asking tutor about understanding / statement
  const handleAskTutor = async (customPrompt?: string, dialogType?: 'doubt' | 'statement_help' | 'check_logic' | 'syntax_help' | 'next_step') => {
    const textToSend = customPrompt || userUnderstanding;
    if (!textToSend.trim() && dialogType !== 'statement_help') {
      return;
    }

    setDialogLoading(true);
    setTutorAnswer(null);

    const res = await requestTutorDialog({
      exercise,
      currentCode: currentAssembledCode,
      userStatement: textToSend,
      dialogType: dialogType || (textToSend.toLowerCase().includes('não entendi o enunciado') ? 'statement_help' : 'doubt'),
    });

    setDialogLoading(false);
    if (res.response) {
      setTutorAnswer(res.response);
    }
  };

  // Quick chips trigger
  const handleSelectQuickChip = (prompt: string, type: 'statement_help' | 'check_logic' | 'syntax_help' | 'next_step') => {
    setUserUnderstanding(prompt);
    handleAskTutor(prompt, type);
  };

  // Handle requesting line-by-line explanation
  const handleFetchLineExplanation = async (target: 'current' | 'solution') => {
    setCodeToExplain(target);
    setExplainLoading(true);
    setExplanationData(null);

    const code =
      target === 'solution' && exercise.solutionCode
        ? exercise.solutionCode
        : currentAssembledCode || exercise.templateCode;

    const res = await requestLineByLineExplanation(exercise, code);
    setExplainLoading(false);
    setExplanationData(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">Tutor IA DevPrática</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {exercise.language.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {exercise.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Alinhe seu raciocínio pedagógico e entenda cada linha do código sem perder a prática.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={() => setActiveTab('dialog')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'dialog'
                ? 'border-indigo-500 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>💬 Tirar Dúvidas & Alinhar Raciocínio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('explain_code');
              if (!explanationData && !explainLoading) {
                handleFetchLineExplanation('current');
              }
            }}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'explain_code'
                ? 'border-indigo-500 text-indigo-300 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>🔍 Explicar Código Linha a Linha</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200 text-xs">
          {activeTab === 'dialog' ? (
            <div className="space-y-4">
              {/* Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Escolha um atalho rápido ou digite sua dúvida:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectQuickChip(
                        'Não entendi o que o enunciado está pedindo. Pode me explicar de uma forma mais simples com um exemplo prático?',
                        'statement_help'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>❓ Não entendi o enunciado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSelectQuickChip(
                        'Quero saber se o que eu fiz até agora faz sentido ou se estou esquecendo de alguma regra fundamental.',
                        'check_logic'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🧠 Minha lógica está no rumo certo?</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSelectQuickChip(
                        'Existe algum erro de sintaxe, tipos ou pontuação nas linhas que eu montei até agora?',
                        'syntax_help'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>⚡ Ajuda com sintaxe ou erros</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSelectQuickChip(
                        'Qual deve ser o meu próximo passo sem me dar a resposta pronta?',
                        'next_step'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🎯 Próximo passo recomendado</span>
                  </button>
                </div>
              </div>

              {/* User text area */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Fale o que você entendeu até o momento ou detalhe sua dúvida:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={userUnderstanding}
                    onChange={e => setUserUnderstanding(e.target.value)}
                    placeholder="Ex: Eu entendi que a função deve subtrair o desconto, mas não tenho certeza de como converter a porcentagem em decimal no PHP..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans resize-none"
                  />
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      💡 Dica: O tutor analisa o seu código atual e responde pedagogicamente sem entregar a resposta de bandeja.
                    </span>
                    <button
                      type="button"
                      disabled={dialogLoading || !userUnderstanding.trim()}
                      onClick={() => handleAskTutor()}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {dialogLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Pensando...</span>
                        </>
                      ) : (
                        <>
                          <span>Perguntar ao Tutor</span>
                          <span>💬</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tutor Response Box */}
              {dialogLoading && (
                <div className="rounded-xl border border-indigo-900/60 bg-indigo-950/20 p-5 space-y-3 animate-pulse">
                  <div className="flex items-center gap-2.5 text-indigo-300 font-medium">
                    <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>O Tutor IA está analisando sua mensagem e o código do exercício...</span>
                  </div>
                  <div className="h-3 bg-indigo-900/40 rounded w-3/4" />
                  <div className="h-3 bg-indigo-900/40 rounded w-1/2" />
                </div>
              )}

              {tutorAnswer && !dialogLoading && (
                <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-5 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                      <span>✨ Orientação do Tutor IA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserUnderstanding('');
                        setTutorAnswer(null);
                      }}
                      className="text-[11px] text-slate-400 hover:text-white transition-colors"
                    >
                      Limpar conversa
                    </button>
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-2">
                    {tutorAnswer}
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('explain_code');
                        if (!explanationData) {
                          handleFetchLineExplanation('current');
                        }
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>Quer ver a explicação de cada linha do seu código?</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* LINE-BY-LINE EXPLANATION TAB */
            <div className="space-y-4">
              {/* Target Code Selector and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleFetchLineExplanation('current')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      codeToExplain === 'current'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Meu Código Atual
                  </button>

                  {hasSolutionRevealed && (
                    <button
                      type="button"
                      onClick={() => handleFetchLineExplanation('solution')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        codeToExplain === 'solution'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      Código da Solução Completa
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  disabled={explainLoading}
                  onClick={() => handleFetchLineExplanation(codeToExplain)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {explainLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      <span>Analisando linhas...</span>
                    </>
                  ) : (
                    <>
                      <span>🔄 Atualizar Explicação</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code preview snippet */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-[11px]">
                <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-[10px] flex items-center justify-between">
                  <span>Código sob análise ({codeToExplain === 'solution' ? 'Solução' : 'Sua tentativa'})</span>
                  <span className="uppercase text-indigo-400">{exercise.language}</span>
                </div>
                <div className="p-3 text-slate-300 max-h-36 overflow-y-auto leading-relaxed whitespace-pre font-mono">
                  {codeUnderInspection}
                </div>
              </div>

              {/* Explanation Loading */}
              {explainLoading && (
                <div className="rounded-xl border border-indigo-900/60 bg-indigo-950/20 p-6 space-y-3 text-center">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-indigo-200 font-medium">
                    Dissecando cada linha de código, sintaxe e objetivos práticos...
                  </p>
                </div>
              )}

              {/* Explanation List */}
              {explanationData && !explainLoading && (
                <div className="space-y-3">
                  {/* Summary */}
                  {explanationData.summary && (
                    <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-200 text-xs leading-relaxed">
                      <span className="font-bold text-white block mb-0.5">📌 Visão Geral da Lógica:</span>
                      {explanationData.summary}
                    </div>
                  )}

                  {/* List of lines */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Detalhamento Linha a Linha:
                    </span>

                    {explanationData.lines.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                      >
                        {/* Line Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                              Linha {item.line}
                            </span>
                            <code className="font-mono text-xs text-emerald-300 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40">
                              {item.code}
                            </code>
                          </div>
                        </div>

                        {/* Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                            <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                              <span className="text-sky-400">🏷️</span> O que é (Sintaxe):
                            </span>
                            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
                              {item.explanation}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                            <span className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                              <span className="text-emerald-400">🎯</span> Para que serve na prática:
                            </span>
                            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
                              {item.purpose}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Best Practices */}
                  {explanationData.bestPractices && explanationData.bestPractices.length > 0 && (
                    <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                        <span>💡</span> Boas Práticas & Dicas do Sênior:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                        {explanationData.bestPractices.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-900/90 text-xs text-slate-400">
          <span>DevPrática IA • Mentor de Estudos em PHP & JS</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
