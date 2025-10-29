import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Build conversation context
    const systemPrompt = `Bạn là trợ lý AI chuyên về tái chế và bảo vệ môi trường tại Việt Nam. 
Nhiệm vụ của bạn là:
- Giúp người dùng hiểu về phân loại rác thải (nhựa, giấy, kim loại, thủy tinh, pin, hữu cơ, điện tử)
- Cung cấp hướng dẫn tái chế và xử lý rác thải
- Chia sẻ kiến thức về bảo vệ môi trường
- Đề xuất các hoạt động thân thiện với môi trường
- Trả lời các câu hỏi về điểm thu gom rác thải

Hãy trả lời ngắn gọn, dễ hiểu và hữu ích bằng tiếng Việt. Nếu câu hỏi không liên quan đến môi trường hay tái chế, hãy lịch sự từ chối và hướng người dùng về chủ đề môi trường.`;

    // Build conversation history
    let conversationText = systemPrompt + '\n\n';
    
    if (history && history.length > 0) {
      history.forEach((msg: { role: string; content: string }) => {
        conversationText += `${msg.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${msg.content}\n`;
      });
    }
    
    conversationText += `Người dùng: ${message}\nTrợ lý:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: conversationText }] },
      config: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 500,
      }
    });

    const reply = response.text || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.' },
      { status: 500 }
    );
  }
}
