import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, Info, MapPin, 
  ShieldCheck, FileText, HelpCircle, UploadCloud, 
  Mic, ArrowRight, LayoutDashboard, BarChart3, 
  Map as MapIcon, Landmark, ChevronLeft,
  CheckCircle2, ShieldAlert, Database, Newspaper, Lock
} from 'lucide-react';

const LandingView = ({ onStart }) => (
  <div className="animate-in fade-in duration-700">
    <section className="bg-[#000666] text-white pt-20 pb-32 px-6 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/30 mb-8">
          <ShieldAlert className="w-4 h-4 text-blue-300" />
          <span className="text-xs font-bold tracking-widest uppercase">Public Service Forensic Database</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-tight">
          行政の不作為を、<br /><span className="text-[#bdc2ff]">「科学的な証拠」</span>に変える。
        </h2>
        <p className="text-xl text-blue-100/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          たらい回し、説明拒否、不当な遅延。窓口で起きた「見えない不利益」をフォレンジック（法科学）の精度で記録し、社会の不備を可視化する調査報道プロジェクトです。
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={onStart}
            className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            体験を報告する (Step 1/4)
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>

    <section className="max-w-6xl mx-auto -mt-16 px-6 relative z-20 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <FileText className="w-12 h-12 text-[#000666] mb-6" />
          <h4 className="text-xl font-bold mb-4">フォレンジック記録</h4>
          <p className="text-slate-500 text-sm leading-relaxed">AIインタビュー形式で、いつ、どこで、誰が何を言ったのかを法的証拠に近い精度で構造化します。</p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <MapIcon className="w-12 h-12 text-red-600 mb-6" />
          <h4 className="text-xl font-bold mb-4">不作為の可視化</h4>
          <p className="text-slate-500 text-sm leading-relaxed">報告された場所をマップ化。特定の役所や窓領域に集中する「組織的な不備」をデータで証明します。</p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <Newspaper className="w-12 h-12 text-green-600 mb-6" />
          <h4 className="text-xl font-bold mb-4">調査報道との連携</h4>
          <p className="text-slate-500 text-sm leading-relaxed">蓄積されたデータは、ジャーナリストや法曹界と共有され、制度改善のための強力な根拠となります。</p>
        </div>
      </div>
    </section>
  </div>
);

export default function App() {
  const [view, setView] = useState('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    date: '', time: '', grievanceType: 'Application Refusal',
    location: '122nd District Administrative Office, Hall B',
    description: '', certified: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#000666] mb-4">報告を受理しました</h2>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">トップに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb] text-[#1a1c1d] font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <Gavel className="text-[#000666] w-6 h-6" />
          <span className="font-extrabold text-[#000666] text-xl tracking-tighter uppercase">Forensic Editorial</span>
        </div>
      </header>

      {view === 'landing' ? (
        <LandingView onStart={() => setView('reporting')} />
      ) : (
        <main className="max-w-4xl mx-auto px-6 pt-12">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView('landing')} className="p-2 hover:bg-slate-200 rounded-lg"><ChevronLeft /></button>
            <h2 className="text-2xl font-bold text-[#000666]">体験の記録 (Step {currentStep}/4)</h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            {currentStep === 1 && (
              <div className="space-y-6">
                <label className="block font-bold">発生日時</label>
                <div className="grid grid-cols-2 gap-4">
                  <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl" />
                  <input name="time" type="time" value={formData.time} onChange={handleChange} className="w-full bg-slate-50 p-4 rounded-xl" />
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="text-center py-10 space-y-4">
                <MapPin className="w-12 h-12 text-red-500 mx-auto" />
                <p className="font-bold">{formData.location}</p>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <label className="block font-bold">詳細な経緯</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 p-6 rounded-2xl min-h-[200px]" placeholder="具体的に記述してください..." />
              </div>
            )}
            {currentStep === 4 && (
              <div className="grid grid-cols-2 gap-6 py-10">
                <div className="border-2 border-dashed p-10 rounded-2xl text-center"><UploadCloud className="mx-auto mb-2 text-slate-400"/>書類</div>
                <div className="border-2 border-dashed p-10 rounded-2xl text-center"><Mic className="mx-auto mb-2 text-slate-400"/>音声</div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <input type="checkbox" checked={formData.certified} onChange={(e) => setFormData({...formData, certified: e.target.checked})} className="rounded" />
                事実であることを誓約します
              </div>
              <div className="flex gap-4">
                {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 font-bold">戻る</button>}
                {currentStep < 4 ? (
                  <button onClick={() => setCurrentStep(currentStep + 1)} className="bg-[#000666] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">次へ <ArrowRight className="w-4 h-4"/></button>
                ) : (
                  <button onClick={handleSubmit} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">送信</button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
