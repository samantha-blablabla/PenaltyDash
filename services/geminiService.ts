import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFinancialData = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey) {
    return "Vui lòng cấu hình API_KEY để sử dụng tính năng phân tích AI.";
  }

  const transactionDataStr = JSON.stringify(transactions.map(t => ({
    date: t.date,
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description
  })));

  const prompt = `
    Bạn là một chuyên gia tài chính. Hãy phân tích dữ liệu thu chi tiền phạt/quỹ sau đây và đưa ra báo cáo ngắn gọn bằng tiếng Việt.
    
    Dữ liệu giao dịch (JSON):
    ${transactionDataStr}

    Yêu cầu:
    1. Tổng quan tình hình quỹ (Thu vs Chi).
    2. Xu hướng chi tiêu hoặc thu phạt (loại vi phạm nào phổ biến nhất, chi tiêu vào việc gì nhiều nhất).
    3. Đưa ra 1-2 lời khuyên để quản lý quỹ tốt hơn.
    
    Định dạng câu trả lời sử dụng Markdown, dùng các bullet point cho dễ đọc. Giọng điệu chuyên nghiệp nhưng thân thiện.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Không thể phân tích dữ liệu lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.";
  }
};
