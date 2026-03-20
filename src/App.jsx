import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, Info, MapPin, 
  ShieldCheck, FileText, HelpCircle, UploadCloud, 
  Mic, ArrowRight, LayoutDashboard, BarChart3, 
  Map as MapIcon, Landmark, ChevronLeft,
  CheckCircle2
} from 'lucide-react';

const ForensicReportApp = () => {
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#000666] mb-4">報告を受理しました</h2>
          <p className="text-slate-600 mb-8">証言は分析チームに送られました。</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold">戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb] text-[#1a1c1d] pb-24 md:pb-12 font-sans">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gavel className="text-[#000666] w-6 h-6" />
          <h1 className="font-extrabold text-[#000666] text-xl tracking-tighter uppercase">Forensic Editorial</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#1a237e] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=100&h=100&q=80" alt="user" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <section className="mb-12 flex gap-6 items-start">
          <div className="w-14 h-14 bg-[#000666] rounded-2xl flex items-center justify-center shadow-lg shrink-0 text-white">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#000666] mb-2">体験を正確に記録しましょう</h2>
            <p className="text-slate-600">このフォームは証言を法的精度で構造化します。</p>
          </div>
        </section>

        <div className="flex items-center gap-3 mb-10 px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-2 rounded-full transition-all duration-500 ${currentStep >= s ? 'w-10 bg-[#000666]' : 'w-4 bg-slate-300'}`} />
          ))}
        </div>

        <div className="min-h-[300px] bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#000666] flex items-center gap-2"><Calendar className="w-5 h-5"/> 発生日時</h3>
              <div className="grid grid-cols-2 gap-4">
                <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-lg p-3" />
                <input name="time" type="time" value={formData.time} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-lg p-3" />
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6 text-center py-10">
              <MapPin className="w-12 h-12 text-red-500 mx-auto" />
              <p className="font-bold">{formData.location}</p>
              <p className="text-sm text-slate-500">位置データは暗号化され保護されます。</p>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#000666] flex items-center gap-2"><FileText className="w-5 h-5"/> 詳細な経緯</h3>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-lg p-4 min-h-[150px]" placeholder="内容を記入してください..." />
            </div>
          )}
          {currentStep === 4 && (
            <div className="grid grid-cols-2 gap-4 py-10">
              <div className="border-2 border-dashed border-slate-200 p-6 rounded-xl text-center"><UploadCloud className="mx-auto mb-2 text-slate-400"/>書類</div>
              <div className="border-2 border-dashed border-slate-200 p-6 rounded-xl text-center"><Mic className="mx-auto mb-2 text-slate-400"/>音声</div>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <input id="certify" name="certified" type="checkbox" checked={formData.certified} onChange={handleChange} className="w-5 h-5 rounded text-[#000666]" />
            <label htmlFor="certify" className="text-sm font-semibold text-slate-600">正確であることを誓約します。</label>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {currentStep > 1 && <button onClick={prevStep} className="px-6 py-4 text-[#000666] font-bold">戻る</button>}
            {currentStep < 4 ? (
              <button onClick={nextStep} className="bg-[#000666] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2">次へ <ArrowRight className="w-5 h-5"/></button>
            ) : (
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-12 py-4 rounded-xl font-bold">報告を送信</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForensicReportApp;
