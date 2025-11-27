import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

// Initialize Gemini
// Note: In a real production app, API keys should not be exposed on the client side directly
// without proper restrictions, or calls should be proxied through a backend.
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || '';
const ai = new GoogleGenAI({ apiKey: apiKey });

// Mock data to use if API key is missing or for rapid prototyping
const MOCK_DESIGN_RESPONSE: AiResponse = {
  suggestedColor: "#FF5733",
  designDescription: "Desain modern dengan sentuhan geometris dan palet warna hangat, cocok untuk gaya streetwear urban.",
  texturePattern: "https://picsum.photos/512/512?random=1" // Placeholder texture
};

export const generateDesignFromText = async (prompt: string): Promise<AiResponse> => {
  if (!apiKey) {
    console.warn("No API Key found. Returning mock data.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    return MOCK_DESIGN_RESPONSE;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a fashion design assistant. Analyze this design request: "${prompt}". 
      Return a JSON object with a suggested hex color code, a short description (in Indonesian) of the design style, and a keyword for a pattern style.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedColor: { type: Type.STRING },
            designDescription: { type: Type.STRING },
            texturePattern: { type: Type.STRING, description: "A keyword describing the pattern, e.g., 'stripes', 'floral'" }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      suggestedColor: data.suggestedColor || "#ffffff",
      designDescription: data.designDescription || "Desain kustom berdasarkan permintaan.",
      // For this prototype, we map the keyword to a random placeholder image because actual image generation 
      // requires a different model/flow (Imagen) which might be slower or strictly paid.
      // In a full implementation, we would call an image generation model here.
      texturePattern: `https://picsum.photos/seed/${data.texturePattern || 'fashion'}/512/512`
    };

  } catch (error) {
    console.error("AI Generation Error:", error);
    return MOCK_DESIGN_RESPONSE;
  }
};

export const generateDesignFromImage = async (imageFile: File): Promise<AiResponse> => {
   // Simulating image analysis. 
   // In a real implementation: Convert File to base64, send to gemini-2.5-flash-image with a prompt.
   await new Promise(resolve => setTimeout(resolve, 2000));
   
   return {
     suggestedColor: "#3B82F6",
     designDescription: "Dianalisis dari gambar referensi: Gaya minimalis dengan aksen biru.",
     texturePattern: "https://picsum.photos/seed/blue/512/512"
   };
};

export const chatWithAiAssistant = async (history: {role: string, content: string}[], newMessage: string): Promise<string> => {
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Halo! Saya adalah asisten desain Clo Vsual (Mode Demo). Saya bisa memberikan saran tentang tren warna, kain, dan gaya untuk proyek fashion Anda.";
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful fashion design assistant for Clo Vsual. You speak primarily in Indonesian. You help designers, students, and garment factories with ideas.",
      },
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Maaf, saya tidak dapat menghasilkan respon saat ini.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Maaf, saya sedang mengalami gangguan koneksi. Silakan coba lagi nanti.";
  }
};