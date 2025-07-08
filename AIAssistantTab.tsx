// components/AIAssistantTab.tsx

import React, { useState, useEffect } from 'react';
import { AppTranslations } from '../types';
import { customerQueryService, CustomerQuery } from '../services/customerQueryService';
import { generateQueryAnswer } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { CopyIcon, CheckIcon } from './common/Icons';

interface QueryState {
  query: CustomerQuery;
  answer: string;
  isLoading: boolean;
  isCopied: boolean;
}

type AIAssistantTabProps = {
  t: AppTranslations;
};

export function AIAssistantTab({ t }: AIAssistantTabProps) {
  const [queries, setQueries] = useState<QueryState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const fetchedQueries = await customerQueryService.getQueries();
        const initialState: QueryState[] = fetchedQueries.map(q => ({
          query: q,
          answer: '',
          isLoading: false,
          isCopied: false,
        }));
        setQueries(initialState);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.errorUnknown);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueries();
  }, [t.errorUnknown]);

  const handleGenerateAnswer = async (queryId: string) => {
    const queryIndex = queries.findIndex(q => q.query.id === queryId);
    if (queryIndex === -1) return;

    // Set loading state for the specific query
    setQueries(prev => prev.map(q => q.query.id === queryId ? { ...q, isLoading: true, error: null } : q));

    try {
      const question = queries[queryIndex].query.question;
      const generatedAnswer = await generateQueryAnswer(question);
      setQueries(prev => prev.map(q => q.query.id === queryId ? { ...q, answer: generatedAnswer, isLoading: false } : q));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t.errorUnknown;
      setQueries(prev => prev.map(q => q.query.id === queryId ? { ...q, isLoading: false, answer: `Error: ${errorMessage}` } : q));
    }
  };
  
  const handleCopy = (text: string, queryId: string) => {
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
          setQueries(qs => qs.map(q => q.query.id === queryId ? {...q, isCopied: true} : q));
          setTimeout(() => {
              setQueries(qs => qs.map(q => q.query.id === queryId ? {...q, isCopied: false} : q));
          }, 2000);
      });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-red-400 text-center">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-heading font-bold text-brand-light">{t.aiAssistantTitle}</h3>
        <p className="text-brand-slate mt-1 max-w-2xl mx-auto">{t.aiAssistantDescription}</p>
      </div>

      <div className="space-y-6">
        {queries.map(({ query, answer, isLoading, isCopied }) => (
          <div key={query.id} className="bg-brand-dark/60 p-6 rounded-lg shadow-neumorphic-inner border border-brand-light-accent/10">
            <div>
              <label className="block text-sm font-bold uppercase text-brand-slate tracking-wider">{t.customerQuestion}</label>
              <p className="mt-2 p-4 bg-brand-dark rounded-md text-brand-light font-serif italic">{query.question}</p>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-bold uppercase text-brand-slate tracking-wider">{t.aiGeneratedAnswer}</label>
              <div className="relative mt-2">
                <textarea
                  readOnly
                  value={answer}
                  placeholder={isLoading ? '' : 'AI answer will appear here...'}
                  className="w-full h-32 p-4 bg-brand-dark rounded-md text-brand-light resize-y shadow-neumorphic-inner"
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner text={t.generatingAnswer} />
                  </div>
                )}
                 <button 
                  onClick={() => handleCopy(answer, query.id)}
                  className="absolute top-3 right-3 p-2 rounded-full text-brand-slate bg-brand-dark-accent hover:text-brand-light hover:bg-brand-light-accent/20 transition-colors"
                  aria-label={t.copyAnswer}
                  disabled={!answer || isLoading}
                >
                  {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => handleGenerateAnswer(query.id)}
                disabled={isLoading}
                className="bg-brand-accent text-brand-dark font-bold py-2 px-5 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neumorphic-outer active:shadow-neumorphic-press"
              >
                <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.generateAnswer}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
