import React from 'react';
import { ArrowRight, Search, Users, Database, Scale, Quote, Newspaper, Landmark, Sparkles } from 'lucide-react';

const LandingPage = ({ onStart, NOTEBOOK_URL }) => (
  <div className="animate-in fade-in duration-700 w-full max-w-5xl space-y-24">
    <div className="border-y-2 border-black py-8 flex justify-between items-start text-slate-900 w-full">
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2 font-sans">Visible Administrative Inaction</span>
        <h2 className="font-serif text-5xl md:text-9xl font-black tracking-tighter leading-none italic">Evidence.</h2>
      </div>
      <div className="hidden md:block max-w-[250px] text-right font-serif italic text-slate-400 text-[11px]">「あなたの経験は社会を変えるための共通のデータである。」</div>
    </div>

    <section className="bg-[#000666] text-white p-12 md:p-20 rounded-[3rem] shadow-2xl text-left w-full relative overflow-hidden">
      <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter leading-[1.1]">不作為を、<br/><span className="text-[#bdc2ff]">可視化</span>し、変える。</h2>
      <p className="text-xl text-blue-100/80 mb-12 max-w-2xl font-serif italic border-l-4 border-blue-400/30 pl-6 text-justify">
        「窓口で感じた孤独と理不尽を、ここに置いていってください。その経験は、行政の不透明な運用をあぶり出す、かけがえのない『証拠』になります。」
      </p>
      <div className="flex flex-wrap gap-4">
        <button onClick={onStart} className="bg-white text-[#000666] px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">報告を作成する</button>
        <a href={NOTEBOOK_URL} target="_blank" className="bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">法律・通知を検索</a>
      </div>
    </section>

    <section className="grid md:grid-cols-2 gap-16 text-slate-900 w-full text-left font-serif">
      <div className="space-y-6">
        <h3 className="text-4xl font-black italic">Why We Record.</h3>
        <p className="text-lg text-slate-600 leading-relaxed text-justify">行政の「不作為」は目につきにくいものです。しかし、100人が同じ場所で同じ理由で拒絶されていたとしたら？ それは行政の構造的な欠陥の証明になります。あなたの経験をデータ化し、社会へ突きつけるのがこのプロジェクトの目的です。</p>
      </div>
      <div className="bg-slate-50 p-10 rounded-[3rem] space-y-8">
        <div><h4 className="flex items-center gap-2 font-black uppercase text-xs text-blue-600 mb-3 font-sans"><Users className="w-4 h-4"/> あなた一人ではない</h4><p className="text-sm text-slate-500 leading-relaxed">ここには同様の不利益を被った方々の記録が集まっています。自分を守るだけでなく、次に来る誰かのための防波堤を作ることでもあります。</p></div>
        <div><h4 className="flex items-center gap-2 font-black uppercase text-xs text-blue-600 mb-3 font-sans"><Database className="w-4 h-4"/> データを活かす</h4><p className="text-sm text-slate-500 leading-relaxed">蓄積されたデータは匿名化され、報道機関や法曹界へ提供されます。一人の「嫌な経験」が制度改善のための客観的な根拠になります。</p></div>
      </div>
    </section>

    <div className="bg-slate-100 p-16 rounded-[3rem] text-center w-full"><Quote className="w-12 h-12 text-blue-300 mx-auto mb-8" /><h3 className="text-3xl md:text-5xl font-black font-serif text-slate-900 leading-tight">「沈黙を記録に変え、<br/>不作為を正す力に。」</h3></div>
  </div>
);

export default LandingPage;
