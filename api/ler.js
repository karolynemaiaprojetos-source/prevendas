export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { b64, mime, vendorHint, model } = req.body;

  const prompt = `Analise esta pré-venda de ERP e extraia: 1) Nome do vendedor 2) Categoria dos produtos 3) Valor total 4) Número do pedido.\n${vendorHint ? 'Vendedor: ' + vendorHint + '\n' : ''}Responda SOMENTE com JSON sem markdown:\n{"vendedor":"","categoria":"","valor":0,"referencia":"","obs":""}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model || 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mime, data: b64 } },
          { type: 'text', text: prompt }
        ]
      }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
