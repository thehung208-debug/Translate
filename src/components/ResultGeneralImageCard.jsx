import React, { useState } from 'react';
import { Volume2, Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function ResultGeneralImageCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.translatedText || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg shadow-purple-950/5 border border-rose-100/90 animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-rose-100/60">
        <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-100 to-rose-100 text-purple-900 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5 font-numeric">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Dịch văn bản trong ảnh</span>
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 active:bg-purple-100 text-purple-800 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>
      </div>

      {/* Translations */}
      <div className="space-y-3.5">
        {/* Vietnamese Translation (Peach-Purple Glow) */}
        <div className="bg-gradient-to-r from-purple-50/80 via-[#FFF4F6] to-rose-50/80 rounded-2xl p-4 sm:p-5 border border-rose-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">
              Bản dịch tiếng Việt dễ hiểu
            </span>
            <button
              type="button"
              onClick={() => speechService.speak(data.translatedText, { lang: 'vi-VN' })}
              className="p-1.5 rounded-xl text-purple-600 hover:bg-purple-100"
              title="Nghe đọc tiếng Việt"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-base sm:text-lg font-black text-slate-900 leading-relaxed whitespace-pre-line">
            {data.translatedText}
          </p>
        </div>

        {/* English Extracted */}
        <div className="bg-white rounded-2xl p-4 border border-purple-100 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chữ tiếng Anh trong ảnh
            </span>
            <button
              type="button"
              onClick={() => speechService.speak(data.extractedText, { lang: 'en-US' })}
              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50"
              title="Nghe đọc tiếng Anh"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm font-semibold text-purple-950 leading-relaxed whitespace-pre-line">
            {data.extractedText}
          </p>
        </div>
      </div>

      {/* Vocabulary */}
      {data.vocabulary && data.vocabulary.length > 0 && (
        <div className="space-y-3 pt-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Từ vựng trong ảnh:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {data.vocabulary.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3.5 border border-purple-100 hover:border-rose-300 shadow-xs transition-all flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base text-slate-900">{item.word}</span>
                    {item.ipa && <span className="text-xs text-rose-500 font-numeric font-semibold">{item.ipa}</span>}
                  </div>
                  <p className="text-xs sm:text-sm text-purple-900 font-semibold mt-0.5">➔ {item.meaning}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speechService.speak(item.word, { lang: 'en-US' })}
                  className="p-2 rounded-xl text-purple-400 hover:text-purple-700 active:bg-purple-50"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
