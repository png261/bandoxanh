import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { auth } from '@clerk/nextjs/server';
import { checkAndIncrementAIUsage, checkAndIncrementGuestUsage } from '@/lib/aiUsage';


export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        let usageCheck;
        let isGuest = false;

        if (userId) {
            usageCheck = await checkAndIncrementAIUsage(userId);
        } else {
            isGuest = true;
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                request.headers.get('x-real-ip') ||
                'unknown';
            usageCheck = await checkAndIncrementGuestUsage(ip);
        }

        if (!usageCheck.allowed) {
            const message = isGuest
                ? 'Bạn đã sử dụng hết lượt thử miễn phí (2 lần/ngày). Đăng nhập để có thêm lượt sử dụng!'
                : 'Bạn đã đạt giới hạn sử dụng AI trong ngày. Vui lòng nâng cấp gói Pro để tiếp tục.';
            return NextResponse.json(
                { error: message, isLimitReached: true, isGuest },
                { status: 403 }
            );
        }


        // Parse form data
        const formData = await request.formData();
        const imageFile = formData.get('image') as File;

        if (!imageFile) {
            return NextResponse.json(
                { error: 'Không tìm thấy hình ảnh.' },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured.' },
                { status: 500 }
            );
        }

        // Convert file to base64
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `Bạn là một chuyên gia dinh dưỡng. Hãy phân tích hình ảnh này và xác định món ăn. 
        Ước lượng lượng calo và các thành phần dinh dưỡng (protein, carbs, fat) dựa trên khẩu phần trong ảnh. 
        Cung cấp một lời khuyên sức khỏe ngắn gọn. 
        Trả lời bằng tiếng Việt dưới dạng JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: imageFile.type } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        foodName: { type: Type.STRING, description: "Tên món ăn" },
                        calories: { type: Type.NUMBER, description: "Ước lượng calo (kcal)" },
                        protein: { type: Type.STRING, description: "Lượng đạm (ví dụ: '20g')" },
                        carbs: { type: Type.STRING, description: "Lượng tinh bột (ví dụ: '50g')" },
                        fat: { type: Type.STRING, description: "Lượng chất béo (ví dụ: '10g')" },
                        portionSize: { type: Type.STRING, description: "Ước lượng khẩu phần (ví dụ: '1 bát', '200g')" },
                        healthTip: { type: Type.STRING, description: "Lời khuyên sức khỏe ngắn gọn" }
                    },
                    required: ["foodName", "calories", "protein", "carbs", "fat", "portionSize", "healthTip"]
                }
            }
        });

        const replyText = response.text || "{}";
        let analysis;
        try {
            analysis = JSON.parse(replyText);
        } catch (e) {
            console.error("Failed to parse Gemini response:", replyText);
            return NextResponse.json(
                { error: 'Lỗi xử lý phản hồi từ AI.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ ...analysis, remaining: usageCheck.limit - usageCheck.usage });

    } catch (error) {
        console.error('Calorie Analyze error:', error);
        return NextResponse.json(
            { error: 'Đã xảy ra lỗi khi phân tích hình ảnh.' },
            { status: 500 }
        );
    }
}

