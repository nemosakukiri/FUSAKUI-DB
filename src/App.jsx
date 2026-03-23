import React, { useState, useEffect } from 'react';
import { 
  Gavel, Sparkles, Calendar, MapPin, FileText, ArrowRight, Newspaper, 
  ChevronLeft, CheckCircle2, ShieldCheck, ShieldAlert, Loader2, Landmark, 
  Clock, Scale, Quote, BookOpen, Database, Lock, SearchCode, ExternalLink
} from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- NotebookLMのリンク（あなたのIDを反映済み） ---
const NOTEBOOK_URL = "https://notebooklm.google.com/notebook/31de7a8b-3cf5-4cff-999c-ca1826a15ff0";

// --- 小型化した支援ボタン ---
const SmallDonation = () => (
  <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
    <Sparkles className="w-5 h-5 text-blue-400 mx-auto mb-2" />
    <p className="text-[10px] text-slate-500 mb-3 font-serif italic">AI解析維持のため、ご支援をお願いします。</p>
    <a href="https://www.buymeacoffee.com/あなたのID" target="_blank" className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-full font-bold text-[10px] hover:scale-105 transition-all shadow-sm">
      <img src="https://cdn.buymeacoffee.com/widget/assets/images/bmc-btn-logo.svg" alt="BMC" className="w-4 h-4" />
      Buy Me a Coffee
    </a>
  </div>
);

export default function App() {
  const [view, setView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ date: '', location: '', description: '', certified: false });

  const runDirectAIAnalysis = async () => {
    // 【重要】ここにご自身の動くAPIキーを貼り付けてください
    const API_KEY = "AIzaSyBylSlz1LBQEtSAfv1KIUn9izfAVE_1-YY"; 

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `あなたは日本の行政法と憲法に精通した判事兼調査官です。以下の報告について、憲法25条や行政手続法7条等に照らした法的分析レポートを日本語で作成してください。回答は法的整合性チェックの結果を含め、400文字程度で。報告内容：${formData.description}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error(e);
      return "（AI解析中にエラーが発生しましたが、報告は保存されます）";
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.certified) return alert("誓約のチェックを入れてください。");
    setIsProcessing(true);
    try {
      const analysisResult = await runDirectAIAnalysis();
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center text-slate-900">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-8" />
          <h2 className="text-3xl font-black mb-4 font-serif text-left">記録完了</h2>
          <p className="text-slate-500 mb-10 leading-relaxed text-left">法的解析を経て、あなたの証言は「Evidence」としてデータベースに安全に格納されました。</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">トップに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A202C] font-sans flex text-left">
      {/* サイドバー */}
      <aside className="hidden lg:flex flex-col fixed h-screen w-64 bg-[#f1f4f6] border-r border-[#abb3b7]/20 p-8 z-50">
        <div className="mb-10 text-slate-900 text-left">
          <h1 className="font-serif text-2xl font-black tracking-tighter italic leading-none">Forensic<br/>Editorial</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">Legal Evidence DB</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => {setView('landing'); setCurrentStep(1)}} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='landing' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><Landmark className="w-4 h-4"/> トップ</button>
          <button onClick={() => setView('reporting')} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='reporting' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><FileText className="w-4 h-4"/> 体験を報告</button>
          
          {/* 法的に調べるボタンをサイドバーに追加 */}
          <a href={NOTEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all text-blue-600 hover:bg-blue-50">
            <BookOpen className="w-4 h-4"/> 法律を調べる
          </a>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-200">
          <a href="https://misconduct-db.vercel.app/" className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity mb-4">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-900"><Newspaper className="w-3.5 h-3.5"/></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-left leading-tight">不祥事ニュースへ</p>
          </a>
          <SmallDonation />
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-6 md:p-12 lg:p-20 flex flex-col items-center overflow-y-auto">
        {view === 'landing' ? (
          <div className="animate-in fade-in duration-700 w-full max-w-5xl space-y-24">
            {/* 1. タイトルセクション */}
            <div className="border-y-2 border-black py-8 flex justify-between items-center text-slate-900">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">Archive Integrity System</span>
                <h2 className="font-serif text-5xl md:text-9xl font-black tracking-tighter leading-none italic">Evidence.</h2>
              </div>
            </div>

            {/* 2. メインヒーローセクション */}
            <section className="bg-[#000666] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden text-left">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-[1.1]">不作為を、<br/><span className="text-[#bdc2ff]">法的証拠</span>に変える。</h2>
              <p className="text-xl text-blue-100/80 mb-12 max-w-2xl leading-relaxed font-serif italic border-l-2 border-blue-400/30 pl-6">
                「窓口での追い返しを、憲法と法律に基づいたデータへと構造化。AIによる法的整合性チェックと、実務マニュアルに基づいた検索機能を搭載。」
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setView('reporting')} className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2">報告を作成する <ArrowRight className="w-5 h-5"/></button>
                <a href={NOTEBOOK_URL} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                  <SearchCode className="w-5 h-5"/> 法律・通知を検索
                </a>
              </div>
            </section>

            {/* 3. 判定基準とする法的根拠（NotebookLMの内容を反映） */}
            <section className="py-20 border-t border-slate-100 text-slate-900 text-left">
              <div className="max-w-4xl space-y-12">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black font-serif italic">Legal Framework</h3>
                  <p className="text-slate-500 font-serif leading-relaxed text-left">私たちは、生活保護手帳や最新の厚労省通知を判定の絶対的な基準としています。</p>
                </div>
                <div className="grid md:grid-cols-2 gap-16 text-left">
                  <div className="space-y-4">
                    <h5 className="font-bold flex items-center gap-2 border-b-2 border-blue-600 pb-2 w-fit uppercase text-[11px] tracking-widest">生活保護法 第7条</h5>
                    <p className="text-sm text-slate-600 leading-relaxed text-justify font-serif italic">「申請保護の原則」に基づき、窓口で申請を希望する者に対し、申請書を渡さない・受け取らないといった行為は法律で禁じられています。</p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-bold flex items-center gap-2 border-b-2 border-blue-600 pb-2 w-fit uppercase text-[11px] tracking-widest">2021年 扶養照会通知</h5>
                    <p className="text-sm text-slate-600 leading-relaxed text-justify font-serif italic">厚労省は、親族への照会を理由に申請を断ってはならないことを明確に通知しています。窓口の「独自ルール」は法的に無効です。</p>
                  </div>
                </div>
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-left space-y-2">
                    <p className="text-lg font-black font-serif italic">Know Your Rights.</p>
                    <p className="text-sm text-slate-500">生活保護手帳の記述や具体的な判例を、AIが解析します。</p>
                  </div>
                  <a href={NOTEBOOK_URL} target="_blank" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
                    Open Legal Navigator <ExternalLink className="w-4 h-4"/>
                  </a>
                </div>
              </div>
            </section>

            {/* 4. ビジョン */}
            <div className="bg-slate-100 p-16 md:p-24 rounded-[3rem] text-center space-y-8">
              <Quote className="w-12 h-12 text-blue-300 mx-auto" />
              <h3 className="text-3xl md:text-5xl font-black font-serif tracking-tight leading-tight">「沈黙を記録に変え、<br/>不作為を正す力に。」</h3>
              <p className="max-w-2xl mx-auto text-slate-500 font-serif leading-relaxed italic">このデータベースは、ジャーナリスト、法曹界、そして現状を打破したいと願う全ての市民のために解放されています。</p>
            </div>

            <footer className="pt-12 pb-24 border-t border-slate-200 text-center opacity-30 text-slate-900">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">© 2024 The Forensic Editorial Project. Japan.</p>
            </footer>
          </div>
        ) : (
          /* 報告作成画面 */
          <div className="max-w-3xl w-full animate-in slide-in-from-bottom-4 text-slate-900">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-50">
              <div className="flex justify-between items-center mb-12 border-b pb-6">
                <h2 className="text-xl font-black font-serif italic">Case Reporting System</h2>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Step {currentStep} / 4</span>
              </div>
              <div className="min-h-[300px] text-left">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Occurrence Date</label>
                    <input name="date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl border-none text-xl font-serif outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</label>
                    <input name="location" type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="例：〇〇市役所 福祉課" className="w-full bg-slate-50 p-6 rounded-2xl border-none text-xl font-serif outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</label>
                    <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 p-6 rounded-3xl min-h-[300px] border-none text-lg font-serif leading-relaxed outline-none focus:ring-2 focus:ring-blue-500" placeholder="事実を具体的に記述してください..." />
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="space-y-10 animate-in fade-in">
                    <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                       <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-left"><ShieldCheck className="w-5 h-5"/> AI Forensic Analysis</h4>
                       <p className="text-xs text-blue-700 leading-relaxed font-serif italic text-left leading-relaxed">
                         送信ボタンを押すと、AIが憲法と行政手続法に基づいてこの報告を即座に解析し、データベースへ証拠として保存します。
                       </p>
                    </div>
                    <label className="flex items-start gap-4 cursor-pointer group text-left">
                      <input type="checkbox" checked={formData.certified} onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="mt-1 w-6 h-6 rounded-lg border-slate-300 text-[#000666]" />
                      <span className="text-sm font-bold text-slate-600 group-hover:text-black transition-colors leading-relaxed">提供した情報は事実に基づき正確であることを誓約し、法的証拠としての登録を承認します。</span>
                    </label>
                  </div>
                )}
              </div>
              <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
                <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setView('landing')} className="text-[11px] font-black uppercase text-slate-300 tracking-widest transition-all">Back</button>
                <div className="w-full md:w-auto">
                  {currentStep < 4 ? (
                    <button onClick={() => setCurrentStep(currentStep + 1)} className="w-full md:w-auto bg-[#000666] text-white px-12 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg">Next</button>
                  ) : (
                    <button onClick={handleFinalSubmit} disabled={isProcessing} className={`w-full md:w-auto px-16 py-5 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] shadow-2xl ${isProcessing ? 'bg-slate-400' : 'bg-blue-600 hover:scale-105 active:scale-95'}`}>
                      {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : "Submit to Archive"}
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
