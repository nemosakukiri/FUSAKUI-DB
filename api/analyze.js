// api/analyze.js
export default async function handler(req, res) {
  const { description } = req.body;

  // ここでOpenAIなどのAIを呼び出します
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `あなたは日本の行政法と福祉法（生活保護法等）、および憲法に精通したフォレンジック調査員です。
          ユーザーの報告を分析し、以下の項目を日本語で回答してください。
          1. 憲法・法律違反の可能性（％）
          2. 該当する可能性のある条文（例：行政手続法7条、生活保護法7条、憲法25条）
          3. なぜその対応が問題なのかの法的解説
          4. ユーザーへのアドバイス（例：書面で理由を求めるべき、不服申し立ての検討等）`
        },
        { role: "user", content: description }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data.choices[0].message.content);
}
