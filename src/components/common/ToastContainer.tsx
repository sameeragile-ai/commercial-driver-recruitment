import React from 'react';
import { useStore } from '../../store/useStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-[#2563EB] shrink-0" strokeWidth={1.5} />;
        let borderColor = 'border-[#ECEAE4]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-[#0E7C7B] shrink-0" strokeWidth={1.5} />;
          borderColor = 'border-[#0E7C7B]/30';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-[#F5A524] shrink-0" strokeWidth={1.5} />;
          borderColor = 'border-[#F5A524]/40';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" strokeWidth={1.5} />;
          borderColor = 'border-[#DC2626]/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 bg-white p-3.5 rounded-xl border ${borderColor} shadow-lg shadow-black/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#14161A] font-heading">{toast.title}</h4>
              <p className="text-xs text-[#5B616B] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9AA0A8] hover:text-[#14161A] p-0.5 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
