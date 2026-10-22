import React, { useState } from 'react';
import { Volume2, Copy, Check, Lightbulb, BookOpen, Layers } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function ResultWordCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    let text = `${data.word} (${data.ipa || ''}) - ${data.partOfSpeech || ''}\n`;
    text += `Nghĩa: ${data.simpleMeaning || ''}\n`;
    if (data.meaningGroups && data.meaningGroups.length > 0) {
      data.meaningGroups.forEach(g => {
        text += `• [${g.partOfSpeech}]: ${g.meanings}\n`;
      });
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const playSpeech = () => {
    speechService.speak(data.word, { lang: 'en-US' });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg shadow-purple-950/5 border border-rose-100/90 animate-fade-in space-y-5">
      {/* Word Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-rose-100/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-100 to-rose-100 text-purple-900 px-3 py-1 rounded-full border border-rose-200/80 font-numeric">
              {data.partOfSpeech || 'Từ vựng'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-800 via-fuchsia-700 to-rose-500 bg-clip-text text-transparent tracking-tight">
              {data.word}
            </h1>
            <button
              type="button"
              onClick={playSpeech}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-100 to-rose-100 hover:from-purple-200 hover:to-rose-200 text-purple-700 flex items-center justify-center active:scale-95 transition-all shadow-xs"
              title="Nghe phát âm chuẩn"
            >
              <Volume2 className="w-5 h-5 text-purple-700" />
            </button>
          </div>

          {data.ipa && (
            <p className="text-base font-numeric font-semibold text-rose-500 mt-1 tracking-wide">
              {data.ipa}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="p-2.5 rounded-2xl text-slate-400 hover:text-purple-700 active:bg-purple-50 transition-colors"
          title="Sao chép từ"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {/* Primary Meaning */}
      <div className="bg-gradient-to-r from-purple-50/90 via-[#FFF4F6] to-rose-50/90 rounded-2xl p-4 sm:p-5 border border-rose-200/80 space-y-1 shadow-xs">
        <span className="text-xs font-black uppercase tracking-wider text-purple-700 block">
          Nghĩa chính thông dụng:
        </span>
        <p className="text-2xl font-black text-slate-900 leading-snug">
          {data.simpleMeaning}
        </p>
      </div>

      {/* Multiple Meanings & Parts of Speech (if word has multiple roles) */}
      {data.meaningGroups && data.meaningGroups.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-black uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-rose-500" />
            <span>Các nghĩa & Cách dùng theo từng loại từ:</span>
          </span>

          <div className="space-y-2">
            {data.meaningGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3.5 border border-purple-100 hover:border-rose-300 transition-all shadow-xs flex items-start gap-3"
              >
                <span className="text-xs font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                  {group.partOfSpeech}
                </span>
                <div className="text-sm">
                  <p className="font-bold text-slate-800">{group.meanings}</p>
                  {group.example && (
                    <p className="text-xs text-slate-500 mt-0.5 italic">{group.example}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to use */}
      {data.howToUse && (
        <div className="bg-gradient-to-r from-rose-50/60 to-orange-50/60 rounded-2xl p-4 border border-rose-200/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="text-sm text-slate-800 leading-relaxed">
            <strong className="block text-rose-800 font-bold mb-0.5">Lưu ý cách dùng:</strong>
            {data.howToUse}
          </div>
        </div>
      )}

      {/* Simple Examples (A1-A2) */}
      {data.examples && data.examples.length > 0 && (
        <div className="space-y-3 pt-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Ví dụ câu thực tế:</span>
          </span>

          <div className="space-y-2.5">
            {data.examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-purple-100 hover:border-rose-300 transition-all shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-bold text-purple-950">
                    "{ex.en}"
                  </p>
                  <button
                    type="button"
                    onClick={() => speechService.speak(ex.en, { lang: 'en-US' })}
                    className="p-1.5 rounded-lg text-purple-400 hover:text-purple-700 active:bg-purple-100"
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-rose-600 font-semibold">
                  ➔ {ex.vi}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
