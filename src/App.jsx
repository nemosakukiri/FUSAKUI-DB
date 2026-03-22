import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, Info, MapPin, 
  ShieldCheck, FileText, HelpCircle, UploadCloud, 
  Mic, ArrowRight, Newspaper, ChevronLeft,
  CheckCircle2, ShieldAlert, Database, Lock,
  Scale, Quote
} from 'lucide-react';

// --- Firebaseの設定 ---
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- 1. トップ画面 (Landing Page) ---
const LandingView = ({ onStart }) => (
  <div className="animate-in fade-in duration-700">
    <section className="bg-[#000666] text-white pt-24 pb-40 px-6 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/30 mb-8">
          <ShieldAlert className="w-4 h-4 text-blue-300" />
          <span className="text-xs font-bold tracking-widest uppercase">Public Service Forensic Database</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-tight">
          行政の不作為を、<br /><span className="text-[#bdc2ff]">「科学的な証拠」</span>に変える。
        </h2>
        <p className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          窓口での追い返し、説明拒否。あなたの「怒り」を、憲法と法律に基づいた「データ」へと構造化し、社会の不備を可視化する。
        </p>
        
        {/* ボタンエリア：ここを連結しました */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            体験を報告する (Step 1/4)
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <a 
            href="https://misconduct-db.vercel.app/" 
            className="bg-blue-400/10 border border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            行政の不正事例を見る
            <Newspaper className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>

    {/* 法的根拠セクション */}
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <Scale className="w-12 h-12 text-[#000666] mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-4">判定の基準とする法的根拠</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
        <div className="flex gap-6"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold shrink-0">25</div><div><h5 className="font-bold mb-1">憲法 第25条 (生存権)</h5><p className="text-slate-600 text-xs">最低限度の生活を営む権利。これを脅かす不作為は許されません。</p></div></div>
        <div className="flex gap-6"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold shrink-0">7</div><div><h5 className="font-bold mb-1">行政手続法 第7条</h5><p className="text-slate-600 text-xs">不当な受け取り拒否（水際作戦）を禁止する重要な法的根拠です。</p></div></div>
      </div>
    </section>

    <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-400">
      <div className="flex justify-center gap-2 items-center mb-2"><Gavel className="w-4 h-4 text-[#000666]" /><span className="font-bold text-xs uppercase tracking-widest">The Forensic Editorial</span></div>
      <p className="text-[10px] uppercase font-bold tracking-[0.2em]">© 2024 Forensic Editorial Project.</p>
    </footer>
  </div>
);

// --- メインコンポーネント ---
export default function App() {
  const [view, setView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: '', time: '', grievanceType: 'Refusal',
    location: 'District Office', description: '', certified: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!formData.certified) return alert("誓約してください。");
    setIsSaving(true);
    try {
      await addDoc(collection(db, "reports"), { ...formData, createdAt: serverTimestamp() });
      setIsSubmitted(true);
    } catch (e) {
      alert("エラー: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#000666] mb-8">報告を完了しました</h2>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">トップへ戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <Gavel className="text-[#000666] w-6 h-6" />
          <span className="font-extrabold text-[#000666] text-xl tracking-tighter uppercase">Forensic Editorial</span>
        </div>
      </header>

      {view === 'landing' ? <LandingView onStart={() => setView('reporting')} /> : (
        <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-50">
            <h2 className="text-2xl font-bold text-[#000666] mb-8 text-center">事案の記録 (Step {currentStep}/4)</h2>
            
            {currentStep === 1 && (
              <div className="space-y-6">
                <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl" />
                <input name="time" type="time" value={formData.time} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl" />
              </div>
            )}
            {currentStep === 2 && <div className="text-center py-10"><MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" /><p className="font-bold">場所: {formData.location}</p></div>}
            {currentStep === 3 && <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-3xl min-h-[250px]" placeholder="詳細を記入..." />}
            {currentStep === 4 && <div className="grid grid-cols-2 gap-4 py-10 text-center"><div className="p-10 border-2 border-dashed rounded-3xl">書類</div><div className="p-10 border-2 border-dashed rounded-3xl">音声</div></div>}

            <div className="mt-12 pt-8 border-t flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <input type="checkbox" checked={formData.certified} onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="rounded" />
                正確であることを誓約します
              </label>
              <div className="flex gap-4">
                {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3">戻る</button>}
                {currentStep < 4 ? (
                  <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-[#000666] text-white px-8 py-3 rounded-xl font-bold">次へ</button>
                ) : (
                  <button onClick={handleSubmit} disabled={isSaving} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold">送信する</button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
