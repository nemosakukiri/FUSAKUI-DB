import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, Info, MapPin, 
  ShieldCheck, FileText, HelpCircle, UploadCloud, 
  Mic, ArrowRight, LayoutDashboard, BarChart3, 
  Map as MapIcon, Landmark, ChevronLeft,
  CheckCircle2, ShieldAlert, Database, Newspaper, Lock,
  Scale, ScrollText, History, Quote
} from 'lucide-react';

// --- 1. トップ画面 (Landing Page) ---
const LandingView = ({ onStart }) => (
  <div className="animate-in fade-in duration-700">
    {/* Hero Section */}
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
        <button 
          onClick={onStart}
          className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          体験を報告する (Step 1/4)
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>

    {/* Feature Grid */}
    <section className="max-w-6xl mx-auto -mt-20 px-6 relative z-20 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <FileText className="w-10 h-10" />, title: "フォレンジック記録", desc: "AIが法的視点でヒアリング。いつ、どこで、誰が何を言ったのかを証拠精度で構造化します。" },
          { icon: <MapIcon className="w-10 h-10" />, title: "不作為の可視化", desc: "報告された場所をマップ化。特定の窓口に集中する「組織的な不備」をデータで証明します。" },
          { icon: <Newspaper className="w-10 h-10" />, title: "調査報道との連携", desc: "蓄積されたデータは、ジャーナリストや法曹界と共有され、制度改善の強力な根拠となります。" }
        ].map((f, i) => (
          <div key={i} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 hover:translate-y-[-5px] transition-all">
            <div className="text-[#000666] mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl">{f.icon}</div>
            <h4 className="text-xl font-bold mb-4">{f.title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Legal Framework (NEW: READMEの内容) */}
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <Scale className="w-12 h-12 text-[#000666] mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-4">判定の基準とする法的根拠</h3>
        <p className="text-slate-500">私たちのAIリーガル・エンジンは、以下の日本国憲法および各福祉法規をベースに分析を行います。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex gap-6">
          <div className="shrink-0"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold">25</div></div>
          <div>
            <h5 className="font-bold text-lg mb-2">日本国憲法 第25条 (生存権)</h5>
            <p className="text-slate-600 text-sm leading-relaxed text-justify">「全て国民は、健康で文化的な最低限度の生活を営む権利を有する。」この基本的人権を脅かす行政の不作為は許されません。</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="shrink-0"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold">7</div></div>
          <div>
            <h5 className="font-bold text-lg mb-2">行政手続法 第7条 (受理義務)</h5>
            <p className="text-slate-600 text-sm leading-relaxed text-justify">申請が届いた際、行政は遅滞なく審査を開始しなければなりません。形式的な不備がない限りの「窓口での受け取り拒否」は法に抵触します。</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="shrink-0"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold">法</div></div>
          <div>
            <h5 className="font-bold text-lg mb-2">生活保護法 第7条 (申請保護)</h5>
            <p className="text-slate-600 text-sm leading-relaxed text-justify">保護は申請に基づいて開始されるという「申請保護の原則」に基づきます。申請書の交付を拒むなどの行為は、この原則の侵害です。</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="shrink-0"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold">判</div></div>
          <div>
            <h5 className="font-bold text-lg mb-2">重要判例・厚労省通知</h5>
            <p className="text-slate-600 text-sm leading-relaxed text-justify">過去の最高裁の判断や、政府が出した「水際作戦」を禁止する通知をAIが学習。現在の対応がそれらに反していないかチェックします。</p>
          </div>
        </div>
      </div>
    </section>

    {/* Vision Section (READMEのビジョン) */}
    <section className="bg-[#f3f3f5] py-24 px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <Quote className="w-12 h-12 text-[#bdc2ff] mb-8" />
        <h3 className="text-3xl font-bold mb-6 italic tracking-tight text-[#000666]">「沈黙を記録に変え、不作為を正す力に。」</h3>
        <p className="text-lg text-slate-600 leading-relaxed mb-10 text-justify">
          多くの人が窓口で直面する「水際作戦」。それは当事者の心に深い傷を残すだけでなく、社会保障制度そのものを形骸化させます。私たちは一人一人の体験をフォレンジック（法科学）的に記録することで、個人の声を「統計」という力に変え、制度を正しく機能させるための変革を支援します。
        </p>
      </div>
    </section>

    {/* Trust Banner */}
    <section className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto text-center">
        <Lock className="w-12 h-12 text-[#000666] mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">プライバシーと安全性</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          投稿されたデータは暗号化され、個人の特定を防ぐためのスクリーニングを経てデータベースに格納されます。政府や特定の組織にあなたの許可なく個人情報が渡されることはありません。
        </p>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-white border-t border-slate-100 py-12 text-center">
      <div className="flex justify-center gap-2 items-center mb-4 opacity-50">
        <Gavel className="w-5 h-5 text-[#000666]" />
        <span className="font-bold text-sm tracking-widest uppercase">The Forensic Editorial</span>
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2024 Forensic Editorial Project. All rights reserved.</p>
    </footer>
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

  const handleSubmit = () => {
    if (formData.certified) setIsSubmitted(true);
    else alert("情報の正確性を誓約してください。");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-[#000666] mb-4">報告が記録されました</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">提供いただいた体験は暗号化され、フォレンジック分析チームへ送られました。ご協力ありがとうございます。</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold hover:bg-[#1a237e] transition-all">トップに戻る</button>
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
        <div className="w-8 h-8 rounded-full bg-[#bdc2ff] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=100&h=100&q=80" alt="profile" />
        </div>
      </header>

      {view === 'landing' ? (
        <LandingView onStart={() => setView('reporting')} />
      ) : (
        <main className="max-w-4xl mx-auto px-6 pt-12 pb-24 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView('landing')} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"><ChevronLeft className="w-5 h-5"/></button>
            <div>
              <h2 className="text-2xl font-bold text-[#000666]">体験の記録作成</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Step {currentStep} of 4</p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-50">
            {currentStep === 1 && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-400"/> 発生日時</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">日付</span>
                    <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">時刻（目安）</span>
                    <input name="time" type="time" value={formData.time} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><MapPin className="w-6 h-6 text-red-400"/> 場所の特定</h3>
                <div className="bg-slate-100 h-64 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-red-500 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">{formData.location}</p>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><FileText className="w-6 h-6 text-blue-400"/> 詳細な経緯</h3>
                <p className="text-sm text-slate-500 leading-relaxed italic">※誰が、何を言い、何をしたか、客観的な事実を中心に記述してください。</p>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-3xl p-6 min-h-[300px] focus:ring-2 focus:ring-blue-500 transition-all" placeholder="記述を開始してください..." />
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-[#000666] flex items-center gap-2"><UploadCloud className="w-6 h-6 text-blue-400"/> 補足証拠</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center hover:bg-slate-50 cursor-pointer transition-colors group">
                    <UploadCloud className="mx-auto mb-4 text-slate-300 group-hover:text-[#000666] w-12 h-12 transition-colors"/>
                    <p className="font-bold">書類・写真</p>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center hover:bg-slate-50 cursor-pointer transition-colors group">
                    <Mic className="mx-auto mb-4 text-slate-300 group-hover:text-[#000666] w-12 h-12 transition-colors"/>
                    <p className="font-bold">音声記録</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <input id="certify" name="certified" type="checkbox" checked={formData.certified} onChange={handleChange} className="w-6 h-6 rounded-lg text-[#000666] focus:ring-[#000666]" />
                <label htmlFor="certify" className="text-xs font-bold text-slate-500 uppercase tracking-tighter cursor-pointer">内容は事実に基づき正確であることを誓約します</label>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                {currentStep > 1 && (
                  <button onClick={() => setCurrentStep(currentStep - 1)} className="flex-1 md:flex-none px-8 py-4 font-bold text-slate-400 hover:text-[#000666] transition-colors">戻る</button>
                )}
                {currentStep < 4 ? (
                  <button onClick={() => setCurrentStep(currentStep + 1)} className="flex-1 md:flex-none bg-[#000666] text-white px-12 py-4 rounded-2xl font-bold shadow-lg shadow-[#000666]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">次へ <ArrowRight className="w-5 h-5"/></button>
                ) : (
                  <button onClick={handleSubmit} className="flex-1 md:flex-none bg-blue-600 text-white px-14 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">送信</button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
