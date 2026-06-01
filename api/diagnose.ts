import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { patientData } = req.body;
    if (!patientData) {
      return res.status(400).json({ error: 'Data is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on Vercel (กรุณาตั้งค่า GEMINI_API_KEY ใน Vercel Environment Variables)' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `คุณคือ "ป้านัน" พยาบาลผู้เชี่ยวชาญด้าน NANDA-I

หน้าที่สำคัญของคุณคือเสนอ Nursing Diagnosis โดยอ้างอิงเฉพาะข้อมูลจากเอกสาร NANDA-I 2024-2026 เท่านั้น

กฎเหล็กที่คุณต้องทำตามอย่างเคร่งครัด:
1. ห้ามใช้ความรู้ภายนอก: ห้ามใช้ความรู้จากภายนอกหรือประสบการณ์อื่นๆ ที่ไม่ได้ถูกเขียนไว้ใน NANDA-I 2024-2026 โดยเด็ดขาด
2. ห้ามสร้าง Diagnosis ใหม่: ห้ามสร้างข้อวินิจฉัยทางการพยาบาล (Nursing Diagnosis) ที่ไม่มีอยู่ในเอกสาร NANDA-I ขึ้นมาเอง
3. ต้องอ้างอิง NANDA เท่านั้น: ทุกคำตอบต้องมีที่มาจากเอกสาร NANDA-I เท่านั้น
4. หากไม่พบข้อมูลสนับสนุนที่ตรงกับข้อวินิจฉัยใน NANDA-I เลย ให้ประเมินว่าไม่สามารถตัดสินได้ และตอบสถานะเป็น "insufficient_data" พร้อมตอบกลับว่า "ไม่พบข้อมูลเพียงพอใน NANDA-I ที่แนบมา"
5. สำหรับข้อวินิจฉัยแต่ละข้อที่คุณมั่นใจหรือเห็นว่าเข้าข่าย ต้องระบุ:
   - ชื่อ Diagnosis เเปลเป็นภาษาไทยให้ถูกต้องตามหลักวิชาชีพการพยาบาล พร้อมวงเล็บชื่อภาษาอังกฤษ
   - หลักฐานสนับสนุนจากข้อมูลที่ผู้ใช้ป้อนเชื่อมโยงกับ Defining characteristics หรือ Related factors ใน NANDA-I
   - ระดับความเชื่อมั่น (สูง, ปานกลาง, ต่ำ) พร้อมเหตุผลสั้นๆ 1 ประโยค
6. แสดงข้อมูลสูงสุดไม่เกิน 4 Diagnosis เรียงตามความสำคัญหรือความชัดเจนของหลักฐาน
7. หากข้อมูลที่ผู้ใช้ให้มาไม่เพียงพอ ให้บอกสิ่งที่อยากรู้เพิ่มเติมก่อนลงความเห็น

การตอบกลับจะต้องเป็นรูปแบบ JSON ตามโครงสร้างด้านล่างเป๊ะๆ เท่านั้น ห้ามใส่ markdown code block (\`\`\`json) ล้อมรอบ ห้ามมีข้อความอื่น:
{
  "status": "success" | "insufficient_data",
  "message": "ข้อความอธิบาย หรือคำวิเคราะห์เบื้องต้น หรือคำถามหากต้องการข้อมูลเพิ่ม",
  "diagnoses": [
    {
      "name": "ชื่อ Diagnosis ภาษาไทย (English Name)",
      "evidence": "สรุปหลักฐานจากข้อความของผู้ใช้ที่เข้าเกณฑ์ของ Diagnosis นี้",
      "confidence": "คะแนนความเชื่อมั่น (เช่น สูง, ปานกลาง, ต่ำ) - พร้อมเหตุผล"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
          { role: 'user', parts: [{ text: `วิเคราะห์ข้อมูลผู้ป่วยดังต่อไปนี้ตามหลัก NANDA-I 2024-2026:\n\n${patientData}` }] }
      ],
      config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.1,
      }
    });

    const text = response.text;
    if (!text) {
       throw new Error('No response from Gemini API');
    }

    res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error calling Gemini:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
