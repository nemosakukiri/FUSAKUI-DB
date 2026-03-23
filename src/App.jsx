import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, MapPin, FileText, ArrowRight, Newspaper, 
  ChevronLeft, CheckCircle2, ShieldAlert, Scale, Quote, Loader2, Landmark
} from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [view, setView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [formData, setFormData] = useState({
    date: '', time: '', location: '', description: '', certified: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // --- 法的ダブルチェックAIの呼び出し ---
  const runLegalAnalysis = async () => {
    if (!formData.description) return alert("経緯を入力してください。");
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      alert("解析エラーが発生しました。");
    } finally {
      setIsAnalyzing(false);
    }
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
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#000666] mb-4">記録が完了しました</h2>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">トップに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A202C] font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center text-slate-900">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <Gavel className="text-[#000666] w-6 h-6" />
          <span className="font-extrabold text-[#000666] text-xl tracking-tighter uppercase">Forensic Editorial</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#bdc2ff]"></div>
      </header>

      {view === 'landing' ? (
        <div className="animate-in fade-in duration-700">
          <section className="bg-[#000666] text-white pt-24 pb-40 px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter">不作為を、<br/>法的証拠に変える。</h2>
              <p className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                窓口での追い返しを、憲法と法律に基づいたデータへと構造化。AIによる2段階の法的整合性チェックを搭載。
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <button onClick={() => setView('reporting')} className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all">体験を報告する</button>
                <a href="https://misconduct-db.vercel.app/" className="bg-blue-400/10 border border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-2">行政の不正ニュース <Newspaper className="w-5 h-5"/></a>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <main className="max-w-4xl mx-auto px-6 pt-12 pb-24 text-slate-900">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-50">
            <h2 className="text-2xl font-bold text-[#000666] mb-8">事案の記録 (Step {currentStep}/4)</h2>
            
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="font-bold flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-400"/> 発生時期</h3>
                <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-red-400"/> 場所</h3>
                <input name="location" type="text" value={formData.location} onChange={handleChange} placeholder="例：〇〇市役所 福祉課" className="w-full bg-slate-50 p-4 rounded-xl outline-none" />
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400"/> 詳細な経緯</h3>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-3xl min-h-[200px] outline-none" placeholder="言われた内容などを具体的に記述..." />
                
                {/* AI解析セクション */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  {!aiResult && !isAnalyzing && (
                    <button onClick={runLegalAnalysis} className="flex items-center gap-2 text-[#000666] font-bold hover:underline">
                      <Sparkles className="w-5 h-5"/> この報告を法的に解析する
                    </button>
                  )}
                  {isAnalyzing && (
                    <div className="flex items-center gap-3 text-slate-400 animate-pulse">
                      <Loader2 className="w-5 h-5 animate-spin" /> 法令および判例との整合性をダブルチェック中...
                    </div>
                  )}
                  {aiResult && (
                    <div className={`p-6 rounded-3xl border-2 ${aiResult.status === 'verified' ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                      <div className="flex items-center gap-2 mb-4 font-bold">
                        {aiResult.status === 'verified' ? <ShieldCheck className="text-green-600"/> : <ShieldAlert className="text-red-600"/>}
                        {aiResult.status === 'verified' ? '検証済み法的レポート' : '再確認が必要です'}
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{aiResult.analysis || aiResult.message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-6 text-center py-10 italic text-slate-400 border-2 border-dashed rounded-3xl">
                証拠資料（写真・音声）の添付機能は準備中です。
              </div>
            )}

            <div className="mt-12 pt-8 border-t flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer uppercase">
                <input type="checkbox" checked={formData.certified} onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="rounded" />
                内容は事実に基づき正確です
              </label>
              <div className="flex gap-4">
                {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 font-bold text-slate-400">戻る</button>}
                {currentStep < 4 ? (
                  <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-[#000666] text-white px-10 py-3 rounded-xl font-bold shadow-lg">次へ</button>
                ) : (
                  <button onClick={handleSubmit} className="bg-blue-600 text-white px-12 py-3 rounded-xl font-bold shadow-lg">データベースに登録</button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
