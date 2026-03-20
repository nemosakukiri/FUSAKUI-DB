import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, Info, MapPin, 
  ShieldCheck, FileText, HelpCircle, UploadCloud, 
  Mic, ArrowRight, LayoutDashboard, BarChart3, 
  Map as MapIcon, Landmark, ChevronLeft,
  CheckCircle2, ShieldAlert, Database, Newspaper, Lock
} from 'lucide-react';

const ForensicReportApp = () => {
  const [view, setView] = useState('landing'); // 'landing' or 'reporting'
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = () => {
    if (formData.certified) setIsSubmitted(true);
    else alert("誓約のチェックを入れてください。");
  };

  // --- 1. トップ画面 (Landing Page) ---
  const LandingView = () => (
    <div className="animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="bg-[#000666] text-white pt-20 pb-32 px-6 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Database className="w-96 h-96 absolute -top-20 -left-20" />
        </div>
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
              onClick={() => setView('reporting')}
              className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              体験を報告する (Step 1/4)
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent border border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              調査データを閲覧する
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto -mt-16 px-6 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <div className="w-14 h-14 bg-blue-50 text-[#000666] rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold mb-4">フォレンジック記録</h4>
            <p className="text-slate-500 leading-relaxed">AIインタビュー形式で、いつ、どこで、誰が、何を言ったのかを法的証拠に近い精度で構造化します。</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <MapIcon className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold mb-4">不作為の可視化</h4>
            <p className="text-slate-500 leading-relaxed">報告された場所をマップ化。特定の役所や窓口に集中する「組織的な不備」をデータで証明します。</p>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Newspaper className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold mb-4">調査報道との連携</h4>
            <p className="text-slate-500 leading-relaxed">蓄積されたデータは、ジャーナリストや法曹界と共有され、制度改善のための強力な根拠となります。</p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-slate-50 py-20 px-6 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="w-12 h-12 text-[#000666] mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4">あなたのプライバシーは厳重に守られます</h3>
          <p className="text-slate-600 leading-relaxed mb-8">
            私たちはあなたの個人情報を政府や特定の組織と共有することはありません。位置データと証言内容は暗号化され、個人の特定を防ぐためのスクリーニングを経てからデータベースに格納されます。
          </p>
          <div className="flex justify-center gap-8 opacity-40 grayscale">
            <div className="font-bold text-xl uppercase tracking-tighter italic">End-to-End Encrypted</div>
            <div className="font-bold text-xl uppercase tracking-tighter italic">ISO 27001 Certified</div>
          </div>
        </div>
      </section>
    </div>
  );

  // --- 2. 送信完了画面 ---
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#000666] mb-4">報告がデータベースに記録されました</h2>
          <p className="text-slate-600 mb-8">
            あなたの証言は検証プロセスを経て、不作為マップのデータセットに統合されます。ご協力ありがとうございます。
          </p>
          <button onClick={() => setView('landing')} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
            トップに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb] text-[#1a1c1d] font-sans pb-20">
      {/* Global Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <Gavel className="text-[#000666] w-6 h-6" />
          <h1 className="font-extrabold text-[#000666] text-xl tracking-tighter uppercase">Forensic Editorial</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-xs font-bold uppercase tracking-widest text-slate-500">About the Project</button>
          <div className="w-9 h-9 rounded-full bg-[#1a237e] overflow-hidden border border-slate-200 shadow-sm">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=100&h=100&q=80" alt="user" />
          </div>
        </div>
      </header>

      {view === 'landing' ? (
        <LandingView />
      ) : (
        <main className="max-w-4xl mx-auto px-6 pt-12 animate-in slide-in-from-bottom-4 duration-500">
          {/* Form UI */}
          <section className="mb-12 flex gap-6 items-start">
            <button onClick={() => setView('landing')} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-[#000666]" />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-[#000666] mb-2 tracking-tight">体験の記録作成</h2>
              <p className="text-slate-600">AIガイドに沿って、事象の客観的な詳細を記述してください。</p>
            </div>
          </section>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-10 px-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 rounded-full transition-all duration-500 ${currentStep >= s ? 'w-10 bg-[#000666]' : 'w-4 bg-slate-200'}`} />
            ))}
            <span className="ml-4 font-bold text-[10px] uppercase text-slate-400 tracking-widest">Step {currentStep} of 4</span>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><Calendar className="w-6 h-6"/> いつ頃のことですか？</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">発生日</span>
                    <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl p-4 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">時間帯（目安）</span>
                    <input name="time" type="time" value={formData.time} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl p-4 transition-all outline-none" />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><MapPin className="w-6 h-6"/> 場所を特定します</h3>
                <div className="bg-slate-100 h-64 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-red-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">{formData.location}</p>
                    <p className="text-xs text-slate-400 mt-2">地図上での正確なプロットはデータの信憑性を高めます</p>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><FileText className="w-6 h-6"/> 何が起きましたか？</h3>
                <p className="text-sm text-slate-500">「担当者の名前」「窓口の番号」「かけられた言葉」など、可能な限り具体的に記述してください。主観ではなく事実関係が重要です。</p>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-6 min-h-[250px] transition-all outline-none" placeholder="記述を開始..." />
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><UploadCloud className="w-6 h-6"/> 補足証拠</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-slate-200 p-10 rounded-2xl text-center hover:bg-slate-50 cursor-pointer transition-colors group">
                    <UploadCloud className="mx-auto mb-4 text-slate-300 group-hover:text-blue-500 transition-colors w-10 h-10"/>
                    <p className="font-bold">書類・写真</p>
                    <p className="text-xs text-slate-400 mt-1">申請書の控え、メモ等</p>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 p-10 rounded-2xl text-center hover:bg-slate-50 cursor-pointer transition-colors group">
                    <Mic className="mx-auto mb-4 text-slate-300 group-hover:text-blue-500 transition-colors w-10 h-10"/>
                    <p className="font-bold">音声記録</p>
                    <p className="text-xs text-slate-400 mt-1">窓口での録音データ</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Nav Actions */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <input id="certify" name="certified" type="checkbox" checked={formData.certified} onChange={handleChange} className="w-5 h-5 rounded-lg text-[#000666] focus:ring-[#000666]" />
                <label htmlFor="certify" className="text-xs font-bold text-slate-500 uppercase tracking-tight cursor-pointer">
                  記録内容は事実であることを誓約します
                </label>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                {currentStep > 1 && (
                  <button onClick={prevStep} className="flex-1 md:flex-none px-8 py-4 text-[#000666] font-bold hover:bg-slate-50 rounded-xl transition-col
