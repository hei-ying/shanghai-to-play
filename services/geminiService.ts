
import { GoogleGenAI, Type } from "@google/genai";
import { TravelTip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- 预设的静态数据（用于无VPN环境下的优雅降级） ---
const MOCK_TIPS: Record<string, TravelTip> = {
  "佘山国家森林公园": {
    description: "上海唯一的自然山林胜地，拥有著名的天文台和圣母大殿。在这里可以俯瞰魔都平原，感受历史与自然的交融。",
    proTip: "建议从西佘山进，东佘山出。天文台需要单独预约，日落时分在山顶看夕阳非常出片！",
    attractions: ["佘山天文台", "秀道者塔", "天主教圣母大殿"]
  },
  "东平国家森林公园": {
    description: "位于崇明岛上的天然氧吧，杉树林高耸入云，非常适合骑行和烧烤。逃离城市喧嚣的绝佳去处。",
    proTip: "这里的房车营地非常火爆，想过夜一定要提前两周预订。带上野餐垫，草坪非常大！",
    attractions: ["水杉大道", "房车露营地", "孔雀园"]
  },
  "滨江森林公园": {
    description: "位于黄浦江、长江、东海三水交汇处。这里有上海最长的江岸线，保留了大量原生植被。",
    proTip: "春天是看杜鹃花的好季节。公园最北端的观海平台可以看到壮观的'三水并流'。",
    attractions: ["滨江岸线", "杜鹃园", "果园采摘"]
  },
  "辰山植物园": {
    description: "华东地区规模最大的植物园，拥有壮观的矿坑花园和巨大的温室群。一年四季花开不断。",
    proTip: "一定要去3号门的矿坑花园打卡，拍照自带废土风滤镜。温室里的仙人掌也是网红打卡点。",
    attractions: ["矿坑花园", "热带花果馆", "孤生石"]
  },
  "共青森林公园": {
    description: "充满法式浪漫的森林公园，小火车和跑马场是童年回忆。这里有着如油画般的莫奈花园景观。",
    proTip: "想要拍出'莫奈花园'的感觉，建议清晨或傍晚去华明桥附近的河边。记得带驱蚊水！",
    attractions: ["森林小火车", "华明桥", "松涛幽谷"]
  },
  "海湾国家森林公园": {
    description: "上海最大的人工森林，此时正是赏梅的好去处。既有森林的静谧，又有湖泊的灵动。",
    proTip: "公园非常大，强烈建议租一辆自行车或者购买电瓶车票。可以在湖上划皮划艇。",
    attractions: ["梅园", "白鸟湖", "森林卡丁车"]
  },
  "顾村公园": {
    description: "上海赏樱的代名词。每年樱花节人山人海，但粉色的花海确实浪漫至极。",
    proTip: "如果不喜欢人挤人，可以避开樱花节主会场，去二期区域，那里也有很多樱花且人少。",
    attractions: ["樱花林", "恐龙园", "悦林湖"]
  },
  "世纪公园": {
    description: "市中心的绿肺，交通最便利的大型公园。有着大片的草坪和镜天湖，是周末野餐的首选。",
    proTip: "可以租一辆多人自行车环湖骑行。公园周围有很多不错的美术馆和餐厅，可以安排一日游。",
    attractions: ["镜天湖", "世纪花钟", "蒙特利尔园"]
  },
  "世博文化公园-双子山": {
    description: "上海市区最新的人造山地标，在平原上拔地而起的'双子星'。可以体验在市中心登山的奇妙感觉。",
    proTip: "登山需要提前小程序预约！山顶视野极佳，可以同框拍摄卢浦大桥和陆家嘴三件套。",
    attractions: ["山顶观景台", "十一孔桥", "温室花园"]
  },
  "工作累了，周末哪也不想去": {
    description: "最舒适的五星级景点——你的家。这里没有拥挤的人潮，只有无限的WiFi和快乐肥宅水。",
    proTip: "把手机调成静音，点一份平时舍不得点的豪华外卖，找一部长电影，享受躺平的艺术。",
    attractions: ["温暖的被窝", "外卖APP", "Netflix/B站"]
  }
};

// 预设的高质量图片链接 (Unsplash Source)
const MOCK_IMAGES: Record<string, string> = {
  "佘山国家森林公园": "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=800&auto=format&fit=crop", // Mountain/Forest
  "东平国家森林公园": "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=800&auto=format&fit=crop", // Forest path
  "滨江森林公园": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop", // Coast/Water
  "辰山植物园": "https://images.unsplash.com/photo-1620310860368-29a320349f7e?q=80&w=800&auto=format&fit=crop", // Greenhouse/Flowers
  "共青森林公园": "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=800&auto=format&fit=crop", // Forest/Green
  "海湾国家森林公园": "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop", // Nature/Trees
  "顾村公园": "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=800&auto=format&fit=crop", // Cherry Blossom
  "世纪公园": "https://images.unsplash.com/photo-1596327027874-9f7962df9449?q=80&w=800&auto=format&fit=crop", // Park/Grass
  "世博文化公园-双子山": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop", // Mountain View
  "工作累了，周末哪也不想去": "https://images.unsplash.com/photo-1528696892704-5e1122852276?q=80&w=800&auto=format&fit=crop", // Home/Cozy
};

// 辅助函数：带超时的 Promise
const timeoutPromise = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request Timed Out"));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
};

export const fetchLocationDetails = async (locationName: string): Promise<TravelTip> => {
  const isStayHome = locationName.includes("周末哪也不想去") || locationName.includes("宅家");
  const prompt = isStayHome
    ? "生成一份关于'周末宅家休息'的幽默且放松的指南。把它当作一个'旅游目的地'来介绍。"
    : `请为上海的"${locationName}"生成一份有趣且简短的旅行指南。`;

  try {
    // 设置 3 秒超时。如果需要 VPN 但没有，请求会挂起，超时后直接使用 Mock 数据
    const response = await timeoutPromise(
      ai.models.generateContent({
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
      }),
      3000 // 3秒超时
    );

    const text = response.text;
    if (!text) throw new Error("AI 未返回响应");
    
    return JSON.parse(text) as TravelTip;
  } catch (error) {
    console.warn("API Unavailable (Network/Timeout), utilizing Mock Data:", error);
    
    // 智能匹配预设数据
    const mockKey = Object.keys(MOCK_TIPS).find(key => locationName.includes(key));
    if (mockKey) {
      return MOCK_TIPS[mockKey];
    }

    // 最后的通用保底
    return {
      description: `探索${locationName}的美丽风光。这是一个放松身心的好去处。`,
      proTip: "建议查看天气预报，并带好防晒用品。",
      attractions: ["标志性景观", "休闲步道", "周边美食"]
    };
  }
};

export const fetchLocationImage = async (locationName: string): Promise<string | null> => {
  const isStayHome = locationName.includes("周末哪也不想去") || locationName.includes("宅家");
  
  const prompt = isStayHome 
    ? "A cozy, warm, lo-fi style illustration of a person relaxing at home on a weekend, playing video games or reading, snacks nearby, comfortable atmosphere, soft lighting." 
    : `A breathtaking, photorealistic travel photography shot of ${locationName} in Shanghai, China. Sunny weather, vibrant colors, wide angle, high resolution, cinematic lighting, 4k.`;

  try {
    // 同样设置超时，防止图片生成卡住 UI
    const response = await timeoutPromise(
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          }
        }
      }),
      5000 // 图片生成给 5 秒
    );

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.warn("AI Image Unavailable, utilizing Mock Image:", error);
    
    // 匹配预设图片
    const mockKey = Object.keys(MOCK_IMAGES).find(key => locationName.includes(key));
    if (mockKey) {
      return MOCK_IMAGES[mockKey];
    }
    
    // 返回通用的上海/风景图片
    return "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=800&auto=format&fit=crop"; 
  }
};
