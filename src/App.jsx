import React, { useState } from 'react';
import { 
  Gavel, Sparkles, Calendar, Info, MapPin, 
  ShieldCheck, FileText, HelpCircle, UploadCloud, 
  Mic, ArrowRight, LayoutDashboard, BarChart3, 
  Map as MapIcon, Landmark, ChevronLeft,
  CheckCircle2, ShieldAlert, Database, Newspaper, Lock,
  Scale, Quote
} from 'lucide-react';

// --- Firebaseの設定を読み込む (ここがインポート) ---
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
        <button 
          onClick={onStart}
          className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          体験を報告する (Step 1/4)
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>

    <section className="max-w-6xl mx-auto -mt-20 px-6 relative z-20 pb-24 text-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-[#000666] mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto"><FileText className="w-10 h-10" /></div>
          <h4 className="text-xl font-bold mb-4">フォレンジック記録</h4>
          <p className="text-slate-500 text-sm leading-relaxed">法的視点でヒアリング。いつ、どこで、誰が何を言ったのかを証拠精度で構造化します。</p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-[#000666] mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto"><MapIcon className="w-10 h-10" /></div>
          <h4 className="text-xl font-bold mb-4">不作為の可視化</h4>
          <p className="text-slate-500 text-sm leading-relaxed">報告場所をマップ化。特定の窓口に集中する「組織的な不備」をデータで証明します。</p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-[#000666] mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto"><Newspaper className="w-10 h-10" /></div>
          <h4 className="text-xl font-bold mb-4">調査報道との連携</h4>
          <p className="text-slate-500 text-sm leading-relaxed">蓄積されたデータは、ジャーナリストや法曹界と共有され、制度改善の強力な根拠となります。</p>
        </div>
      </div>
    </section>

    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <Scale className="w-12 h-12 text-[#000666] mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-4">判定の基準とする法的根拠</h3>
        <p className="text-slate-500">私たちのシステムは、以下の日本国憲法および各福祉法規をベースに分析を行います。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
        <div className="flex gap-6"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold shrink-0">25</div><div><h5 className="font-bold mb-1">憲法 第25条 (生存権)</h5><p className="text-slate-600 text-xs">最低限度の生活を営む権利。これを脅かす不作為は許されません。</p></div></div>
        <div className="flex gap-6"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#000666] font-bold shrink-0">7</div><div><h5 className="font-bold m
