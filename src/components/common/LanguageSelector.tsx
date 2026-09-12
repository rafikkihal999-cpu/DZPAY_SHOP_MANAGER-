import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'cards' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { language, setLanguage, languages, currentLanguageInfo, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle language switch
  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // 1. Cards Variant for SettingsView
  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className}`}>
        {languages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              id={`language-option-${lang.code}`}
              onClick={() => handleSelect(lang.code)}
              className={`p-4 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#0f1d3c]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {lang.nativeName}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang.name}
                      </span>
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                <span>{lang.dir === 'rtl' ? t('lang_rtl_badge', 'من اليمين لليسار (RTL)') : t('lang_ltr_badge', 'من اليسار لليمين (LTR)')}</span>
                <span className="uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {lang.code}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Navbar Variant with Dropdown Menu
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id="navbar-language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-[#132247] hover:bg-slate-100 dark:hover:bg-[#1a2f60] text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
        title={t('language_btn', 'اللغة')}
        aria-label="تغيير لغة التطبيق"
      >
        <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="text-sm">{currentLanguageInfo.flag}</span>
        <span className="hidden sm:inline text-[11px] font-bold">
          {currentLanguageInfo.nativeName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-1.5 end-0 w-48 bg-white dark:bg-[#0c162e] border border-slate-200 dark:border-sky-900/80 rounded-xl shadow-xl py-1.5 z-50 text-start animate-in fade-in zoom-in-95 duration-100 font-sans">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            {t('language', 'اللغة / Langue / Language')}
          </div>
          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  id={`lang-select-${lang.code}`}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#17284f]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div className="text-start">
                      <div className="leading-none">{lang.nativeName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {lang.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
