const API_KEY = 'AIzaSyBxlr_Af26ECgTKORbkd_4Dkmo4Lb6qf8E';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const SYSTEM = `তুমি Fluxed AI — বাংলাদেশের university students-দের জন্য তৈরি একটা AI assistant। তোমার tagline হলো "Always evolving, always growing."

তুমি Banglish-এ কথা বলো (বাংলা + English mix) — যেন একজন smart, caring বড় ভাই বা আপু।

নিয়ম:
- সবসময় Banglish-এ কথা বলো
- Specific, actionable advice দাও
- যেকোনো topic-এ naturally কথা বলো
- CV বানাতে হলে একটা একটা করে তথ্য নাও
- Final output English-এ লেখো
- Response concise রাখো`;

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { history } = JSON.parse(event.body);

    const body = {
      system_instruction: { parts: [{ text: SYSTEM }] },
      contents: history,
      generationConfig: { temperature: 0.9, maxOutputTokens: 800 }
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: HEADERS,
        body: JSON.stringify({ error: data.error?.message || 'API error' })
      };
    }

    const reply = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ reply })
    };

  } catch (e) {
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: e.message })
    };
  }
};
