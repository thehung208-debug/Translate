import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { storageService } from '../services/storageService';

export default function SettingsModal({ isOpen, onClose, onSaved }) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(storageService.getApiKey() || '');
      setModel(storageService.getModel() || 'gemini-2.5-flash');
      setShowSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    storageService.setApiKey(apiKey.trim());
    storageService.setModel(model);
    setShowSuccess(true);
    setTimeout(() => {
      onSaved();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-100 to-rose-100 border border-rose-200/80 flex items-center justify-center text-purple-700">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Cài đặt Gemini AI Key</h3>
            <p className="text-xs text-purple-900/60 font-medium">Kết nối trực tiếp để học tiếng Anh miễn phí</p>
          </div>
        </div>

        {/* Info box in Peach/Purple */}
        <div className="bg-gradient-to-r from-purple-50/70 to-rose-50/70 border border-rose-200/70 rounded-2xl p-3.5 text-xs text-slate-700 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Key được lưu trực tiếp trên điện thoại của bạn và hoàn toàn an toàn.</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              Google cung cấp Gemini API <strong>miễn phí 100%</strong>. Lấy key trong 30 giây tại{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-purple-700 font-bold underline inline-flex items-center gap-0.5 hover:text-rose-600"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </span>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder="Dán mã API Key dạng AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border-2 border-purple-100 text-sm focus:outline-hidden focus:border-rose-400 focus:ring-2 focus:ring-rose-100 font-numeric"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-1">
              Mô hình AI (Model)
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-purple-100 text-xs font-medium focus:outline-hidden focus:border-rose-400 bg-white"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Tối tân, nhanh nhất)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Siêu tốc)</option>
            </select>
          </div>
        </div>

        {showSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã lưu thành công!</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-400 hover:opacity-95 text-white shadow-md shadow-rose-500/25 transition-all active:scale-95"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}
