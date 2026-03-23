// api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { description } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "OpenAI APIキーが設定されていません" });

  try {
    // --- 第1段階：法的分析の生成 (Investigator AI) ---
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "あなたは日本の行政法と憲法に精通した調査員です。ユーザーの報告に対し、憲法25条（生存権）や行政手続法7条（受理義務）に照らした法的分析レポートを日本語で作成してください。" },
          { role: "user", content: `以下の報告を分析してください：\n${description}` }
        ]
      })
    });
    const analysisData = await analysisResponse.json();
    const draftAnalysis = analysisData.choices[0].message.content;

    // --- 第2段階：法的整合性の検証 (Senior Judge AI) ---
    const verifyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "あなたは上級判事です。提示された法的分析が、日本の現行法や判例、厚労省の通知と矛盾していないか厳格にチェックしてください。合格なら冒頭に『PASS』、不備があれば『FAIL』と書き、理由を添えてください。" },
          { role: "user", content: `【検証対象の分析内容】\n${draftAnalysis}` }
        ]
      })
    });
    const verifyData = await verifyResponse.json();
    const verificationResult = verifyData.choices[0].message.content;

    // --- 最終判定とレスポンス ---
    if (verificationResult.startsWith('PASS')) {
      res.status(200).json({ 
        status: "verified", 
        analysis: draftAnalysis,
        judge_note: verificationResult.replace('PASS', '').trim()
      });
    } else {
      res.status(200).json({ 
        status: "risky", 
        message: "AIによる解析結果に法的整合性の懸念が見つかりました。別の表現で再試行するか、専門家へ相談してください。",
        failed_reason: verificationResult
      });
    }

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
