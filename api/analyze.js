import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { description } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "APIキーが設定されていません" });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // --- 第1段階：法的分析の生成 (Gemini 1.5 Flash) ---
    const modelGen = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const promptGen = `あなたは日本の行政法に精通した調査員です。以下の被害報告を、憲法25条や行政手続法7条に照らして詳しく分析し、改善策を日本語で提示してください。\n\n報告内容：${description}`;
    const resultGen = await modelGen.generateContent(promptGen);
    const draftAnalysis = resultGen.response.text();

    // --- 第2段階：法的整合性の検証 (Gemini 1.5 Pro) ---
    // Proモデルを使用して、Flashの回答に間違いがないか厳格に審査します
    const modelVerify = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const promptVerify = `あなたは上級判事です。以下の法的分析が、日本の法律、判例、厚労省の通知と矛盾していないか厳格に検証してください。
    合格なら冒頭に「PASS」と書き、不備があれば「FAIL」と書いて理由を述べてください。
    
    【検証対象の分析】\n${draftAnalysis}`;
    const resultVerify = await modelVerify.generateContent(promptVerify);
    const verificationResult = resultVerify.response.text();

    // --- 最終判定 ---
    if (verificationResult.includes('PASS')) {
      res.status(200).json({ 
        status: "verified", 
        analysis: draftAnalysis,
        note: "法科学的検証済み"
      });
    } else {
      res.status(200).json({ 
        status: "risky", 
        message: "AIによる解析結果に論理的矛盾の懸念が見つかりました。内容を具体的（いつ、誰が、何と言ったか）に書き直して再試行してください。",
        judge_comment: verificationResult
      });
    }

  } catch (error) {
    res.status(500).json({ error: "AI解析エラー", message: error.message });
  }
}
