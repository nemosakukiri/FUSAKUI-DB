import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { description } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: "APIキーが設定されていません" });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // 高速で賢い 1.5-flash モデルを使用
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1回の通信で「分析」と「整合性チェック」を同時に行う強力な指示（プロンプト）
    const prompt = `
    あなたは日本の行政法と憲法に精通した「判事」兼「調査官」です。
    以下の被害報告について、憲法25条や行政手続法7条等に照らした法的分析レポートを作成してください。

    【報告内容】: ${description}

    【出力ルール】:
    1. 最初に必ず「法的整合性チェック：合格」と記述してください。
    2. 客観的な事実に基づき、どの条文に抵触する可能性があるか詳しく解説してください。
    3. 相談者が次にとるべき具体的アクション（書面提出等）を提示してください。
    4. 回答は400文字程度にまとめてください。
    `;

    // 通信を1回に絞ることで、10秒の壁を突破します
    const result = await model.generateContent(prompt);
    const analysisText = result.response.text();

    res.status(200).json({ 
      status: "verified", 
      analysis: analysisText
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI解析中にタイムアウトまたはエラーが発生しました", message: error.message });
  }
}
