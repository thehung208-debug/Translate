import { storageService } from './storageService.js';
import { freeTranslateService } from './freeTranslateService.js';

// Gemini and Real-time Free Translation Service
export const geminiService = {
  async processText(text) {
    const cleanText = text.trim();
    if (!cleanText) throw new Error('Vui lòng nhập nội dung cần dịch.');

    const apiKey = storageService.getApiKey();
    const model = storageService.getModel() || 'gemini-2.5-flash';

    // If API Key is configured, use Gemini AI for deep contextual analysis
    if (apiKey) {
      try {
        return await this.callGeminiText(cleanText, apiKey, model);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to direct real-time translation:', err);
      }
    }

    // 100% REAL-TIME LIVE TRANSLATION
    return await this.realtimeTranslateText(cleanText);
  },

  async callGeminiText(text, apiKey, model) {
    const systemPrompt = `Bạn là trợ lý dịch thuật và gia sư tiếng Anh cơ bản (A1 - A2) cho người Việt.
QUAN TRỌNG:
1. Phải dịch ĐÚNG CHÍNH XÁC nội dung người dùng nhập.
2. Dùng từ ngữ tiếng Việt ĐƠN GIẢN, DỄ HIỂU, không dùng thuật ngữ ngôn ngữ học phức tạp.
3. Khi dịch CÂU: BẮT BUỘC phải có phần GIẢI THÍCH NGỮ PHÁP (Grammar Explanation) ngắn gọn, rõ ràng (chỉ rõ thì của động từ, trật tự câu, cấu trúc chính).
4. Khi giải thích 1 TỪ: Nếu từ đó CÓ NHIỀU NGHĨA HOẶC NHIỀU CÁCH DÙNG (ví dụ vừa là danh từ vừa là động từ), BẮT BUỘC phải liệt kê rõ các nghĩa thông dụng đó và cách dùng tương ứng.
5. Luôn ghi rõ TỪ LOẠI: Danh từ (n), Động từ (v), Tính từ (adj), Trạng từ (adv), Giới từ (prep)...

Trả về DUY NHẤT 1 JSON hợp lệ:

1. NẾU ĐẦU VÀO LÀ TIẾNG VIỆT:
{
  "category": "VI_TO_EN",
  "detectedLanguage": "Tiếng Việt",
  "sourceText": "${text.replace(/"/g, '\\"')}",
  "primaryTranslation": "Bản dịch tiếng Anh chuẩn, tự nhiên (A1-A2)",
  "casualVersion": "Cách nói ngắn gọn thường ngày",
  "grammarExplanation": "Giải thích cấu trúc ngữ pháp dùng trong câu tiếng Anh này một cách đơn giản, dễ hiểu",
  "keyWords": [
    {"word": "từ tiếng Anh", "ipa": "/.../", "partOfSpeech": "Danh từ/Động từ/Tính từ...", "meaning": "nghĩa tiếng Việt"}
  ]
}

2. NẾU ĐẦU VÀO LÀ 1 TỪ TIẾNG ANH (hoặc cụm từ ngắn):
{
  "category": "EN_WORD",
  "detectedLanguage": "Tiếng Anh",
  "word": "${text.replace(/"/g, '\\"')}",
  "ipa": "/phiên âm quốc tế/",
  "partOfSpeech": "Danh từ / Động từ / Tính từ...",
  "simpleMeaning": "Nghĩa thông dụng nhất",
  "hasMultipleMeanings": true,
  "meaningGroups": [
    {
      "partOfSpeech": "Động từ (Verb)",
      "meanings": "Nghĩa khi là động từ",
      "example": "Ví dụ ngắn"
    },
    {
      "partOfSpeech": "Danh từ (Noun)",
      "meanings": "Nghĩa khi là danh từ",
      "example": "Ví dụ ngắn"
    }
  ],
  "howToUse": "Cách dùng từ này đơn giản trong đời sống",
  "examples": [
    {"en": "Câu ví dụ tiếng Anh ngắn gọn", "vi": "Dịch nghĩa câu ví dụ"}
  ]
}

3. NẾU ĐẦU VÀO LÀ CÂU HOẶC ĐOẠN TIẾNG ANH:
{
  "category": "EN_PASSAGE",
  "detectedLanguage": "Tiếng Anh",
  "sourceText": "${text.replace(/"/g, '\\"')}",
  "vietnameseTranslation": "Bản dịch tiếng Việt chính xác, dễ hiểu",
  "grammarExplanation": "Giải thích chi tiết ngữ pháp câu này (thì gì, chủ ngữ + vị ngữ, điểm cần nhớ)",
  "vocabularyNotes": [
    {"word": "từ trong câu", "ipa": "/.../", "partOfSpeech": "Danh từ/Động từ/Tính từ...", "meaning": "nghĩa tiếng Việt"}
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: `${systemPrompt}\n\nNội dung cần xử lý:\n"""${text}"""` }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Lỗi API (${response.status})`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Không nhận được phản hồi từ AI.');

    return this.cleanAndParseJSON(rawText);
  },

  // 100% Real-time translation fallback when no key is set or API fails
  async realtimeTranslateText(text) {
    const isSingleWord = text.split(/\s+/).filter(Boolean).length <= 2 && !/[.!?]/.test(text);
    const hasViAccents = /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(text);

    // CASE 1: VIETNAMESE TO ENGLISH
    if (hasViAccents) {
      const transResult = await freeTranslateService.translateAndLookup(text, 'vi', 'en');
      const enTranslation = transResult?.translatedText || text;

      // Detect grammar explanation
      const grammarExplanation = freeTranslateService.detectGrammarTip(text, false);

      // Extract key words with part of speech
      const words = enTranslation.split(/\s+/).filter(w => w.length > 2).slice(0, 5);
      const keyWords = [];
      for (const w of words) {
        const cleanW = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (cleanW && !['the', 'and', 'for', 'with', 'this', 'that'].includes(cleanW)) {
          const wInfo = await freeTranslateService.translateAndLookup(cleanW, 'en', 'vi');
          keyWords.push({
            word: cleanW,
            ipa: wInfo?.ipa || '',
            partOfSpeech: wInfo?.partOfSpeech || 'Từ vựng',
            meaning: wInfo?.translatedText || ''
          });
        }
      }

      return {
        category: 'VI_TO_EN',
        detectedLanguage: 'Tiếng Việt',
        sourceText: text,
        primaryTranslation: enTranslation,
        casualVersion: enTranslation,
        grammarExplanation: grammarExplanation,
        keyWords: keyWords.length > 0 ? keyWords : [
          { word: enTranslation, ipa: '', partOfSpeech: 'Cụm từ', meaning: text }
        ]
      };
    }

    // CASE 2: ENGLISH SINGLE WORD
    if (isSingleWord) {
      const cleanWord = text.replace(/[^a-zA-Z\s]/g, '').trim().toLowerCase();
      const wordInfo = await freeTranslateService.translateAndLookup(cleanWord, 'en', 'vi');

      const meaning = wordInfo?.translatedText || cleanWord;
      const ipa = wordInfo?.ipa || '';
      const partOfSpeech = wordInfo?.partOfSpeech || 'Từ vựng';

      // Multiple meanings list
      const meaningGroups = (wordInfo?.multipleMeanings || []).map(group => ({
        partOfSpeech: group.partOfSpeech,
        meanings: group.meanings,
        example: `Dùng khi là ${group.partOfSpeech.toLowerCase()}`
      }));

      // Generate practical A1-A2 example
      const exEn = `I like this ${cleanWord}.`;
      const exViInfo = await freeTranslateService.translateAndLookup(exEn, 'en', 'vi');

      return {
        category: 'EN_WORD',
        detectedLanguage: 'Tiếng Anh',
        word: text,
        ipa: ipa,
        partOfSpeech: partOfSpeech,
        simpleMeaning: meaning,
        hasMultipleMeanings: meaningGroups.length > 1,
        meaningGroups: meaningGroups,
        howToUse: `Từ "${text}" có nghĩa chính là "${meaning}". ${meaningGroups.length > 1 ? `Lưu ý: Từ này có thể đóng vai trò là cả ${meaningGroups.map(m => m.partOfSpeech).join(' và ')} tùy vào ngữ cảnh.` : ''}`,
        examples: [
          {
            en: exEn,
            vi: exViInfo?.translatedText || ''
          }
        ]
      };
    }

    // CASE 3: ENGLISH SENTENCE / PASSAGE TO VIETNAMESE
    const viResult = await freeTranslateService.translateAndLookup(text, 'en', 'vi');
    const vietnameseTranslation = viResult?.translatedText || '';

    // Grammar tip for English sentence
    const grammarExplanation = freeTranslateService.detectGrammarTip(text, true);

    // Extract vocabulary words from the sentence with part of speech
    const words = text.split(/\s+/).filter(w => w.length > 2).slice(0, 5);
    const vocabularyNotes = [];
    for (const w of words) {
      const cleanW = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (cleanW && !['the', 'and', 'for', 'with', 'this', 'that', 'are', 'was', 'were'].includes(cleanW)) {
        const wInfo = await freeTranslateService.translateAndLookup(cleanW, 'en', 'vi');
        vocabularyNotes.push({
          word: cleanW,
          ipa: wInfo?.ipa || '',
          partOfSpeech: wInfo?.partOfSpeech || 'Từ vựng',
          meaning: wInfo?.translatedText || ''
        });
      }
    }

    return {
      category: 'EN_PASSAGE',
      detectedLanguage: 'Tiếng Anh',
      sourceText: text,
      vietnameseTranslation: vietnameseTranslation,
      grammarExplanation: grammarExplanation,
      vocabularyNotes: vocabularyNotes
    };
  },

  async processImage(base64Image, mimeType = 'image/jpeg') {
    const apiKey = storageService.getApiKey();
    const model = storageService.getModel() || 'gemini-2.5-flash';

    if (!apiKey) {
      throw new Error('Để nhận diện ảnh và giải bài tập, bạn vui lòng bấm vào nút "Cài Key" ở góc trên để thêm Gemini API Key miễn phí (lấy trong 30 giây tại aistudio.google.com).');
    }

    const cleanBase64 = base64Image.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const systemPrompt = `Bạn là trợ lý giải bài tập tiếng Anh A1-A2.
Nhận diện nội dung ảnh:
1. NẾU LÀ BÀI TẬP:
   - Dịch câu hỏi sang tiếng Việt.
   - ĐƯA RA ĐÁP ÁN CHÍNH XÁC rõ ràng.
   - KHÔNG giải thích dài dòng, KHÔNG phân tích đáp án sai.
   - Trả về JSON:
   {
     "contentType": "EXERCISE",
     "detectedTitle": "Chủ đề bài tập",
     "questions": [
       {
         "number": "Câu 1",
         "originalQuestion": "câu hỏi tiếng Anh",
         "translatedQuestion": "dịch nghĩa tiếng Việt",
         "options": ["A. ...", "B. ..."],
         "correctAnswer": "Đáp án đúng",
         "meaningOfAnswer": "Nghĩa của đáp án (ngắn gọn)"
       }
     ]
   }
2. NẾU LÀ VĂN BẢN THƯỜNG:
   - Dịch sang tiếng Việt và liệt kê từ vựng.
   - Trả về JSON:
   {
     "contentType": "GENERAL_TEXT",
     "extractedText": "tiếng Anh trong ảnh",
     "translatedText": "bản dịch tiếng Việt",
     "vocabulary": [{"word": "từ", "ipa": "/.../", "partOfSpeech": "Danh từ/Động từ...", "meaning": "nghĩa"}]
   }`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Lỗi API (${response.status}): Vui lòng kiểm tra lại API Key.`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Không nhận được nội dung từ ảnh.');

    return this.cleanAndParseJSON(rawText);
  },

  cleanAndParseJSON(raw) {
    let clean = raw.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean);
  }
};
