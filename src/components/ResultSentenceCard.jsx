import React, { useState } from 'react';
import { Volume2, Copy, Check, BookOpen, Lightbulb } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function ResultSentenceCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.vietnameseTranslation || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg shadow-purple-950/5 border border-rose-100/90 animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-rose-100/60">
        <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-100 to-rose-100 text-purple-900 px-3 py-1 rounded-full border border-rose-200 font-numeric">
          Dịch câu Tiếng Anh ➔ Tiếng Việt
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
        {/* Vietnamese Translation (Peach glow) */}
        <div className="bg-gradient-to-r from-purple-50/80 via-[#FFF4F6] to-rose-50/80 rounded-2xl p-4 sm:p-5 border border-rose-200/80 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">
              Bản dịch tiếng Việt dễ hiểu
            </span>
            <button
              type="button"
              onClick={() => speechService.speak(data.vietnameseTranslation, { lang: 'vi-VN' })}
              className="p-1.5 rounded-xl text-purple-600 hover:bg-purple-100 transition-colors"
              title="Nghe đọc tiếng Việt"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
            {data.vietnameseTranslation}
          </p>
        </div>

        {/* English Source */}
        <div className="bg-white rounded-2xl p-4 border border-purple-100 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Câu tiếng Anh gốc
            </span>
            <button
              type="button"
              onClick={() => speechService.speak(data.sourceText, { lang: 'en-US' })}
              className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
              title="Nghe phát âm chuẩn tiếng Anh"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-base font-semibold text-purple-950 leading-relaxed">
            {data.sourceText}
          </p>
        </div>
      </div>

      {/* GRAMMAR EXPLANATION BOX (Required by user) */}
      {data.grammarExplanation && (
        <div className="bg-gradient-to-r from-purple-50/80 to-rose-50/80 rounded-2xl p-4 border border-rose-200/80 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-purple-200/80 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 text-purple-700" />
          </div>
          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
            <strong className="text-purple-900 font-extrabold text-sm block mb-1">
              💡 Giải thích ngữ pháp câu này:
            </strong>
            <p className="font-medium text-slate-700">{data.grammarExplanation}</p>
          </div>
        </div>
      )}

      {/* VOCABULARY IN SENTENCE - HORIZONTAL LIST (Not cards!) */}
      {data.vocabularyNotes && data.vocabularyNotes.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Từ quan trọng trong câu:</span>
          </span>

          {/* Horizontal rows list */}
          <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden divide-y divide-purple-50 shadow-xs">
            {data.vocabularyNotes.map((item, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-rose-50/40 transition-colors"
              >
                {/* Left: Audio + Word + Part of Speech + IPA */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => speechService.speak(item.word, { lang: 'en-US' })}
                    className="p-1.5 rounded-lg text-purple-500 hover:text-purple-800 hover:bg-purple-100 shrink-0 transition-colors"
                    title="Nghe từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="flex flex-wrap items-baseline gap-1.5 truncate">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900">{item.word}</span>
                    {item.partOfSpeech && (
                      <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 shrink-0">
                        {item.partOfSpeech}
                      </span>
                    )}
                    {item.ipa && (
                      <span className="text-[11px] sm:text-xs text-rose-500 font-numeric font-medium shrink-0">
                        {item.ipa}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Meaning */}
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    ➔ {item.meaning}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
