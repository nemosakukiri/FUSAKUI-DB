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
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9fb] p-6 text-center animate-in zoom
