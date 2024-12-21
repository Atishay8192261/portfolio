import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are a helpful assistant." },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    res.status(200).json({ response: response.choices[0]?.message?.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
