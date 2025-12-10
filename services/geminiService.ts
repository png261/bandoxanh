
// Removed client-side GoogleGenAI import to prevent key exposure and usage errors
import { GptAnalysis } from "@/types";

export const identifyWaste = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('/api/identify', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    // The API now returns the JSON object directly, but the component expects a stringified JSON
    // because it parses it. To maintain compatibility with the component's existing logic for now:
    return JSON.stringify(data);

  } catch (error) {
    console.error("Error identifying waste via API:", error);
    if (error instanceof Error) {
      return JSON.stringify({ error: error.message });
    }
    return JSON.stringify({ error: "Đã xảy ra lỗi không xác định khi kết nối với máy chủ." });
  }
};

export const identifyDiyMaterials = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('/api/diy/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    console.error("Error identifying DIY materials:", error);
    if (error instanceof Error) {
      return JSON.stringify({ error: error.message });
    }
    return JSON.stringify({ error: "Đã xảy ra lỗi khi phân tích nguyên liệu." });
  }
};
