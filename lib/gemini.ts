import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeRepos(query: string, repos: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("ยังไม่ได้ตั้งค่า GEMINI_API_KEY หรือ Key ไม่ถูกต้อง กรุณาตรวจสอบไฟล์ .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const context = repos
    .map(
      (r, i) =>
        `${i + 1}. ${r.fullName} - ${r.stars} stars - Language: ${r.language} - Last Update: ${r.lastUpdate}\nDescription: ${r.description}`
    )
    .join("\n\n");

  const prompt = `คุณคือ AI ที่เชี่ยวชาญการวิเคราะห์ GitHub repositories. 
หัวข้อที่ผู้ใช้ต้องการค้นคว้า: "${query}"

ด้านล่างนี้คือรายการ repository ที่เกี่ยวข้องที่พบจาก GitHub:
${context}

งานของคุณ:
1. วิเคราะห์ภาพรวมของเทคโนโลยีหรือโซลูชันในหัวข้อนี้
2. สรุปแนวโน้ม (Trends) ของ ecosystem นี้
3. เลือก 3-5 repository ที่โดดเด่นและแนะนำว่าควรเลือกใช้อันไหนในกรณีใด (Use Cases)
4. เปรียบเทียบข้อดีและข้อเสียแบบเป็นรายการ (Bullet points)
5. ให้คำแนะนำสุดท้ายสำหรับผู้ที่กำลังจะเริ่มต้นโปรเจกต์ในหัวข้อนี้

ตอบเป็นภาษาไทยในรูปแบบ Markdown ที่สวยงาม.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      throw new Error("Gemini API Quota หมดแล้ว (Too Many Requests) กรุณารอสักครู่หรือเปลี่ยนไปใช้ API Key อื่น");
    }
    throw error;
  }
}
