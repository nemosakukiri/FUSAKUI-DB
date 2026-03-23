import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, MapPin, FileText, ArrowRight, Newspaper, 
  ChevronLeft, CheckCircle2, ShieldCheck, Loader2, Landmark, Clock
} from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- 投げ銭ボタン（小型） ---
const SmallDonation = () => (
  <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
    <Sparkles className="w-5 h-5 text-blue-400 mx-auto mb-2" />
    <p className="text-[10px] text-slate-500 mb-3 font-serif italic">活動維持のため、ご支援をお願いします。</p>
    <a href="https://www.buymeacoffee.com/あなたのID" target="_blank" className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-full font-bold text-[10px] hover:scale-105 transition-all shadow-sm">
      ☕ Buy Me a Coffee
    </a>
  </div>
);

export default function App() {
  const [view, setView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // 解析＆保存中フラグ
  const [formData, setFormData] = useState({ date: '', location: '', description: '', certified: false });

  // --- 【核心】送信ボタンを押した時の自動処理 ---
  const handleFinalSubmit = async () => {
    if (!formData.certified) return alert("誓約のチェックを入れてください。");
    if (!formData.description) return alert("内容を入力してください。");

    setIsProcessing(true); // 読み込み開始（ユーザーに待機を伝える）

    try {
      // 1. まず裏側でAI解析を実行（api/analyze を呼び出す）
      const aiRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: formData.description })
      });
      const aiData = await aiRes.json();

      // 2. 解析結果（成功でも失敗でも）と一緒にFirebaseに保存
      await addDoc(collection(db, "reports"), { 
        ...formData, 
        ai_analysis: aiData.status === 'verified' ? aiData.analysis : "法的整合性の再確認が必要な事案",
        ai_status: aiData.status,
        judge_note: aiData.note || aiData.message || null,
        createdAt: serverTimestamp() 
      });

      setIsSubmitted(true); // 完了画面へ
    } catch (e) {
      console.error(e);
      alert("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center animate-in zoom-in duration-500">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-[#000666] mb-4 font-serif">記録完了</h2>
          <p className="text-slate-500 mb-10 leading-relaxed font-serif">あなたの証言は法的解析を経て、データベースに安全に格納されました。社会の透明性向上にご協力いただき感謝します。</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg">トップに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A202C] font-sans flex text-left">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed h-screen w-64 bg-[#f1f4f6] border-r border-[#abb3b7]/20 p-8 z-50">
        <div className="mb-10 text-slate-900">
          <h1 className="font-serif text-2xl font-black tracking-tighter italic text-left leading-none">Forensic<br/>Editorial</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">Legal Evidence DB</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => {setView('landing'); setCurrentStep(1)}} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='landing' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><Landmark className="w-4 h-4"/> トップ</button>
          <button onClick={() => setView('reporting')} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='reporting' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><FileText className="w-4 h-4"/> 体験を報告</button>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200">
          <a href="https://misconduct-db.vercel.app/" className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity mb-4">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-900"><Newspaper className="w-3.5 h-3.5"/></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Sister Site</p>
          </a>
          <SmallDonation />
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 md:p-12 lg:p-20 flex flex-col items-center">
        {view === 'landing' ? (
          <div className="animate-in fade-in duration-700 w-full max-w-5xl">
            <div className="border-y-2 border-black py-6 flex justify-between items-center mb-16 text-slate-900">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Archive Integrity System</span>
                <h2 className="font-serif text-5xl md:text-8xl font-black tracking-tighter leading-none italic">Evidence.</h2>
              </div>
              <div className="hidden md:block text-right font-serif opacity-40"><p className="text-xl font-bold uppercase tracking-widest">Verification</p></div>
            </div>
            <section className="bg-[#000666] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-[1.1]">不作為を、<br/><span className="text-[#bdc2ff]">法的証拠</span>に変える。</h2>
              <p className="text-xl text-blue-100/80 mb-12 max-w-2xl leading-relaxed font-serif italic">「Start reporting to generate an AI-validated legal analysis based on Article 25 of the Constitution.」</p>
              <button onClick={() => setView('reporting')} className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2">報告を作成する <ArrowRight className="w-5 h-5"/></button>
            </section>
          </div>
        ) : (
          <div className="max-w-3xl w-full animate-in slide-in-from-bottom-4 text-slate-900">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-50">
              <div className="flex justify-between items-center mb-12 border-b pb-6">
                <h2 className="text-xl font-black font-serif italic">Case Reporting System</h2>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Step {currentStep} / 4</span>
              </div>
              
              <div className="min-h-[250px]">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Occurrence Date</label>
                    <input name="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl border-none text-xl font-serif outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location / Department</label>
                    <input name="location" type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="例：〇〇県 〇〇市役所 福祉課" className="w-full bg-slate-50 p-6 rounded-2xl border-none text-xl font-serif outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Description of Encounter</label>
                    <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 p-6 rounded-3xl min-h-[300px] border-none text-lg font-serif leading-relaxed outline-none focus:ring-2 focus:ring-blue-500" placeholder="誰に何と言われたか、事実を詳細に記述してください..." />
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="space-y-10 animate-in fade-in">
                    <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                       <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> AI Forensic Analysis</h4>
                       <p className="text-xs text-blue-700 leading-relaxed">
                         送信ボタンを押すと、AIが憲法と行政手続法に基づいてこの報告を即座に解析し、データベースへ証拠として保存します。
                       </p>
                    </div>
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <input type="checkbox" checked={formData.certified} onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="mt-1 w-6 h-6 rounded-lg border-slate-300 text-[#000666]" />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-black transition-colors leading-relaxed">提供した情報は事実に基づき正確であることを誓約し、法的証拠としての登録を承認します。</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                <button 
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setView('landing')} 
                  className="text-[11px] font-black uppercase text-slate-300 hover:text-slate-600 tracking-widest transition-all"
                >
                  {currentStep === 1 ? 'Cancel' : 'Previous'}
                </button>
                
                <div className="w-full md:w-auto">
                  {currentStep < 4 ? (
                    <button 
                      onClick={() => setCurrentStep(currentStep + 1)} 
                      className="w-full md:w-auto bg-[#000666] text-white px-12 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button 
                      onClick={handleFinalSubmit} 
                      disabled={isProcessing}
                      className={`w-full md:w-auto px-16 py-5 rounded-2xl font-bold text-white shadow-2xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:scale-105 active:scale-95'}`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing & Saving...
                        </>
                      ) : (
                        <>
                          Analyze & Submit to Archive
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
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
