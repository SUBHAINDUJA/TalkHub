import fetch from 'node-fetch';

export const chatWithAI = async (req, res) => {
  try {
    const messages = req.body.messages || [{ role: 'user', content: req.body.prompt || '' }];
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages, max_tokens: 800 })
    });

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? JSON.stringify(data);
    res.json({ reply, raw: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
