import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

// Helper function to scrape DuckDuckGo
async function searchWeb(query: string, numResults: int = 4) {
  try {
    const searchUrl = "https://html.duckduckgo.com/html/";
    const formData = new URLSearchParams();
    formData.append('q', query);

    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData
    });

    if (!response.ok) {
      console.error(`DuckDuckGo error: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];

    $('.result').each((i, elem) => {
      if (results.length >= numResults) return false; // break loop

      const titleElem = $(elem).find('a.result__url');
      const snippetElem = $(elem).find('a.result__snippet');

      if (titleElem.length > 0 && snippetElem.length > 0) {
        const title = titleElem.text().trim();
        const rawUrl = titleElem.attr('href') || '';
        let realUrl = rawUrl;

        if (rawUrl.startsWith('//duckduckgo.com/l/?')) {
          const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
          realUrl = urlParams.get('uddg') || rawUrl;
        }

        const snippet = snippetElem.text().trim();
        results.push({ title, url: realUrl, snippet });
      }
    });

    return results;
  } catch (error) {
    console.error("DuckDuckGo exception:", error);
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Internal Server Error: Missing API Key' });
  }

  const { ticker, horizon, model } = req.body;
  if (!ticker || !horizon) {
    return res.status(400).json({ error: 'Bad Request: Missing ticker or horizon' });
  }

  // 1. Perform DuckDuckGo Search Grounding
  const qStr = `${ticker} stock price news fundamental analysis ${new Date().getFullYear()}`;
  const searchResults = await searchWeb(qStr, 5);
  let groundingContext = "";
  
  if (searchResults.length > 0) {
    groundingContext = "Real-time web search results for context:\n\n";
    searchResults.forEach((r, i) => {
      groundingContext += `[${i+1}] Source: ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}\n\n`;
    });
  } else {
    groundingContext = "No real-time web context available. Rely on your base knowledge.";
  }

  // 2. Prepare Gemini Payload
  const primaryModel = model || 'gemini-3.1-pro-preview';
  const modelsToTry = [
    primaryModel,
    'gemini-3-flash-preview',
    'gemini-2.5-pro',
    'gemini-2.5-flash'  
  ];

  const payload = {
    contents: [{
      parts: [{
        text: `Act as an elite quantitative analyst and ML predictive model. Analyze the stock ${ticker} for a ${horizon} horizon. 
        
        CRITICAL OUTPUT FORMATTING: 
        You MUST structure your response EXACTLY in these 4 distinct sections wrapped in specific tags so they can be parsed by my front-end. Do NOT deviate from this format.
        
        <MARKET_CONTEXT>
        Provide a real-time company overview, recent price movement (cite specific recent prices if available), and trading volume sentiment.
        </MARKET_CONTEXT>
        
        <TECHNICAL_INDICATORS>
        Provide key technical indicators including RSI, MACD, and key support/resistance levels.
        </TECHNICAL_INDICATORS>
        
        <ML_PREDICTION>
        Using methodology similar to an XGBoost momentum model, predict the return range percentage for the next ${horizon}. Include a confidence interval and a brief note on the model features driving this prediction.
        </ML_PREDICTION>
        
        <RISK_ASSESSMENT>
        Provide a risk level (Strictly: LOW, MED, or HIGH). Follow this with a brief strategy recommendation and key macroeconomic or fundamental driving factors.
        </RISK_ASSESSMENT>

        ---
        ${groundingContext}
        `
      }]
    }]
    // We removed tools: [{ google_search: {} }] since we handle extraction natively
  };

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = data;
        console.error(`Model ${modelName} failed:`, data);
        continue; // Try next fallback model
      }

      // Attach the physical sources we found back to the client
      data.customSources = searchResults;

      return res.status(200).json(data);
    } catch (error) {
      console.error(`Network error for model ${modelName}:`, error);
      lastError = { error: 'Failed to fetch' };
    }
  }

  // If all models fail
  return res.status(500).json({ error: 'All models failed', details: lastError });
}
