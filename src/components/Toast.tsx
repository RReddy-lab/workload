import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-lg border shadow-lg flex items-start justify-between gap-3 animate-slide-up transition-all ${
            toast.type === 'success'
              ? 'bg-[#152A20] text-[#FAF7F2] border-[#C5A059]'
              : toast.type === 'warning'
              ? 'bg-[#4A101E] text-[#FAF7F2] border-[#85223A]'
              : 'bg-[#FAF7F2] text-[#152A20] border-[#C5A059]'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
            )}
            {toast.type === 'warning' && (
              <AlertTriangle className="w-5 h-5 text-[#E4CA92] flex-shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-serif-playfair text-xs font-semibold tracking-wide">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-[11px] opacity-90 font-serif-cormorant text-sm mt-0.5">
                  {toast.description}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/60 hover:text-white text-xs cursor-pointer p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
