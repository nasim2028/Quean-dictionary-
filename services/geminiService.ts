import { GoogleGenAI, Type, Chat } from "@google/genai";
import { WordEntry } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchQuranicNuances = async (topic: string): Promise<WordEntry[]> => {
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const systemInstruction = `
    You are an expert Quranic scholar and linguist fluent in Bengali and Arabic. 
    Your task is to explain the nuances of different Arabic words used in the Quran related to a specific topic provided by the user.
    
    For each word, provide:
    1. The Arabic spelling (with vowels/tashkeel).
    2. Bengali Transliteration.
    3. Literal Bengali Meaning.
    4. Deep Nuance (The specific context or shade of meaning this word implies in the Quran, distinct from synonyms).
    5. A representative Surah and Verse number (e.g., সূরা আল-বাকারা ২:২).
    
    Return the response strictly as a JSON array.
  `;

  const prompt = `Topic: "${topic}". Provide 3 to 5 distinct Quranic words related to this topic in Bengali.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              arabic: { type: Type.STRING, description: "Arabic word with tashkeel" },
              transliteration: { type: Type.STRING, description: "Bengali pronunciation" },
              meaning: { type: Type.STRING, description: "Literal meaning in Bengali" },
              nuance: { type: Type.STRING, description: "Detailed explanation of the word's usage and depth in Bengali" },
              reference: { type: Type.STRING, description: "Surah Name and Verse Number in Bengali" },
              category: { type: Type.STRING, description: "The general topic category (e.g., Soul, Time)" }
            },
            required: ["arabic", "transliteration", "meaning", "nuance", "reference"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as WordEntry[];
  } catch (error) {
    console.error("Error fetching data from Gemini:", error);
    throw error;
  }
};

export const createChatSession = (): Chat => {
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `
        আপনি একজন প্রাজ্ঞ কোরআন গবেষক, ভাষাবিদ এবং আধ্যাত্মিক মেন্টর। আপনি বাংলা এবং আরবি ভাষায় পারদর্শী।
        আপনার উদ্দেশ্য হলো ব্যবহারকারীদের কোরআনের শব্দের গভীর অর্থ, ব্যুৎপত্তি (Etymology) এবং ব্যাখ্যা সম্পর্কে সহায়তা করা।
        
        আপনার আচরণের নিয়মাবলি:
        ১. সর্বদা সাবলীল বাংলায় উত্তর দেবেন।
        ২. উত্তরগুলো হবে তথ্যবহুল, গভীর কিন্তু সহজবোধ্য।
        ৩. ব্যবহারকারীর প্রশ্নের সাথে প্রাসঙ্গিক কোরআনের আয়াত বা হাদিস উল্লেখ করার চেষ্টা করবেন।
        ৪. যদি ব্যবহারকারী এমন কোনো প্রশ্ন করে যা কোরআন বা ইসলামের সাথে সম্পর্কিত নয়, তবে বিনয়ের সাথে তাকে মূল বিষয়ের দিকে ফিরিয়ে আনার চেষ্টা করবেন অথবা সংক্ষেপে উত্তর দেবেন।
        ৫. আপনার টোন হবে শান্ত, শ্রদ্ধাপূর্ণ এবং উৎসাহব্যঞ্জক।
      `,
    },
  });
};