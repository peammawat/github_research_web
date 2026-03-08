# GitHub Research Pro 🚀

ระบบค้นหาและตรวจสอบรายละเอียด GitHub Repository แบบเจาะลึก (Deep Search & Analysis) พัฒนาด้วย Next.js 15 และ Tailwind CSS v4

## ✨ ฟีเจอร์หลัก (Key Features)

- **🔍 Smart Search:** ค้นหา Repository จาก GitHub REST API พร้อมระบบกรองภาษา (Language) และจำนวนดาว (Stars)
- **🔎 Deep README Scan:** ระบบดึงไฟล์ `README.md` ของแต่ละโปรเจกต์มาสแกนหา Keyword ที่คุณต้องการโดยเฉพาะ (เช่น License, Specific Features, Tech Stack)
- **🛠️ Tech Stack Selection:** เลือก Tech Stack ที่ต้องการ (React, Next.js, Docker, ฯลฯ) เพื่อให้ระบบตรวจสอบความถูกต้องในไฟล์ README อัตโนมัติ
- **👤 User/Org Filter:** ระบุชื่อผู้ใช้หรือองค์กรเพื่อจำกัดขอบเขตการค้นหาให้แม่นยำขึ้น
- **👥 Real-time Active Users:** แสดงจำนวนผู้ใช้งานที่กำลังออนไลน์อยู่บนเว็บไซต์ในขณะนั้น
- **🌙 Modern Dark UI:** ดีไซน์โทนสีมืด (Slate-950) พร้อมเอฟเฟกต์ Glassmorphism และระบบ Badge สถานะ (✅/❌)
- **⚡ High Performance:** พัฒนาด้วย Next.js 15 (App Router) และรันผ่าน systemd บน Production

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS v4, Lucide React
- **Backend:** Next.js Route Handlers (Node.js)
- **API Integration:** GitHub REST API
- **Icons:** Lucide React
- **Deployment:** Apache Reverse Proxy + systemd

## 🚀 การติดตั้งและใช้งาน (Installation)

1. **Clone Repository:**
   ```bash
   git clone https://github.com/peammawat/github_research_web.git
   cd github_research_web
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   สร้างไฟล์ `.env` และใส่ API Key ของคุณ:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   # (Optional) GEMINI_API_KEY=your_gemini_key_if_enabled
   ```

4. **Run Development:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## 📝 วิธีการใช้งาน

1. กรอก **Keyword** หลักที่ต้องการค้นหา (เช่น `Discord Bot`)
2. (ไม่บังคับ) ระบุ **GitHub Username** หากต้องการเจาะจงเจ้าของโปรเจกต์
3. เลือก **Tech Stack** ที่ต้องการตรวจสอบ (เช่น `Node.js`, `Typescript`)
4. เพิ่ม **รายละเอียดอื่นๆ** ที่ต้องการสแกนหาใน README (เช่น `PromptPay`, `MIT License`)
5. กด **"ค้นหาและวิเคราะห์"** ระบบจะแสดงผลลัพธ์พร้อมสถานะการตรวจสอบ (✅ พบ / ❌ ไม่พบ) ในแต่ละหัวข้อ

---
พัฒนาโดย [Peammawat](https://github.com/peammawat)
