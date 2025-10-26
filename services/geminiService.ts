

// FIX: Import 'Type' for defining the response schema, as per @google/genai guidelines for JSON responses.
import { GoogleGenAI, Type } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const identifyWaste = async (imageFile: File): Promise<string> => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const imagePart = await fileToGenerativePart(imageFile);
    
    // FIX: The prompt no longer needs to specify the JSON structure, as this is now handled by `responseSchema`.
    const prompt = `Phân tích hình ảnh này và cho biết đây là loại rác gì (ví dụ: Nhựa, Giấy, Kim loại, Thủy tinh, Pin, Hữu cơ, Điện tử). Đưa ra gợi ý về cách tái chế hoặc xử lý loại rác này một cách phù hợp. Trả lời bằng tiếng Việt.`;

    // FIX: Replaced manual JSON parsing with `responseSchema` to ensure reliable JSON output from the Gemini API.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    wasteType: {
                        type: Type.STRING,
                        description: 'Loại rác thải được xác định từ hình ảnh, ví dụ: Nhựa, Giấy, Kim loại, Thủy tinh, Pin, Hữu cơ, Điện tử.'
                    },
                    recyclingSuggestion: {
                        type: Type.STRING,
                        description: 'Gợi ý về cách tái chế hoặc xử lý loại rác này một cách phù hợp bằng tiếng Việt.'
                    }
                },
                required: ['wasteType', 'recyclingSuggestion']
            }
        }
    });

    // FIX: Removed manual string cleaning. With `responseSchema`, the output is a clean JSON string.
    return response.text || JSON.stringify({ error: "Không nhận được phản hồi từ API" });
  } catch (error) {
    console.error("Error identifying waste:", error);
    if (error instanceof Error) {
        return JSON.stringify({ error: `Đã xảy ra lỗi khi phân tích hình ảnh: ${error.message}` });
    }
    return JSON.stringify({ error: "Đã xảy ra lỗi không xác định khi phân tích hình ảnh." });
  }
};
