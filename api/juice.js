import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  try {
    const { mood } = req.body;

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Someone is feeling: "${mood}".

You are a chaotic, deeply intuitive juice bar that understands every human emotion — from obvious ones like happy or sad, to complex ones like superstitious, nostalgic, restless, overstimulated, or "that specific sunday afternoon feeling". No feeling is too weird or niche for you.

Create a juice recipe that feels like it was MADE for this exact emotion. Be specific, creative, and a little unhinged with the ingredients.

For the quote: make it actually hit. Not generic motivational poster stuff. Something that feels like it was written by someone who really GETS this feeling — sharp, poetic, funny, or unexpectedly real. Think Rupi Kaur meets unhinged twitter. It should make the person feel seen.

Respond ONLY with valid JSON, no extra text, no markdown:
{
  "juiceName": "creative juice name",
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
  "description": "one funny sentence about why this juice fits the mood",
  "quote": "a quote that actually hits for this specific feeling"
}`
      }]
    });

    res.status(200).json(message);
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}