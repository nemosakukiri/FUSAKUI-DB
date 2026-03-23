import React, { useState } from 'react';
import { Landmark, FileText, Newspaper, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import LandingPage from './LandingPage'; // 手順1で作ったファイルを読み込む

const NOTEBOOK_URL = "https://notebooklm.google.com/notebook/31de7a8b-3cf5-4cff-999c-ca1826a15ff0";

export default function App() {
  const [view, setView] = useState('landing');
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ date: '', location: '', description: '', certified: false });

  const handleFinalSubmit = async () => {
    if (!formData.certified) return alert("誓約のチェックを入れてください。");
    setIsProcessing(true);
    try {
      const API_KEY = "AIzaSyBylSlz1LBQEtSAfv1KIUn9izfAVE_1-YY"; // ここを書き換え
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `行政法調査官として以下の報告を400字程度で法的分析してください。\n報告：${formData.description}`;
      const result = await model.generateContent(prompt);
      await addDoc(collection(db, "reports"), { ...formData, ai_analysis: result.response.text(), createdAt: serverTimestamp() });
      setIsSubmitted(true);
    } catch (e) { alert("エラー: " + e.message); }
    finally { setIsProcessing(false); }
  };

  if (isSubmitted) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6 text-center text-slate-900 font-sans">
      <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-8" />
        <h2 className="text-3xl font-black mb-4 font-serif">記録完了</h2>
        <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">トップに戻る</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A202C] font-sans flex text-left">
      <aside className="hidden lg:flex flex-col fixed h-screen w-64 bg-[#f1f4f6] border-r border-[#abb3b7]/20 p-8 z-50">
        <h1 className="font-serif text-2xl font-black italic mb-10">Forensic Ed.</h1>
        <nav className="flex-1 space-y-1">
          <button onClick={() => {setView('landing'); setStep(1)}} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='landing' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><Landmark className="w-4 h-4"/> トップ</button>
          <button onClick={() => setView('reporting')} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='reporting' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><FileText className="w-4 h-4"/> 体験を報告</button>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200">
          <a href="https://misconduct-db.vercel.app/" className="flex items-center gap-3 opacity-60 mb-4 hover:opacity-100 transition-all"><Newspaper className="w-4 h-4"/><p className="text-[10px] font-bold text-slate-500 uppercase">不祥事ニュース</p></a>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 md:p-12 lg:p-20 flex flex-col items-center overflow-y-auto w-full">
        {view === 'landing' ? <LandingPage onStart={() => setView('reporting')} NOTEBOOK_URL={NOTEBOOK_URL} /> : (
          <div className="max-w-3xl w-full animate-in slide-in-from-bottom-4">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-50">
              <h2 className="text-xl font-black font-serif italic mb-8 border-b pb-4">Step {step}/4</h2>
              <div className="min-h-[250px]">
                {step === 1 && <div className="space-y-4 text-left"><label className="text-[10px] font-black text-slate-400 uppercase">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl border-none outline-none" /></div>}
                {step === 2 && <div className="space-y-4 text-left"><label className="text-[10px] font-black text-slate-400 uppercase">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="〇〇市役所" className="w-full bg-slate-50 p-6 rounded-2xl border-none outline-none" /></div>}
                {step === 3 && <div className="space-y-4 text-left"><label className="text-[10px] font-black text-slate-400 uppercase">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 p-6 rounded-3xl min-h-[300px] border-none outline-none" placeholder="具体的に..." /></div>}
                {step === 4 && <div className="space-y-8 text-left"><div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 text-xs italic">送信するとAIが法的解析を行い保存されます。</div><label className="flex items-start gap-4 cursor-pointer"><input type="checkbox" checked={formData.certified} onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="mt-1 w-6 h-6 rounded-lg text-[#000666]" /><span className="text-sm font-bold text-slate-600">誓約して登録を承認します。</span></label></div>}
              </div>
              <div className="mt-12 pt-8 border-t flex justify-between items-center">
                <button onClick={() => step > 1 ? setStep(step - 1) : setView('landing')} className="text-[11px] font-black uppercase text-slate-300">Back</button>
                {step < 4 ? <button onClick={() => setStep(step + 1)} className="bg-[#000666] text-white px-12 py-4 rounded-2xl font-bold uppercase text-[11px]">Next</button> : 
                <button onClick={handleFinalSubmit} disabled={isProcessing} className={`px-16 py-5 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-3 text-xs uppercase ${isProcessing ? 'bg-slate-400' : 'bg-blue-600 hover:scale-105'}`}>{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}</button>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
