import React, { useEffect } from 'react';
import { useEventContext } from '../../context/EventContext';
import { Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { activeToast, clearToast } = useEventContext();

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 4500);
    return () => clearTimeout(timer);
  }, [activeToast, clearToast]);

  if (!activeToast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 border border-blue-500/40 text-slate-100 p-4 rounded-xl shadow-2xl flex items-start gap-3 backdrop-blur bg-slate-900/95 animate-in slide-in-from-bottom-5 duration-200"
    >
      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">{activeToast}</div>
      <button
        onClick={clearToast}
        aria-label="Dismiss message"
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
