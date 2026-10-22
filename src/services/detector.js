// Utility to assist with client-side language & intention classification

export function detectLanguage(text) {
  if (!text || !text.trim()) return 'UNKNOWN';

  const clean = text.trim();

  // Distinctive Vietnamese accents regex
  const viAccentsRegex = /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵĐ]/i;
  if (viAccentsRegex.test(clean)) {
    return 'VIETNAMESE';
  }

  // Common unaccented Vietnamese stop-words
  const viStopWords = new Set([
    'toi', 'ban', 'chung', 'toi', 'anh', 'em', 'co', 'ong', 'ba',
    'la', 'va', 'nhung', 'ma', 'hoac', 'vi', 'nen', 'neu', 'thi',
    'de', 'trong', 'tren', 'duoi', 'truoc', 'sau', 'giua', 'ngoai',
    'khong', 'chua', 'chuyen', 'da', 'dang', 'se', 'rat', 'lam', 'qua',
    'duoc', 'bi', 'cho', 'voi', 'nguoi', 'cai', 'con', 'chiec'
  ]);

  const words = clean.toLowerCase().split(/\s+/).filter(Boolean);
  let viScore = 0;
  for (const w of words) {
    if (viStopWords.has(w)) viScore++;
  }

  if (words.length > 0 && viScore / words.length >= 0.3) {
    return 'VIETNAMESE';
  }

  return 'ENGLISH';
}

export function classifyTextIntent(text) {
  const lang = detectLanguage(text);
  const trimmed = text.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (lang === 'VIETNAMESE') {
    return {
      language: 'VIETNAMESE',
      type: 'VI_TO_EN',
      label: 'Dịch sang Tiếng Anh',
      badge: 'Tiếng Việt ➔ Tiếng Anh',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  // English
  if (wordCount <= 2 && !/[.!?]/.test(trimmed)) {
    return {
      language: 'ENGLISH',
      type: 'EN_WORD',
      label: 'Giải thích từ vựng & Phiên âm',
      badge: 'Từ vựng Tiếng Anh (Từ điển chi tiết)',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    };
  }

  return {
    language: 'ENGLISH',
    type: 'EN_SENTENCE_OR_PASSAGE',
    label: 'Dịch nghĩa & Phân tích từ khó',
    badge: 'Câu/Đoạn Tiếng Anh (Dịch & Phân tích)',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  };
}
