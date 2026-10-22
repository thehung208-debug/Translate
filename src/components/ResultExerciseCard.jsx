import React, { useState } from 'react';
import { CheckCircle2, Volume2, Copy, Check, Sparkles } from 'lucide-react';
import { speechService } from '../services/speechService';

export default function ResultExerciseCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    let text = `BÀI TẬP: ${data.detectedTitle || 'Đáp án bài tập'}\n\n`;
    data.questions?.forEach((q, i) => {
      text += `${q.number || `Câu ${i + 1}`}: ${q.originalQuestion}\n`;
      text += `Dịch nghĩa: ${q.translatedQuestion}\n`;
      text += `>> ĐÁP ÁN: ${q.correctAnswer}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg shadow-purple-950/5 border border-rose-100/90 animate-fade-in space-y-5">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-rose-100/60">
        <div>
          <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-100 to-rose-100 text-purple-900 px-3 py-1 rounded-full border border-rose-200 inline-flex items-center gap-1.5 mb-1 font-numeric">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Đáp án bài tập tiếng Anh</span>
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            {data.detectedTitle || 'Kết quả giải bài'}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 active:bg-purple-100 text-purple-800 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
        </button>
      </div>

      {/* List of Questions with Direct Answer Keys */}
      <div className="space-y-4">
        {data.questions?.map((q, idx) => (
          <div
            key={idx}
            className="rounded-2xl border-2 border-purple-100 bg-gradient-to-b from-white to-[#FFF9F8] p-4 sm:p-5 space-y-3.5 shadow-xs"
          >
            {/* Question Header & Content */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-rose-500 text-white font-numeric shadow-xs">
                  {q.number || `Câu ${idx + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => speechService.speak(q.originalQuestion, { lang: 'en-US' })}
                  className="p-1.5 rounded-lg text-purple-400 hover:text-purple-700 active:bg-purple-50"
                  title="Nghe câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {q.originalQuestion}
              </p>
              <p className="text-xs sm:text-sm text-purple-800 mt-1 font-semibold italic">
                ➔ Dịch: {q.translatedQuestion}
              </p>
            </div>

            {/* Multiple Choice Options (if present) */}
            {q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctAnswer && (
                    opt.toLowerCase().includes(q.correctAnswer.toLowerCase()) ||
                    q.correctAnswer.toLowerCase().startsWith(opt.substring(0, 2).toLowerCase())
                  );

                  return (
                    <div
                      key={optIdx}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                        isCorrect
                          ? 'bg-gradient-to-r from-purple-50 to-rose-50 border-rose-400 text-rose-950 font-black shadow-xs ring-1 ring-rose-300'
                          : 'bg-white border-purple-100/90 text-slate-600'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Direct Answer Box (Peach & Purple Highlight) */}
            <div className="bg-gradient-to-r from-purple-50/90 via-[#FFF4F6] to-rose-50/90 rounded-2xl p-4 border border-rose-200/90 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-rose-400 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider block">
                    ĐÁP ÁN ĐÚNG:
                  </span>
                  <span className="text-lg font-black bg-gradient-to-r from-purple-800 to-rose-600 bg-clip-text text-transparent">
                    {q.correctAnswer}
                  </span>
                </div>
              </div>

              {q.meaningOfAnswer && (
                <span className="text-xs text-rose-800 font-bold text-right bg-white/80 px-2.5 py-1 rounded-lg border border-rose-200/60">
                  {q.meaningOfAnswer}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
