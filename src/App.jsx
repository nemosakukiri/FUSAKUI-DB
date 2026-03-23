import React, { useState, useEffect } from 'react';
import { 
  Gavel, Sparkles, Calendar, MapPin, FileText, ArrowRight, Newspaper, 
  ChevronLeft, CheckCircle2, ShieldCheck, ShieldAlert, Loader2, Landmark, Clock
} from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// Google公式のAI部品を読み込む
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function App() {
  const [view, setView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ date: '', location: '', description: '', certified: false });

  // --- 【ここがポイント】ブラウザから直接AIを動かす関数 ---
  const runDirectAIAnalysis = async () => {
    // Vercelの設定にある鍵を読み込みます（Viteの仕組みで読み込めるようにします）
    // ※もし動かない場合は、ここに直接 "AIza..." を書いてもOKです（自分専用サイトなので）
    const API_KEY = "AIzaSyB5K73evEK33c3VIOlIEkOz2c1IRAiltWM"; 

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // 制限の緩い 1.5-flash を使用
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `あなたは日本の行政法と憲法に精通した「判事」兼「調査官」です。
      以下の被害報告について、憲法25条や行政手続法7条等に照らした法的分析レポートを作成してください。
      
      【報告内容】: ${formData.description}
      
      【出力ルール】:
      1. 客観的な事実に基づき、どの条文に抵触する可能性があるか詳しく解説してください。
      2. 相談者が次にとるべき具体的アクション（書面提出等）を提示してください。
      3. 回答は400文字程度、日本語で。`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error("AI Analysis Error:", e);
      return "（AI解析中にエラーが発生しましたが、報告は保存されます）";
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.certified) return alert("誓約のチェックを入れてください。");
    setIsProcessing(true);

    try {
      // 1. ブラウザからAIに直接聞く（Vercelを通さないので10秒制限なし！）
      const analysisResult = await runDirectAIAnalysis();

      // 2. Firebaseに保存
      await addDoc(collection(db, "reports"), { 
        ...formData, 
        ai_analysis: analysisResult,
        createdAt: serverTimestamp() 
      });

      setIsSubmitted(true);
    } catch (e) {
      alert("エラーが発生しました: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- UI部分は以前と同じ（省略せずに全て含めています） ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center animate-in zoom-in duration-500 text-slate-900">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-8" />
          <h2 className="text-3xl font-black mb-4 font-serif">記録完了</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">法的解析を経て、証言がアーカイブされました。</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A202C] font-sans flex text-left">
      <aside className="hidden lg:flex flex-col fixed h-screen w-64 bg-[#f1f4f6] border-r border-[#abb3b7]/20 p-8 z-50">
        <div className="mb-10 text-slate-900"><h1 className="font-serif text-2xl font-black italic">Forensic Ed.</h1></div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => setView('landing')} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg ${view==='landing' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><Landmark className="w-4 h-4"/> トップ</button>
          <button onClick={() => setView('reporting')} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg ${view==='reporting' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><FileText className="w-4 h-4"/> 体験を報告</button>
        </nav>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 md:p-12 lg:p-20 flex flex-col items-center">
        {view === 'landing' ? (
          <section className="max-w-5xl w-full">
            <h2 className="text-5xl md:text-8xl font-black font-serif italic text-slate-900 mb-12">Evidence.</h2>
            <div className="bg-[#000666] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl text-left">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter">不作為を、法的証拠に変える。</h2>
              <button onClick={() => setView('reporting')} className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold">報告を作成する</button>
            </div>
          </section>
        ) : (
          <div className="max-w-3xl w-full text-slate-900">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl">
              <h2 className="text-xl font-black font-serif italic mb-12 border-b pb-6 text-left">Reporting System</h2>
              {currentStep === 1 && <input type="date" className="w-full bg-slate-50 p-6 rounded-2xl border-none mb-4" onChange={(e) => setFormData({...formData, date: e.target.value})} />}
              {currentStep === 2 && <input type="text" placeholder="場所" className="w-full bg-slate-50 p-6 rounded-2xl border-none mb-4" onChange={(e) => setFormData({...formData, location: e.target.value})} />}
              {currentStep === 3 && <textarea className="w-full bg-slate-50 p-6 rounded-3xl min-h-[300px] border-none mb-4" placeholder="詳細な事実を記述..." onChange={(e) => setFormData({...formData, description: e.target.value})} />}
              {currentStep === 4 && (
                <div className="p-8 bg-blue-50 rounded-3xl text-left">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> AI Direct Analysis</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">ブラウザから直接AIが解析を行います。Vercelのタイムアウト制限を受けないため、より詳細な分析が可能です。</p>
                  <label className="mt-8 flex items-center gap-3 cursor-pointer"><input type="checkbox" onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="w-6 h-6 rounded-lg" /> <span className="text-sm font-bold">内容は事実です</span></label>
                </div>
              )}
              <div className="mt-12 flex justify-between">
                <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setView('landing')} className="text-slate-300 font-bold uppercase text-xs tracking-widest">Back</button>
                {currentStep < 4 ? (
                  <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-[#000666] text-white px-10 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest">Next</button>
                ) : (
                  <button onClick={handleFinalSubmit} disabled={isProcessing} className="bg-blue-600 text-white px-16 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest">
                    {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Analyzing...</> : "Submit to Archive"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
