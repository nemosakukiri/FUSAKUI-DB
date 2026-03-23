import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, MapPin, FileText, ArrowRight, Newspaper, 
  ChevronLeft, CheckCircle2, ShieldCheck, ShieldAlert, Loader2, Landmark, Clock
} from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const SmallDonation = () => (
  <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
    <Sparkles className="w-5 h-5 text-blue-400 mx-auto mb-2" />
    <p className="text-[10px] text-slate-500 mb-3 font-serif italic">AI解析維持のため、ご支援をお願いします。</p>
    <a href="https://www.buymeacoffee.com/あなたのID" target="_blank" className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-full font-bold text-[10px] hover:scale-105 transition-all">
      ☕ Buy Me a Coffee
    </a>
  </div>
);

export default function App() {
  const [view, setView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [formData, setFormData] = useState({ date: '', location: '', description: '', certified: false });

  const runLegalAnalysis = async () => {
    if (!formData.description) return alert("経緯を入力してください。");
    setIsAnalyzing(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (e) { alert("解析エラーが発生しました。"); }
    finally { setIsAnalyzing(false); }
  };

  const handleSubmit = async () => {
    if (!formData.certified) return alert("誓約してください。");
    try {
      await addDoc(collection(db, "reports"), { 
        ...formData, 
        ai_analysis: aiResult?.analysis || null,
        createdAt: serverTimestamp() 
      });
      setIsSubmitted(true);
    } catch (e) { alert("保存エラー: " + e.message); }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#000666] mb-4 font-serif text-left">記録を完了しました</h2>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">トップに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A202C] font-sans flex text-left">
      <aside className="hidden lg:flex flex-col fixed h-screen w-64 bg-[#f1f4f6] border-r border-[#abb3b7]/20 p-8 z-50">
        <div className="mb-10 text-slate-900">
          <h1 className="font-serif text-2xl font-black tracking-tighter italic text-left">Forensic Ed.</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1 text-left">Legal Evidence Archive</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => {setView('landing'); setAiResult(null); setCurrentStep(1)}} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='landing' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}><Landmark className="w-4 h-4"/> トップ</button>
          <button onClick={() => setView('reporting')} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='reporting' ? 'bg-white shadow-sm text-black' : 'text-slate-400 hover:text-slate-600'}`}><FileText className="w-4 h-4"/> 体験を報告</button>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200">
          <a href="https://misconduct-db.vercel.app/" className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-900"><Newspaper className="w-3.5 h-3.5"/></div>
            <p className="text-[10px] font-bold text-slate-500">不祥事ニュースへ ➔</p>
          </a>
          <SmallDonation />
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 md:p-12 lg:p-20 flex flex-col w-full">
        {view === 'landing' ? (
          <div className="animate-in fade-in duration-700 max-w-5xl mx-auto w-full text-left">
            <div className="border-y-2 border-black py-6 flex justify-between items-center mb-16 text-slate-900">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Forensic Editorial Project</span>
                <h2 className="font-serif text-5xl md:text-8xl font-black tracking-tighter leading-none italic">Evidence.</h2>
              </div>
              <div className="hidden md:block text-right font-serif opacity-40"><p className="text-xl font-bold uppercase">Public Accountability</p></div>
            </div>
            <section className="bg-[#000666] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-tight">不作為を、<br/><span className="text-[#bdc2ff]">法的証拠</span>に変える。</h2>
              <p className="text-xl text-blue-100/80 mb-12 max-w-2xl leading-relaxed">窓口での追い返しを、憲法と法律に基づいたデータへと構造化。AIによる2段階の法的整合性チェックを搭載。</p>
              <button onClick={() => setView('reporting')} className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2">体験を報告する <ArrowRight className="w-5 h-5"/></button>
            </section>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 w-full text-slate-900 text-left">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-50">
              <h2 className="text-2xl font-black mb-8 font-serif italic border-b pb-4">Case Documentation (Step {currentStep}/4)</h2>
              
              {currentStep === 1 && (
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">When did it happen?</label>
                  <input name="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 p-5 rounded-2xl outline-none" />
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Where did it happen?</label>
                  <input name="location" type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="例：〇〇市役所 福祉課" className="w-full bg-slate-50 p-5 rounded-2xl outline-none" />
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Description</label>
                  <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 p-6 rounded-3xl min-h-[250px] outline-none" placeholder="担当者の発言内容などを具体的に記述..." />
                  
                  <div className="mt-8 pt-8 border-t border-slate-50">
                    {!aiResult && !isAnalyzing && (
                      <button onClick={runLegalAnalysis} className="flex items-center gap-2 text-[#000666] font-black text-sm uppercase tracking-widest hover:underline">
                        <Sparkles className="w-5 h-5 text-blue-500"/> Start AI Legal Analysis
                      </button>
                    )}
                    {isAnalyzing && (
                      <div className="flex items-center gap-3 text-blue-600 font-bold animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin" /> 解析中...
                      </div>
                    )}
                    {aiResult && (
                      <div className={`p-8 rounded-[2rem] border-2 ${aiResult.status === 'verified' ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                        <div className="flex items-center gap-2 mb-4 font-black uppercase text-xs">
                          {aiResult.status === 'verified' ? <ShieldCheck className="text-green-600"/> : <ShieldAlert className="text-red-600"/>}
                          {aiResult.status === 'verified' ? 'Verified Legal Evidence' : 'Needs Correction'}
                        </div>
                        <p className="whitespace-pre-wrap text-base leading-loose text-slate-700 font-serif">{aiResult.analysis || aiResult.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                   <p className="text-sm font-bold text-slate-400 font-serif italic">Evidence Upload Feature coming soon.</p>
                </div>
              )}

              <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-8">
                <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={formData.certified} onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="w-5 h-5 rounded-lg border-slate-200 text-[#000666]" />
                  内容は事実に基づき正確です
                </label>
                <div className="flex gap-4">
                  {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-4 font-black text-slate-300 text-[11px] uppercase">Back</button>}
                  {currentStep < 4 ? (
                    <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-[#000666] text-white px-10 py-4 rounded-2xl font-bold shadow-lg text-[11px] uppercase">Next</button>
                  ) : (
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold shadow-lg text-[11px] uppercase tracking-widest">Submit</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
