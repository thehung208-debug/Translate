import React, { useState } from 'react';
import Header from './components/Header';
import TextInputSection from './components/TextInputSection';
import ResultWordCard from './components/ResultWordCard';
import ResultSentenceCard from './components/ResultSentenceCard';
import ResultViToEnCard from './components/ResultViToEnCard';
import ResultExerciseCard from './components/ResultExerciseCard';
import ResultGeneralImageCard from './components/ResultGeneralImageCard';
import SettingsModal from './components/SettingsModal';
import { geminiService } from './services/geminiService';
import { storageService } from './services/storageService';
import { AlertCircle, KeyRound } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Text analysis handler
  const handleAnalyzeText = async (text) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await geminiService.processText(text);
      setResult(data);
      setResultType(data.category);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối mạng hoặc API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  // Image analysis handler (attached from camera or gallery)
  const handleAnalyzeImage = async (base64Image, extraText = '') => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await geminiService.processImage(base64Image);
      setResult(data);
      setResultType(data.contentType);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Đã có lỗi xảy ra khi nhận diện ảnh.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF5FF] via-[#FFF9F6] to-[#FFF1F2] flex flex-col text-slate-800">
      {/* Header with Proton Logo & Learning English */}
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Container optimized for Mobile (Max-width 480px) */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 sm:px-4 py-4 space-y-4">
        {/* API Key Reminder Banner (in Peach-Purple style) */}
        {!storageService.getApiKey() && (
          <div className="bg-gradient-to-r from-purple-50/90 via-[#FFF4F6] to-rose-50/90 border border-rose-200/80 rounded-2xl p-3 flex items-center justify-between gap-2.5 shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-100 to-rose-100 flex items-center justify-center text-purple-700 shrink-0">
                <KeyRound className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-purple-950 leading-tight font-medium">
                Chế độ thử nghiệm. Nhập <strong>Gemini Key miễn phí</strong> để dịch không giới hạn!
              </p>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-rose-500 text-white shrink-0 active:scale-95 shadow-xs transition-transform"
            >
              Cài Key
            </button>
          </div>
        )}

        {/* Input Section (Text + Stylized Camera Icon + Stylized Enter Key) */}
        <TextInputSection
          onAnalyzeText={handleAnalyzeText}
          onAnalyzeImage={handleAnalyzeImage}
          isLoading={isLoading}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Dynamic Result Cards */}
        {resultType === 'VI_TO_EN' && <ResultViToEnCard data={result} />}
        {resultType === 'EN_WORD' && <ResultWordCard data={result} />}
        {resultType === 'EN_PASSAGE' && <ResultSentenceCard data={result} />}
        {resultType === 'EXERCISE' && <ResultExerciseCard data={result} />}
        {resultType === 'GENERAL_TEXT' && <ResultGeneralImageCard data={result} />}
      </main>

      {/* Mobile Footer */}
      <footer className="py-4 text-center text-xs text-purple-900/50 font-medium">
        Learning English • Tiếng Anh A1-A2 & Giải bài tập
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => setError(null)}
      />
    </div>
  );
}
