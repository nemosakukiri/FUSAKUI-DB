export default async function handler(req, res) {
  // GETリクエスト（ただのアクセス）には反応しないようにする
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { description } = req.body;

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
            content: "あなたは日本の行政法と福祉法に精通した調査員です。ユーザーの報告を法的視点で分析してください。"
          },
          { role: "user", content: description }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json(data.choices[0].message.content);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
