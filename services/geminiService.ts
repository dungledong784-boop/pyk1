import { GoogleGenAI } from "@google/genai";

export const analyzeDomain = async (domain: string): Promise<string> => {
  // Always retrieve the latest API key from the environment variable.
  // This ensures that if the user updates the key via window.aistudio.openSelectKey(),
  // the new key is used for subsequent requests.
  const apiKey = process.env.API_KEY || '';

  if (!apiKey) {
    return "API Key 未配置，无法使用智能分析功能。请在设置中配置 API Key。";
  }

  try {
    // Create a new instance for each request to use the current API Key
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `请简要分析域名 "${domain}"。
      1. 判断它是否通常用于广告、追踪或恶意软件。
      2. 如果是安全的，说明它的用途。
      3. 给出建议：拦截 还是 放行？
      请用中文回答，保持简洁（100字以内）。`,
    });

    return response.text || "无法获取分析结果。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "分析过程中发生错误，请检查网络或 API Key 设置。";
  }
};