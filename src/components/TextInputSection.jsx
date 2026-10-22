import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Volume2, X, Sparkles } from 'lucide-react';
import { classifyTextIntent } from '../services/detector';
import { speechService } from '../services/speechService';

// Custom Stylized Camera Icon
function StylizedCameraIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M20 7H16.8L15.4 4.6C15.1 4.2 14.6 4 14.1 4H9.9C9.4 4 8.9 4.2 8.6 4.6L7.2 7H4C2.9 7 2 7.9 2 9V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V9C22 7.9 21.1 7 20 7Z"
        fill="url(#camGradFill)"
        stroke="url(#camGradStroke)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Camera Lens */}
      <circle cx="12" cy="13" r="4.2" stroke="white" strokeWidth="2" fill="url(#lensGrad)" />
      {/* Lens Reflection Dot */}
      <circle cx="13.5" cy="11.5" r="1.2" fill="white" />
      {/* Top Small Flash */}
      <circle cx="18" cy="10" r="1.2" fill="#FDA4AF" />

      <defs>
        <linearGradient id="camGradFill" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3E8FF" />
          <stop offset="1" stopColor="#FFE4E6" />
        </linearGradient>
        <linearGradient id="camGradStroke" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333EA" />
          <stop offset="1" stopColor="#FB7185" />
        </linearGradient>
        <linearGradient id="lensGrad" x1="7.8" y1="8.8" x2="16.2" y2="17.2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7E22CE" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Custom Stylized Enter Key (Keycap style with Peach-Purple glow)
function StylizedEnterIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Curving Enter Arrow */}
      <path
        d="M19 6V13C19 14.1 18.1 15 17 15H6.5M6.5 15L10.5 11M6.5 15L10.5 19"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TextInputSection({ onAnalyzeText, onAnalyzeImage, isLoading }) {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [intent, setIntent] = useState(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // Hidden inputs for camera capture & gallery
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    if (inputText.trim()) {
      setIntent(classifyTextIntent(inputText));
    } else {
      setIntent(null);
    }
  }, [inputText]);

  // Close photo popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowPhotoOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    setShowPhotoOptions(false);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (attachedImage) {
      onAnalyzeImage(attachedImage, inputText.trim());
    } else if (inputText.trim()) {
      onAnalyzeText(inputText.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSpeak = () => {
    if (!inputText.trim()) return;
    const isEn = intent?.language === 'ENGLISH';
    speechService.speak(inputText, { lang: isEn ? 'en-US' : 'vi-VN' });
  };

  const canSubmit = Boolean(inputText.trim() || attachedImage);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-5 shadow-lg shadow-purple-950/5 border border-rose-100/80 space-y-2.5 relative">
      {/* Hidden file inputs for Mobile camera & gallery */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {/* Language Detection Badge or Status (Removed left annotation text) */}
      {(intent && !attachedImage) || attachedImage ? (
        <div className="flex items-center justify-end pb-1">
          {intent && !attachedImage && (
            <span className="text-xs font-bold px-3 py-1 rounded-full border bg-gradient-to-r from-purple-50 to-rose-50 text-purple-800 border-rose-200/80 flex items-center gap-1.5 animate-fade-in shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{intent.badge}</span>
            </span>
          )}

          {attachedImage && (
            <span className="text-xs font-bold px-3 py-1 rounded-full border bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 border-rose-200 flex items-center gap-1.5 animate-fade-in">
              <Camera className="w-3.5 h-3.5 text-rose-500" />
              <span>Đã đính kèm ảnh bài tập</span>
            </span>
          )}
        </div>
      ) : null}

      {/* Main Input Box with Peach-Purple Focus Ring */}
      <div className="relative rounded-2xl border-2 border-purple-100/80 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-100/50 bg-gradient-to-b from-white to-[#FFF9F8] transition-all shadow-inner">
        {/* Attached image preview inside input box */}
        {attachedImage && (
          <div className="p-3.5 pb-1 flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-rose-300 bg-slate-900 shrink-0 shadow-md">
              <img src={attachedImage} alt="Thumbnail" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                title="Gỡ ảnh"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-xs text-slate-600">
              <p className="font-bold text-slate-800 text-sm">Đã chọn ảnh bài tập</p>
              <p className="text-xs text-rose-600 font-medium mt-0.5">Nhấn phím Enter màu đào để xem đáp án</p>
            </div>
          </div>
        )}

        {/* Textarea */}
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={attachedImage ? "Nhập thêm yêu cầu nếu có..." : "Nhập từ, câu tiếng Anh hoặc tiếng Việt..."}
          className="w-full p-4 pb-14 bg-transparent text-slate-900 placeholder:text-purple-300/80 text-lg sm:text-xl font-medium focus:outline-hidden resize-none min-h-[105px]"
        />

        {/* Bottom Toolbar inside textarea */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Left: Stylized Camera Button & Audio */}
          <div className="flex items-center gap-2" ref={optionsRef}>
            {/* STYLIZED CAMERA BUTTON */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPhotoOptions(prev => !prev)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 border ${
                  attachedImage
                    ? 'bg-gradient-to-tr from-purple-200 to-rose-200 border-rose-300 shadow-md shadow-rose-200/50'
                    : 'bg-gradient-to-tr from-purple-50 via-rose-50/70 to-white hover:from-purple-100 hover:to-rose-100 border-rose-200/80 shadow-xs'
                }`}
                title="Chụp ảnh bài tập hoặc tải ảnh từ máy"
              >
                <StylizedCameraIcon className="w-6 h-6" />
              </button>

              {/* Photo Popover on Mobile */}
              {showPhotoOptions && (
                <div className="absolute bottom-13 left-0 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 p-2 w-52 animate-fade-in space-y-1.5">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-rose-50 hover:text-purple-900 active:bg-rose-100 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span>Bật Camera chụp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-rose-50 hover:text-rose-900 active:bg-rose-100 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span>Chọn ảnh từ máy</span>
                  </button>
                </div>
              )}
            </div>

            {/* Audio & Clear */}
            {inputText.trim() && (
              <>
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="p-2.5 rounded-xl text-purple-600 hover:bg-purple-100/70 active:bg-purple-200 transition-colors"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="p-2.5 rounded-xl text-rose-400 hover:text-rose-600 active:bg-rose-100/60 transition-colors"
                  title="Xóa nội dung"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Right: STYLIZED ENTER KEY */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
              canSubmit && !isLoading
                ? 'bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-rose-400 text-white shadow-lg shadow-rose-500/35 hover:shadow-xl hover:shadow-purple-500/40 active:translate-y-0.5 cursor-pointer ring-2 ring-white/50'
                : 'bg-slate-200/80 text-slate-400 cursor-not-allowed shadow-none'
            }`}
            title="Nhấn phím Enter để dịch ngay"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <StylizedEnterIcon className="w-6 h-6 filter drop-shadow-xs" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
