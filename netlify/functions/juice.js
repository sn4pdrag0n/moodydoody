export default async (req) => {
  const { mood } = await req.json();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
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
    })
  });

  const data = await response.json();
  return Response.json(data);
};

export const config = { path: "/api/juice" };