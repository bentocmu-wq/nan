import React, { useState } from 'react';
import { Loader2, FileSearch, Stethoscope, AlertCircle, ArrowRight, Heart, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Diagnosis {
  name: string;
  evidence: string;
  confidence: string;
}

interface ApiResponse {
  status: 'success' | 'insufficient_data';
  message?: string;
  diagnoses?: Diagnosis[];
  error?: string;
}

export default function App() {
  const [patientData, setPatientData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleAnalyze = async () => {
    if (!patientData.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ status: 'insufficient_data', error: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้จ้ะ ลองใหม่อีกครั้งนะ' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 p-4 sm:p-6 lg:p-12 tracking-wide font-sans">
      <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12">
        
        {/* Header */}
        <header className="flex flex-col items-center text-center space-y-4 lg:space-y-5 pt-2 lg:pt-4">
          <div className="h-24 w-24 lg:h-32 lg:w-32 bg-rose-50 rounded-full shadow-md overflow-hidden border-4 border-white flex items-center justify-center">
            <img src="/nurse.png" alt="Nurse Nanda" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-800 leading-snug">
              ป้านัน
            </h1>
            <h2 className="text-xl sm:text-2xl font-medium text-stone-500 mt-2">
              ผู้ช่วยตั้ง Nursing Diagnosis
            </h2>
            <p className="text-rose-400 mt-3 lg:mt-4 text-base sm:text-lg font-medium flex items-center justify-center gap-2">
              <Heart size={18} className="fill-rose-100" />
              <span>อ้างอิง NANDA-I 2024-2026</span>
              <Heart size={18} className="fill-rose-100" />
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch pb-12">
          
          {/* Input Section */}
          <section className="bg-white rounded-3xl lg:rounded-[2rem] shadow-sm border border-stone-100 p-5 sm:p-6 lg:p-8 flex flex-col space-y-5 lg:space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200"></div>
            
            <label htmlFor="patient-data" className="text-lg sm:text-xl font-bold text-stone-700 flex items-center space-x-3">
              <Edit3 size={24} className="text-rose-400" />
              <span>บันทึกอาการผู้ป่วย</span>
            </label>
            
            <div className="relative flex-grow">
               <textarea
                id="patient-data"
                value={patientData}
                onChange={(e) => setPatientData(e.target.value)}
                placeholder="เล่าอาการให้ป้านันฟังหน่อยจ้ะ เช่น อุณหภูมิร่างกาย อัตราการเต้นของหัวใจ ความเจ็บปวด หรือพฤติกรรมต่างๆ..."
                className="w-full h-full min-h-[250px] lg:min-h-[320px] p-5 sm:p-6 text-stone-700 bg-stone-50 hover:bg-stone-50/50 border-2 border-transparent rounded-2xl lg:rounded-[1.5rem] focus:outline-none focus:border-rose-200 focus:bg-white transition-all resize-none text-base sm:text-lg leading-relaxed placeholder:text-stone-400"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !patientData.trim()}
              className="w-full py-4 lg:py-5 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-lg sm:text-xl font-semibold rounded-2xl transition-all flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin text-rose-300" />
                  <span>ป้านันกำลังเปิดตำรา...</span>
                </>
              ) : (
                <>
                  <span>ให้ป้านันช่วยวิเคราะห์ให้</span>
                  <ArrowRight size={24} className="text-rose-300" />
                </>
              )}
            </button>
          </section>

          {/* Results Section */}
          <section className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-8 flex flex-col h-full min-h-[500px]">
            <h2 className="text-xl font-bold text-stone-700 flex items-center space-x-3 mb-8">
              <Stethoscope size={24} className="text-rose-400" />
              <span>ผลการวินิจฉัยจากป้านัน</span>
            </h2>

            <div className="flex-grow flex flex-col">
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex-grow flex flex-col items-center justify-center text-stone-400 p-8 text-center"
                  >
                    <FileSearch size={64} className="mb-6 text-stone-200 stroke-[1.5]" />
                    <p className="text-lg">กรอกข้อมูล อาการ/อาการแสดง Subjective /Objective Data<br/>เพื่อให้ป้านันช่วยสรุป Nursing Diagnosis ให้จ๊ะ</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    key="loading"
                    className="flex-grow flex flex-col items-center justify-center space-y-6 text-rose-400 overflow-hidden w-full"
                  >
                    <div className="relative w-full h-24 mb-4">
                      <motion.div
                        className="absolute text-7xl flex items-center justify-center"
                        style={{ top: "0", bottom: "0" }}
                        animate={{ x: ["-100vw", "100vw"] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2.2, 
                          ease: "linear" 
                        }}
                      >
                        🏃‍♀️💨
                      </motion.div>
                    </div>
                    <p className="text-xl font-medium animate-pulse text-stone-500">ป้านันกำลังวิ่งไปเปิดตำรา...</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {result.error && (
                      <div className="p-5 bg-red-50 text-red-800 rounded-2xl border border-red-100 flex items-start space-x-4">
                        <AlertCircle size={24} className="flex-shrink-0 mt-0.5 text-red-400" />
                        <div>
                          <h3 className="font-bold text-lg">โอ๊ะ! เกิดข้อผิดพลาด</h3>
                          <p className="mt-1 text-red-700">{result.error}</p>
                        </div>
                      </div>
                    )}

                    {result.message && (
                      <div className={`p-5 rounded-2xl border flex items-start space-x-4 ${result.status === 'success' && result.diagnoses?.length ? 'bg-[#f6fcf8] text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
                        <AlertCircle size={24} className={`flex-shrink-0 mt-0.5 ${result.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`} />
                        <p className="text-lg leading-relaxed">{result.message}</p>
                      </div>
                    )}

                    {result.status === 'success' && result.diagnoses && result.diagnoses.length > 0 && (
                      <div className="space-y-5">
                        {result.diagnoses.map((diag, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="relative p-6 pt-7 border border-stone-200 rounded-[1.5rem] bg-[#fcfbf9] overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-600 font-bold rounded-br-2xl text-sm">
                              {index + 1}
                            </div>
                            <h3 className="font-bold text-xl text-stone-800 mb-4 ml-6 leading-tight">
                              {diag.name}
                            </h3>
                            <div className="space-y-4">
                              <div className="bg-white p-4 rounded-xl border border-stone-100">
                                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2 block">หลักฐานสนับสนุน</span>
                                <p className="text-stone-700 leading-relaxed text-lg">{diag.evidence}</p>
                              </div>
                              <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl border border-stone-100 w-fit">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">ความเชื่อมั่น</span>
                                <div className="h-4 w-px bg-stone-200"></div>
                                <div className="flex items-center space-x-2">
                                  <div className={`h-3 w-3 rounded-full ${
                                    diag.confidence.includes('สูง') ? 'bg-emerald-400' : 
                                    diag.confidence.includes('ต่ำ') ? 'bg-rose-400' : 'bg-amber-400'
                                  }`} />
                                  <p className="text-stone-800 font-semibold">{diag.confidence}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {result.status === 'success' && result.diagnoses && result.diagnoses.length > 0 && (
                      <div className="mt-6 p-4 bg-stone-100/80 rounded-xl border border-stone-200">
                        <p className="text-xs text-stone-500 leading-relaxed text-center font-medium">
                          ผลลัพธ์นี้เป็นข้อเสนอแนะเพื่อสนับสนุนการตัดสินใจทางการพยาบาล ผู้ใช้งานต้องพิจารณาร่วมกับข้อมูลทางคลินิกและวิจารณญาณทางวิชาชีพ
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
