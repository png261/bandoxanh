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

        // Define accepted categories to match our database
        const CATEGORIES = ["Nhựa", "Giấy", "Kim loại", "Thủy tinh", "Vải", "Hữu cơ", "Điện tử", "Pin"];

        const prompt = `Phân tích hình ảnh này và xác định xem vật liệu chính trong ảnh thuộc về danh mục nào sau đây: ${CATEGORIES.join(', ')}. 
        Chỉ trả về danh sách các danh mục phù hợp nhất (ví dụ: ["Nhựa"] hoặc ["Giấy", "Nhựa"]). Không tự bịa ra danh mục mới.`;

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
                // We ask only for identified categories
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        identifiedCategories: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'Danh sách các danh mục vật liệu được xác định.'
                        }
                    },
                    required: ['identifiedCategories']
                }
            }
        });

        const replyText = response.text || "{}";
        let replyJson;
        try {
            replyJson = JSON.parse(replyText);
        } catch (e) {
            console.error("Failed to parse Gemini response:", replyText);
            return NextResponse.json(
                { error: 'Lỗi xử lý phản hồi từ AI.' },
                { status: 500 }
            );
        }

        // Filter projects from our database
        const identifiedCategories = replyJson.identifiedCategories || [];
        const { DIY_IDEAS } = await import('@/lib/diyData');

        const matchedProjects = DIY_IDEAS.filter(idea =>
            identifiedCategories.includes(idea.category)
        ).map(idea => ({
            title: idea.title,
            difficulty: idea.difficulty,
            materials: idea.materials,
            steps: idea.steps,
            videoUrl: idea.videoUrl
        }));

        // Fallback if no exact match or empty materials
        const result = {
            identifiedMaterials: identifiedCategories,
            projects: matchedProjects.length > 0 ? matchedProjects : []
        };

        return NextResponse.json({ ...result, remaining: usageCheck.limit - usageCheck.usage });

    } catch (error) {
        console.error('DIY Analyze error:', error);
        return NextResponse.json(
            { error: 'Đã xảy ra lỗi khi phân tích hình ảnh.' },
            { status: 500 }
        );
    }
}

