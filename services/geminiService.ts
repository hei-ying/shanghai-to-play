
import { GoogleGenAI, Type } from "@google/genai";
import { TravelTip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchLocationDetails = async (locationName: string): Promise<TravelTip> => {
  // Special handling for the "Stay Home" option to ensure AI context is correct
  const isStayHome = locationName.includes("周末哪也不想去") || locationName.includes("宅家");
  const prompt = isStayHome
    ? "生成一份关于'周末宅家休息'的幽默且放松的指南。把它当作一个'旅游目的地'来介绍。"
    : `请为上海的"${locationName}"生成一份有趣且简短的旅行指南。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "两句关于这个'景点'的精彩描述。",
            },
            proTip: {
              type: Type.STRING,
              description: "一条具体的建议（例如：最佳时间、隐藏景点或宅家零食）。",
            },
            attractions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "该地点的3个必做事项或景点列表。",
            },
          },
          required: ["description", "proTip", "attractions"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI 未返回响应");
    
    return JSON.parse(text) as TravelTip;
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback data
    if (isStayHome) {
       return {
        description: "家里是世界上最舒适的地方。这里没有拥挤的人群，只有无限的WiFi和零食。",
        proTip: "换上最舒适的睡衣，手机开启勿扰模式。",
        attractions: ["温暖的被窝", "外卖APP", "Netflix/B站"]
      };
    }

    return {
      description: `探索${locationName}的美丽风光。这是一个徒步、亲近自然和放松身心的绝佳去处。`,
      proTip: "建议穿着舒适的运动鞋，并带足饮用水！",
      attractions: ["公园正门", "中心湖区", "森林步道"]
    };
  }
};
