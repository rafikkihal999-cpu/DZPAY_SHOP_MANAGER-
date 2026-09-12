import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'جاري التحميل ومعالجة البيانات...',
  className = '',
}) => {
  return (
    <div
      className={`p-10 flex flex-col items-center justify-center text-center space-y-3 ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-600">{message}</p>
    </div>
  );
};
