import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ غير متوقع',
  message = 'تعذر تحميل أو معالجة البيانات، يرجى إعادة المحاولة لاحقاً.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-8 md:p-12 text-center flex flex-col items-center justify-center border border-rose-200 bg-rose-50/50 rounded-2xl ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-rose-900">{title}</h3>
      <p className="text-xs text-rose-700 max-w-sm mt-1 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة المحاولة</span>
        </button>
      )}
    </div>
  );
};
