// api/analyze.js (Google Gemini 無料2段構え版)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { description } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // 前に設定したGeminiの鍵を使います

  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEYが設定されていません" });

  try {
    // --- 第1段：法的分析の生成 (Gemini 1.5 Flash) ---
    const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const genRes = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `あなたは日本の行政法に精通した調査員です。以下の被害報告を、憲法25条や行政手続法7条に照らして詳しく分析してください。\n\n報告内容：${description}` }] }]
      })
    });
    const genData = await genRes.json();
    const draftAnalysis = genData.candidates[0].content.parts[0].text;

    // --- 第2段：法的整合性の厳格検証 (Gemini 1.5 Pro - より賢いモデル) ---
    // ※ 1.5 Proを使うことで、Flashのミスを厳しくチェックさせます
    const verifyUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    const verifyRes = await fetch(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `あなたは上級判事です。以下の法的分析が、日本の法律や厚労省の通知と矛盾していないか厳格に検証してください。
            合格なら冒頭に「PASS」と書き、不備があれば「FAIL」と書いて理由を述べてください。
            
            【検証対象の分析】\n${draftAnalysis}`
          }]
        }]
      })
    });
    const verifyData = await verifyRes.json();
    const verificationResult = verifyData.candidates[0].content.parts[0].text;

    // --- 最終判定 ---
    if (verificationResult.includes('PASS')) {
      res.status(200).json({ 
        status: "verified", 
        analysis: draftAnalysis,
        judge_note: "法科学的検証済み"
      });
    } else {
      res.status(200).json({ 
        status: "risky", 
        message: "解析結果に不備が見つかりました。内容を具体的かつ客観的に書き直して再試行してください。",
        debug: verificationResult // どこがダメだったかAIの指摘を返す
      });
    }

  } catch (error) {
    res.status(500).json({ error: "AI通信エラー", details: error.message });
  }
}
