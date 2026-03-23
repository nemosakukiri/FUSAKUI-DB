import React, { useState, useEffect } from 'react';
import { 
  Gavel, Sparkles, Calendar, MapPin, FileText, ArrowRight, Newspaper, 
  ChevronLeft, CheckCircle2, ShieldCheck, ShieldAlert, Loader2, Landmark, 
  Clock, Scale, Quote, BookOpen, Database, Lock, SearchCode, ExternalLink,
  Users
} from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const NOTEBOOK_URL = "https://notebooklm.google.com/notebook/31de7a8b-3cf5-4cff-999c-ca1826a15ff0";

const SmallDonation = () => (
  <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
    <Sparkles className="w-5 h-5 text-blue-400 mx-auto mb-2" />
    <p className="text-[10px] text-slate-500 mb-3 font-serif italic">AI解析維持のため、ご支援をお願いします。</p>
    <a href="https://www.buymeacoffee.com/あなたのID" target="_blank" className="inline-flex items-center gap-2 bg-[#FFDD00] text-black px-4 py-2 rounded-full font-bold text-[10px] hover:scale-105 transition-all shadow-sm">
      <img src="https://cdn.buymeacoffee.com/widget/assets/images/bmc-btn-logo.svg" alt="BMC" className="w-4 h-4" /> Buy Me a Coffee
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
    // 【重要】お手元の動くAPIキーを貼り付けてください
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
    } catch (e) { alert("エラーが発生しました: " + e.message); }
    finally { setIsProcessing(false); }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center text-slate-900">
        <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-8" />
          <h2 className="text-3xl font-black mb-4 font-serif text-left">記録されました</h2>
          <p className="text-slate-500 mb-10 leading-relaxed text-left font-serif">あなたの経験は「行政不作為の証拠」として刻まれました。この積み重ねが、社会を動かす力になります。</p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-[#000666] text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg">トップに戻る</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A202C] font-sans flex text-left">
      {/* サイドバー */}
      <aside className="hidden lg:flex flex-col fixed h-screen w-64 bg-[#f1f4f6] border-r border-[#abb3b7]/20 p-8 z-50">
        <div className="mb-10 text-slate-900">
          <h1 className="font-serif text-2xl font-black tracking-tighter italic leading-none">Forensic Ed.</h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-2">Administrative Inaction Archive</p>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => {setView('landing'); setCurrentStep(1)}} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='landing' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><Landmark className="w-4 h-4"/> トップ</button>
          <button onClick={() => setView('reporting')} className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all ${view==='reporting' ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}><FileText className="w-4 h-4"/> 体験を報告</button>
          <a href={NOTEBOOK_URL} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase rounded-lg transition-all text-blue-600 hover:bg-blue-50"><BookOpen className="w-4 h-4"/> 法律を調べる</a>
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
            
            {/* 1. タイトル & ステートメント（ここを強化） */}
            <div className="border-y-2 border-black py-8 flex justify-between items-start text-slate-900">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-2">Visible Administrative Inaction</span>
                <h2 className="font-serif text-5xl md:text-9xl font-black tracking-tighter leading-none italic">Evidence.</h2>
              </div>
              <div className="hidden md:block max-w-[250px] text-right space-y-4">
                <p className="text-[11px] font-bold leading-relaxed text-slate-400 font-serif italic">
                  「あなたの経験は、もはやあなただけのものではない。社会を変えるための共通のデータである。」
                </p>
                <div className="flex justify-end gap-2 text-slate-300"><Users className="w-4 h-4"/><p className="text-[10px] font-black uppercase tracking-widest">Connective Voice</p></div>
              </div>
            </div>

            {/* 2. メインヒーローセクション */}
            <section className="bg-[#000666] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden text-left">
              <div className="relative z-10 space-y-8">
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1]">
                  不作為を、<br/><span className="text-[#bdc2ff]">可視化</span>し、変える。
                </h2>
                <div className="max-w-2xl space-y-6">
                  <p className="text-xl text-blue-100/90 leading-relaxed font-serif italic border-l-4 border-blue-400/30 pl-6">
                    「窓口で感じた孤独と理不尽を、ここに置いていってください。その経験は、行政の不透明な運用をあぶり出す、かけがえのない『証拠』になります。」
                  </p>
                  <p className="text-sm text-blue-200/70 font-medium">
                    全国で同じ思いをしている人はたくさんいます。点と点を結び、線にすることで、制度を正しく機能させる大きな力に変えていきましょう。
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button onClick={() => setView('reporting')} className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2">報告を作成する <ArrowRight className="w-5 h-5"/></button>
                  <a href={NOTEBOOK_URL} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2">法律・通知を検索 <SearchCode className="w-5 h-5"/></a>
                </div>
              </div>
            </section>

            {/* 3. このサイトが果たす役割（ここがリクエストの核心） */}
            <section className="grid md:grid-cols-2 gap-16 items-center py-10 border-b border-slate-100 pb-20 text-slate-900">
              <div className="space-y-8">
                <h3 className="text-4xl font-black font-serif italic leading-tight">Why We Record.</h3>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-serif">
                  <p>行政の「不作為」は、目に見えません。窓口で一人が声を上げても、それは個人的な不満として処理されてしまいます。</p>
                  <p className="text-black font-bold">しかし、100人が同じ場所で、同じ時期に、同じ理由で拒絶されていたとしたら？</p>
                  <p>それはもはや個人の問題ではなく、行政の構造的な欠陥、すなわち「不作為」の証明になります。</p>
                </div>
