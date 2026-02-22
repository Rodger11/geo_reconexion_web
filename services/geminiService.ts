import { GoogleGenAI } from "@google/genai";

// Initialize AI cautiously to handle potential missing keys gracefully in UI
const getAI = () => {
  const key = process.env.API_KEY || "dummy_key_for_ui_render_if_missing";
  return new GoogleGenAI({ apiKey: key });
};

export const analyzeImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image, // handle data URI prefix
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });

    let imageUrl = "";
    // The response might contain text and image parts.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break; // Return first image found
      }
    }

    if (!imageUrl) {
      throw new Error("No image returned from Gemini");
    }
    return imageUrl;
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};
